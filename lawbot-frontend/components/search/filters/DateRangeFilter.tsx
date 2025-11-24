"use client";

import { Slider } from "@/components/ui/slider";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

export function DateRangeFilter({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: DateRangeFilterProps) {
    return (
        <div className="space-y-3">
            <h4 className="font-medium text-base flex items-center gap-2">
                <Calendar size={16} /> 日期範圍
            </h4>
            <div className="px-1">
                <Slider
                    defaultValue={[
                        parseInt(startDate?.split('-')[0] || '1945'),
                        parseInt(endDate?.split('-')[0] || '2025')
                    ]}
                    max={2025}
                    min={1945}
                    step={1}
                    onValueChange={(values) => {
                        setStartDate(`${values[0]}-01-01`);
                        setEndDate(`${values[1]}-12-31`);
                    }}
                />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-1">
                <span>{startDate?.split('-')[0] || '1945'}</span>
                <span>{endDate?.split('-')[0] || '2025'}</span>
            </div>
        </div>
    );
}
