"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";

interface DocumentTypeFilterProps {
    selectedSources: string[];
    setSelectedSources: (sources: string[]) => void;
    setJudgmentLevels: (levels: string[]) => void;
    setJudgmentTypes: (types: string[]) => void;
    setCaseTypes: (types: string[]) => void;
    setFeaturedFilters: (filters: string[]) => void;
}

const getDocTypeLabel = (type: string): string => {
    switch (type) {
        case 'all': return '全部';
        case 'law': return '法律';
        case 'directive': return '函釋';
        case 'constitutional': return '憲法法庭';
        case 'explanation': return '司法解釋';
        case 'resolution': return '決議';
        case 'legal_question': return '法律問題';
        case 'judgment': return '裁判';
        default: return type;
    }
};

const handleCheckboxChange = (
    value: string,
    checked: boolean | 'indeterminate',
    currentValues: string[],
    setter: (values: string[]) => void
) => {
    if (value === 'all') {
        setter(checked ? ['all'] : []);
    } else {
        if (checked) {
            setter([...currentValues.filter(v => v !== 'all'), value]);
        } else {
            const newValues = currentValues.filter(v => v !== value);
            setter(newValues);
        }
    }
};

export function DocumentTypeFilter({
    selectedSources,
    setSelectedSources,
    setJudgmentLevels,
    setJudgmentTypes,
    setCaseTypes,
    setFeaturedFilters,
}: DocumentTypeFilterProps) {
    return (
        <div>
            <h4 className="font-medium mb-3 text-base flex items-center gap-2">
                <FileText size={16} /> 文件類型
            </h4>
            <div className="grid grid-cols-3 gap-3">
                {['all', 'law', 'judgment', 'constitutional', 'explanation', 'resolution', 'legal_question', 'directive'].map((value) => (
                    <div key={`doc-${value}`} className="flex items-center space-x-2">
                        <Checkbox
                            id={`sheet-doc-${value}`}
                            checked={selectedSources.includes(value)}
                            onCheckedChange={(checked) => {
                                if (value === 'all') {
                                    if (checked) {
                                        setSelectedSources(['all']);
                                        setJudgmentLevels(['all']);
                                        setJudgmentTypes(['all']);
                                        setCaseTypes(['all']);
                                        setFeaturedFilters(['all']);
                                    } else {
                                        setSelectedSources([]);
                                    }
                                } else {
                                    handleCheckboxChange(value, checked, selectedSources, setSelectedSources);
                                }
                            }}
                        />
                        <label htmlFor={`sheet-doc-${value}`} className="text-sm cursor-pointer">
                            {getDocTypeLabel(value)}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
