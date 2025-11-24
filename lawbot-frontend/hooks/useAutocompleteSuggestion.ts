import { useState, useRef, useEffect, useCallback } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import { useFavorites } from '@/context/FavoriteContext';
import { FolderHierarchy } from "@/types/favorite";
import { Suggestion, UseAutocompleteSuggestionProps } from '@/types/suggestion';


export function useAutocompleteSuggestion({
  maxSuggestions = 10,
  isDeepResearchMode = false,
  filesPresent = false,
  websearchEnabled = false
}: UseAutocompleteSuggestionProps = {}) {
  const { folderTree, loading: favoritesLoading } = useFavorites();
  
  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<FuseResult<Suggestion>[]>([]);
  const [initialSuggestions, setInitialSuggestions] = useState<Suggestion[]>([]);
  const [autocompleteTriggerIndex, setAutocompleteTriggerIndex] = useState<number | null>(null);
  
  const fuseRef = useRef<Fuse<Suggestion> | null>(null);
  const allSuggestionsRef = useRef<Suggestion[]>([]);

  // 新增: selectedSources 狀態與 setter
  const [selectedSources, setSelectedSources] = useState<Suggestion[]>([]);

  // Prepare data for Fuse.js and initial suggestions
  useEffect(() => {
    if (!favoritesLoading && folderTree?.tree) {
      const allSuggestionsData: Suggestion[] = [];
      const addedItemDocIds = new Set<string>(); // Keep track of added item doc_ids
      const folderIdToPath = new Map<string, string>(); // Map folder_id to path

      // Helper function to build folder path from hierarchy
      const buildFolderPath = (folders: FolderHierarchy[], parentPath = ''): void => {
        folders.forEach(folder => {
          const currentPath = parentPath ? `${parentPath}/${folder.folder_name}` : folder.folder_name;
          folderIdToPath.set(folder.folder_id, currentPath);
          
          // Add folder suggestion with unique name based on folder_id and path
          // This ensures each folder has a unique identifier even if names are the same
          const uniqueName = `${folder.folder_name.replace(/\s+/g, '')}_${folder.folder_id}`;
          
          allSuggestionsData.push({ 
            type: 'folder', 
            id: folder.folder_id, 
            name: uniqueName, // Use unique name for identification
            displayName: folder.folder_name,
            path: currentPath,
            folder: {
              folder_id: folder.folder_id,
              user_id: folder.user_id,
              folder_name: folder.folder_name,
              parent_folder_id: folder.parent_folder_id,
              created_at: folder.created_at,
              updated_at: folder.updated_at,
              favorites: folder.favorites
            }
          });

          // Add unique individual item suggestions with path context
          folder.favorites?.forEach(item => {
            // Only add item if its doc_id hasn't been added yet
            if (item.doc_id && !addedItemDocIds.has(item.doc_id)) {
              // Create unique name for item to avoid conflicts with similarly named items
              const uniqueName = `${item.title.replace(/\s+/g, '')}_${item.favorite_id}`;
              
              allSuggestionsData.push({ 
                type: 'item', 
                id: item.favorite_id, 
                name: uniqueName, // Use unique name for identification
                displayName: item.title,
                path: currentPath,
                item 
              });
              addedItemDocIds.add(item.doc_id); // Mark this doc_id as added
            }
          });

          // Recursively process children
          if (folder.children && folder.children.length > 0) {
            buildFolderPath(folder.children, currentPath);
          }
        });
      };

      // Build suggestions from folder tree
      buildFolderPath(folderTree.tree);

      // Sort suggestions (folders first, then items alphabetically by displayName)
      allSuggestionsData.sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          return (a.displayName || a.name).localeCompare(b.displayName || b.name);
      });

      // Store the full list
      allSuggestionsRef.current = allSuggestionsData;

      // Set initial suggestions (first N items)
      setInitialSuggestions(allSuggestionsData.slice(0, maxSuggestions));

      // Initialize Fuse with all data - now includes path in search
      fuseRef.current = new Fuse(allSuggestionsData, {
        keys: [
          { name: 'displayName', weight: 0.7 }, // Primary search on display name
          { name: 'path', weight: 0.3 } // Secondary search on path
        ],
        includeScore: true,
        threshold: 0.4, // Slightly more permissive threshold for path matching
        includeMatches: true, // Include match information to prioritize results
      });
    }
  }, [folderTree, favoritesLoading, maxSuggestions]);

  const handleAutocompleteSearch = useCallback((query: string) => {
    if (!fuseRef.current) {
        setAutocompleteSuggestions([]);
        setShowAutocomplete(false); // Hide if fuse isn't ready
        return;
    }

    if (query.trim() === '') {
      // Show initial suggestions if query is empty (only '@' typed)
      // Map initial suggestions to FuseResult-like structure for consistent rendering
      const initialFuseResults: FuseResult<Suggestion>[] = initialSuggestions.map(item => ({
          item: item,
          refIndex: -1, // Indicate it's not from a real Fuse search
          score: 1 // Assign a default score (lower is better in Fuse, but we just need the structure)
      }));
      setAutocompleteSuggestions(initialFuseResults);
      setShowAutocomplete(true); // Ensure it shows
    } else {
      // Perform Fuse search for non-empty query
      const results = fuseRef.current.search(query);
      
      // Enhanced sorting logic for path-based queries
      const sortedResults = results.sort((a, b) => {
        // If query starts with '/' or contains '/', prioritize path matches
        if (query.includes('/')) {
          const aPathMatch = a.item.path?.toLowerCase().includes(query.toLowerCase()) || false;
          const bPathMatch = b.item.path?.toLowerCase().includes(query.toLowerCase()) || false;
          
          if (aPathMatch && !bPathMatch) return -1;
          if (!aPathMatch && bPathMatch) return 1;
          
          // If both or neither match path, fall back to score
          return (a.score || 0) - (b.score || 0);
        }
        
        // Default sorting by score
        return (a.score || 0) - (b.score || 0);
      });
      
      setAutocompleteSuggestions(sortedResults.slice(0, maxSuggestions * 2)); // Show slightly more results when searching
      setShowAutocomplete(true); // Ensure it shows
    }
  }, [initialSuggestions, maxSuggestions]);

  const parseAutocomplete = useCallback((value: string, cursorPosition: number) => {
    // If in deep research mode, don't even check for autocomplete trigger
    if (isDeepResearchMode) {
      setShowAutocomplete(false);
      setAutocompleteTriggerIndex(null);
      return { triggerIndex: null, searchTerm: "" };
    }

    // Disable autocomplete if files are present or websearch is enabled
    if (filesPresent || websearchEnabled) {
      setShowAutocomplete(false);
      setAutocompleteTriggerIndex(null);
      return { triggerIndex: null, searchTerm: "" };
    }

    let triggerIndex: number | null = null;
    let searchTerm = "";

    // Find the last '@' before the current cursor position
    const lastAtSymbolIndex = value.lastIndexOf('@', cursorPosition - 1);

    if (lastAtSymbolIndex !== -1) {
      // Extract the text between the '@' and the cursor
      const textBetween = value.substring(lastAtSymbolIndex + 1, cursorPosition);

      // Check if the text between contains only non-whitespace characters
      if (!/\s/.test(textBetween)) {
        // Valid trigger found
        triggerIndex = lastAtSymbolIndex;
        searchTerm = textBetween;
      }
    }

    // Update state based on whether a valid trigger was found
    if (triggerIndex !== null) {
      setAutocompleteTriggerIndex(triggerIndex);
      handleAutocompleteSearch(searchTerm);
    } else {
      setShowAutocomplete(false);
      setAutocompleteTriggerIndex(null);
    }

    return { triggerIndex, searchTerm };
  }, [isDeepResearchMode, filesPresent, websearchEnabled, handleAutocompleteSearch]);

  const hideAutocomplete = useCallback(() => {
    setShowAutocomplete(false);
    setAutocompleteTriggerIndex(null);
  }, []);

  // 新增: insertSuggestion 方法
  const insertSuggestion = useCallback((
    suggestion: Suggestion,
    {
      value,
      onChange,
      textareaRef,
      toast
    }: {
      value: string,
      onChange: (v: string) => void,
      textareaRef: React.RefObject<HTMLTextAreaElement>,
      toast: any
    }
  ) => {
    if (textareaRef.current && autocompleteTriggerIndex !== null) {
      const currentValue = value;
      const hasFolder = selectedSources.some(s => s.type === 'folder');
      const hasItems = selectedSources.some(s => s.type === 'item');
      const currentItemCount = selectedSources.filter(s => s.type === 'item').length;

      // Block insertion if files are present
      if (filesPresent) {
        toast.error("已上傳檔案時，無法新增資料來源。");
        const newValue = currentValue.substring(0, autocompleteTriggerIndex) + currentValue.substring(textareaRef.current.selectionStart);
        onChange(newValue);
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(autocompleteTriggerIndex, autocompleteTriggerIndex);
        hideAutocomplete();
        return;
      }

      // --- Rule Enforcement ---
      if (suggestion.type === 'folder') {
        if (hasFolder || hasItems) {
          toast.error("已選擇資料夾或檔案時，無法再加入資料夾。");
          const newValue = currentValue.substring(0, autocompleteTriggerIndex) + currentValue.substring(textareaRef.current.selectionStart);
          onChange(newValue);
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(autocompleteTriggerIndex, autocompleteTriggerIndex);
          hideAutocomplete();
          return;
        }
      } else if (suggestion.type === 'item') {
        if (hasFolder) {
          toast.error("已選擇資料夾，無法同時選擇單一檔案。");
          const newValue = currentValue.substring(0, autocompleteTriggerIndex) + currentValue.substring(textareaRef.current.selectionStart);
          onChange(newValue);
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(autocompleteTriggerIndex, autocompleteTriggerIndex);
          hideAutocomplete();
          return;
        }
        if (currentItemCount >= 5) {
          toast.error("最多只能選擇 5 個檔案來源。");
          const newValue = currentValue.substring(0, autocompleteTriggerIndex) + currentValue.substring(textareaRef.current.selectionStart);
          onChange(newValue);
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(autocompleteTriggerIndex, autocompleteTriggerIndex);
          hideAutocomplete();
          return;
        }
      }

      const prefix = currentValue.substring(0, autocompleteTriggerIndex);
      const suffix = currentValue.substring(textareaRef.current.selectionStart);
      const newValue = `${prefix}${suffix}`;
      onChange(newValue);

      const newCursorPosition = autocompleteTriggerIndex;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);

      hideAutocomplete();

      setSelectedSources(prev => {
        if (!prev.some(s => s.id === suggestion.id && s.type === suggestion.type)) {
          if (suggestion.type === 'folder') {
            return [suggestion];
          } else {
            return [...prev, suggestion];
          }
        }
        return prev;
      });
    }
  }, [autocompleteTriggerIndex, selectedSources, filesPresent, hideAutocomplete]);

  // 新增: 移除 source 方法
  const removeSource = useCallback((sourceToRemove: Suggestion) => {
    setSelectedSources(prev => prev.filter(s => !(s.id === sourceToRemove.id && s.type === sourceToRemove.type)));
  }, []);

  return {
    // State
    showAutocomplete,
    autocompleteSuggestions,
    autocompleteTriggerIndex,
    selectedSources,
    setSelectedSources,

    // Functions
    handleAutocompleteSearch,
    parseAutocomplete,
    hideAutocomplete,
    insertSuggestion,
    removeSource,

    // Loading state
    isLoading: favoritesLoading
  };
}
