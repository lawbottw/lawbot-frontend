"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlidersHorizontal } from "lucide-react";
import { DocumentTypeFilter } from "./DocumentTypeFilter";
import { JudgmentFilters } from "./JudgmentFilters";
import { DateRangeFilter } from "./DateRangeFilter";
import { CanvasFormatTypeFilter } from "./CanvasFormatTypeFilter";

interface FilterSheetTriggerProps {
    selectedSources: string[];
    setSelectedSources: (sources: string[]) => void;
    judgmentTypes: string[];
    setJudgmentTypes: (types: string[]) => void;
    judgmentLevels: string[];
    setJudgmentLevels: (levels: string[]) => void;
    caseTypes: string[];
    setCaseTypes: (types: string[]) => void;
    featuredFilters: string[];
    setFeaturedFilters: (filters: string[]) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    temperature: number;
    setTemperature: (temp: number) => void;
    canvasFormatType: number;
    setCanvasFormatType: (type: number) => void;
    resetFilters: () => void;
}

export function FilterSheetTrigger({
    selectedSources,
    setSelectedSources,
    judgmentTypes,
    setJudgmentTypes,
    judgmentLevels,
    setJudgmentLevels,
    caseTypes,
    setCaseTypes,
    featuredFilters,
    setFeaturedFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    temperature,
    setTemperature,
    canvasFormatType,
    setCanvasFormatType,
    resetFilters,
}: FilterSheetTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const isMultiSelectFilterActive = (values: string[]): boolean => {
        return values.length > 0 && (values.length > 1 || values[0] !== 'all');
    };

    const isAnyFilterActive = (
        isMultiSelectFilterActive(selectedSources) ||
        isMultiSelectFilterActive(judgmentTypes) ||
        isMultiSelectFilterActive(caseTypes) ||
        isMultiSelectFilterActive(featuredFilters) ||
        (!!startDate && startDate !== "1945-01-01") ||
        (!!endDate && endDate !== '2025-12-31') ||
        temperature !== 0.3 ||
        canvasFormatType !== 1
    );

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger id="step3" asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    className="p-2 h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-secondary/80 relative"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {hasMounted && isAnyFilterActive && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>AI自定義</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-grow pr-6 -mr-6">
                    <div className="space-y-6 py-4">
                        {/* Document Type Selection */}
                        <DocumentTypeFilter
                            selectedSources={selectedSources}
                            setSelectedSources={setSelectedSources}
                            setJudgmentLevels={setJudgmentLevels}
                            setJudgmentTypes={setJudgmentTypes}
                            setCaseTypes={setCaseTypes}
                            setFeaturedFilters={setFeaturedFilters}
                        />

                        {/* Judgment Specific Filters (Conditional) */}
                        {selectedSources.includes('judgment') && (
                            <JudgmentFilters
                                judgmentTypes={judgmentTypes}
                                setJudgmentTypes={setJudgmentTypes}
                                judgmentLevels={judgmentLevels}
                                setJudgmentLevels={setJudgmentLevels}
                                caseTypes={caseTypes}
                                setCaseTypes={setCaseTypes}
                                featuredFilters={featuredFilters}
                                setFeaturedFilters={setFeaturedFilters}
                            />
                        )}

                        {/* Date Range Filter */}
                        <Separator />
                        <DateRangeFilter
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />

                        {/* Canvas Format Type Selection */}
                        <Separator />
                        <CanvasFormatTypeFilter
                            canvasFormatType={canvasFormatType}
                            setCanvasFormatType={setCanvasFormatType}
                        />
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4 border-t flex justify-between">
                    <Button
                        variant="outline"
                        type="button"
                        className="mt-4 sm:mt-0"
                        onClick={() => {
                            resetFilters();
                        }}
                    >
                        重設條件
                    </Button>
                    <SheetClose asChild >
                        <Button type="button">關閉</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
