import { useState, useEffect, useMemo } from 'react';

interface StoredFilters {
    judgmentTypes: string[];
    judgmentLevels: string[];
    caseTypes: string[];
    featuredFilters: string[];
    selectedSources: string[];
    startDate: string;
    endDate: string;
    sortBy: string;
    canvasFormatType: number;
}

// Define the localStorage key
const LOCAL_STORAGE_KEY = 'lawbotSearchFilters';

// Define options for the hook
interface UseSearchFiltersOptions {
    persist?: boolean; // Option to enable/disable localStorage persistence
}

// Helper function to get the default initial state
const getDefaultState = (): StoredFilters => ({
    judgmentTypes: ['all'],
    judgmentLevels: ['all'],
    caseTypes: ['all'],
    featuredFilters: ['all'],
    selectedSources: ['all'],
    startDate: "", // Default start date (or consider a sensible default like "1945-01-01")
    endDate: "",   // Default end date
    sortBy: "score",
    canvasFormatType: 1, // Add default canvas format type
});

// Helper function to safely load state from localStorage
const loadStateFromLocalStorage = (): Partial<StoredFilters> | null => { // Return null if not found/error
    // Ensure this runs only on the client-side
    if (typeof window === 'undefined') {
        return null; // Not in browser
    }
    try {
        const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedItem) {
            const parsed = JSON.parse(storedItem);
            // Basic validation - ensure it's an object and has at least one expected key
            if (parsed && typeof parsed === 'object' && 'selectedSources' in parsed) {
                // Further validation could be added here if needed (e.g., check array types)
                return parsed as Partial<StoredFilters>;
            }
        }
    } catch (error) {
        console.error("Error reading filters from localStorage:", error);
    }
    return null; // Return null on error or if not found/invalid
};

// Helper function to determine the initial state by merging defaults and localStorage
// This function should ideally run *once* when the hook initializes.
const getInitialState = (persist: boolean | undefined): StoredFilters => {
    const defaults = getDefaultState();
    if (!persist) {
        return defaults; // If persistence is off, just use defaults
    }

    const loaded = loadStateFromLocalStorage();

    if (loaded) {
        // Merge loaded state with defaults, ensuring all keys exist
        // and providing defaults for any missing keys in localStorage.
        // Use nullish coalescing (??) for safety.
        return {
            judgmentTypes: loaded.judgmentTypes ?? defaults.judgmentTypes,
            judgmentLevels: loaded.judgmentLevels ?? defaults.judgmentLevels,
            caseTypes: loaded.caseTypes ?? defaults.caseTypes,
            featuredFilters: loaded.featuredFilters ?? defaults.featuredFilters,
            selectedSources: loaded.selectedSources ?? defaults.selectedSources,
            startDate: loaded.startDate ?? defaults.startDate,
            endDate: loaded.endDate ?? defaults.endDate,
            sortBy: loaded.sortBy ?? defaults.sortBy,
            canvasFormatType: loaded.canvasFormatType ?? defaults.canvasFormatType, // Add canvas format type loading
        };
    }

    return defaults; // Fallback to defaults if nothing loaded or persistence off
};


// --- MOVED & EXPORTED: Helper function for URL params ---
// Helper to filter out 'all' if other values exist
export const getUrlParams = (values: string[]): string[] => {
    if (!Array.isArray(values)) return []; // Safety check

    if (values.length > 1 && values.includes('all')) {
        return values.filter(v => v !== 'all');
    }
    // If only 'all' is selected, return empty array (API likely handles this)
    if (values.length === 1 && values[0] === 'all') {
        return [];
    }
    // Otherwise, return the values as is (could be specific values or empty)
    return values;
};


