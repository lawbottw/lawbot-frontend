"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface JudgmentFiltersProps {
    judgmentTypes: string[];
    setJudgmentTypes: (types: string[]) => void;
    judgmentLevels: string[];
    setJudgmentLevels: (levels: string[]) => void;
    caseTypes: string[];
    setCaseTypes: (types: string[]) => void;
    featuredFilters: string[];
    setFeaturedFilters: (filters: string[]) => void;
}

const judgmentTypeOptions = {
    'all': '全部',
    '刑事': '刑事',
    '民事': '民事',
    '行政': '行政',
    '刑補': '刑補',
    '懲戒': '懲戒',
    '訴願': '訴願',
};

const caseTypeOptions = {
    'all': '全部',
    '判決': '判決',
    '裁定': '裁定',
    '其他': '其他',
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

export function JudgmentFilters({
    judgmentTypes,
    setJudgmentTypes,
    judgmentLevels,
    setJudgmentLevels,
    caseTypes,
    setCaseTypes,
    featuredFilters,
    setFeaturedFilters,
}: JudgmentFiltersProps) {
    return (
        <>
            <Separator />
            {/* Featured Filter */}
            <div className="space-y-3">
                <h4 className="font-medium text-base">精選判決</h4>
                <div className="grid grid-cols-3 gap-3">
                    {['all', 'F', 'G'].map((value) => (
                        <div key={`sheet-featured-${value}`} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sheet-featured-${value}`}
                                checked={featuredFilters.includes(value)}
                                onCheckedChange={(checked) => {
                                    handleCheckboxChange(value, checked, featuredFilters, setFeaturedFilters);
                                }}
                            />
                            <label htmlFor={`sheet-featured-${value}`} className="text-sm cursor-pointer">
                                {value === 'all' ? '全部' : value === 'F' ? '精選' : '大法庭'}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Judgment Type Filter */}
            <div className="space-y-3">
                <h4 className="font-medium text-base">案件類型</h4>
                <div className="grid grid-cols-3 gap-3">
                    {Object.entries(judgmentTypeOptions).map(([value, label]) => (
                        <div key={`sheet-judgment-${value}`} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sheet-judgment-${value}`}
                                checked={judgmentTypes.includes(value)}
                                onCheckedChange={(checked) => {
                                    handleCheckboxChange(value, checked, judgmentTypes, setJudgmentTypes);
                                }}
                            />
                            <label htmlFor={`sheet-judgment-${value}`} className="text-sm cursor-pointer">
                                {label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Judgment Level Filter */}
            <div className="space-y-3">
                <h4 className="font-medium text-base">法院層級</h4>
                <div className="grid grid-cols-3 gap-3">
                    {['all', '最高', '高等', '地方', '智財'].map((value) => (
                        <div key={`sheet-level-${value}`} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sheet-level-${value}`}
                                checked={judgmentLevels.includes(value)}
                                onCheckedChange={(checked) => {
                                    handleCheckboxChange(value, checked, judgmentLevels, setJudgmentLevels);
                                }}
                            />
                            <label htmlFor={`sheet-level-${value}`} className="text-sm cursor-pointer">
                                {value === 'all' ? '全部' : value}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Case Type Filter */}
            <div className="space-y-3">
                <h4 className="font-medium text-base">裁判類型</h4>
                <div className="grid grid-cols-3 gap-3">
                    {Object.entries(caseTypeOptions).map(([value, label]) => (
                        <div key={`sheet-case-${value}`} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sheet-case-${value}`}
                                checked={caseTypes.includes(value)}
                                onCheckedChange={(checked) => {
                                    handleCheckboxChange(value, checked, caseTypes, setCaseTypes);
                                }}
                            />
                            <label htmlFor={`sheet-case-${value}`} className="text-sm cursor-pointer">
                                {label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