export function useSearchFilters(options?: UseSearchFiltersOptions) {
    // Determine initial state once using useMemo based on the persist option.
    // This ensures getInitialState (which reads localStorage) runs only when necessary
    // and primarily on the client-side after hydration.
    const initialState = useMemo(() => getInitialState(options?.persist), [options?.persist]);

    // State for each filter, initialized with the determined initial state
    const [judgmentTypes, setJudgmentTypes] = useState<string[]>(initialState.judgmentTypes);
    const [judgmentLevels, setJudgmentLevels] = useState<string[]>(initialState.judgmentLevels);
    const [caseTypes, setCaseTypes] = useState<string[]>(initialState.caseTypes);
    const [featuredFilters, setFeaturedFilters] = useState<string[]>(initialState.featuredFilters);
    const [selectedSources, setSelectedSources] = useState<string[]>(initialState.selectedSources);
    const [startDate, setStartDate] = useState(initialState.startDate);
    const [endDate, setEndDate] = useState(initialState.endDate);
    const [sortBy, setSortBy] = useState(initialState.sortBy);
    const [canvasFormatType, setCanvasFormatType] = useState<number>(initialState.canvasFormatType); // Add canvas format type state

    // --- REMOVED: Effect to load from localStorage after mount ---
    // The state is now initialized directly with localStorage values (if available and persist is true)

    // Effect to save state to localStorage whenever any filter changes
    useEffect(() => {
        // Only save if persistence is enabled and in a browser environment
        if (options?.persist && typeof window !== 'undefined') {
            const currentState: StoredFilters = {
                judgmentTypes,
                judgmentLevels,
                caseTypes,
                featuredFilters,
                selectedSources,
                startDate,
                endDate,
                sortBy,
                canvasFormatType, // Add canvas format type to saved state
            };
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
            } catch (error) {
                console.error("Error saving filters to localStorage:", error);
            }
        }
        // Add all filter states as dependencies
    }, [
        judgmentTypes,
        judgmentLevels,
        caseTypes,
        featuredFilters,
        selectedSources,
        startDate,
        endDate,
        sortBy,
        canvasFormatType, // Add canvas format type dependency
        options?.persist // Add persist option as dependency
    ]);

    // Use useMemo to calculate derived URL parameter values efficiently
    const urlJudgmentParams = useMemo(() => getUrlParams(judgmentTypes), [judgmentTypes]);
    const urlLevelParams = useMemo(() => getUrlParams(judgmentLevels), [judgmentLevels]);
    const urlCaseTypeParams = useMemo(() => getUrlParams(caseTypes), [caseTypes]);
    const urlFeaturedParams = useMemo(() => getUrlParams(featuredFilters), [featuredFilters]);
    const urlSourceParams = useMemo(() => getUrlParams(selectedSources), [selectedSources]);
    // Dates are strings, no special processing needed here for URL params
    const urlStartDateParam = startDate;
    const urlEndDateParam = endDate;

    // Function to reset all filters to their default state
    const resetFilters = () => {
        const defaults = getDefaultState();
        setJudgmentTypes(defaults.judgmentTypes);
        setJudgmentLevels(defaults.judgmentLevels);
        setCaseTypes(defaults.caseTypes);
        setFeaturedFilters(defaults.featuredFilters);
        setSelectedSources(defaults.selectedSources);
        setStartDate(defaults.startDate);
        setEndDate(defaults.endDate);
        setSortBy(defaults.sortBy);
        setCanvasFormatType(defaults.canvasFormatType); // Reset canvas format type to default
        // Also clear localStorage if persistence is enabled
        if (options?.persist && typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    return {
        // Return state values and setters
        judgmentTypes, setJudgmentTypes,
        judgmentLevels, setJudgmentLevels,
        caseTypes, setCaseTypes,
        featuredFilters, setFeaturedFilters,
        selectedSources, setSelectedSources,
        startDate, setStartDate,
        endDate, setEndDate,
        sortBy, setSortBy,
        canvasFormatType, setCanvasFormatType, // Return canvas format type state and setter
        // Return derived URL params
        urlJudgmentParams,
        urlLevelParams,
        urlCaseTypeParams,
        urlFeaturedParams,
        urlSourceParams,
        urlStartDateParam,
        urlEndDateParam,
        // Return the reset function
        resetFilters,
    };
}
