"use client";

import { FileEdit } from "lucide-react";

interface CanvasFormatTypeFilterProps {
    canvasFormatType: number;
    setCanvasFormatType: (type: number) => void;
}

const formatOptions = [
    {
        id: 1,
        name: '格式一 (預設)',
        examples: [
            '壹、大標題(訴之聲明、事實及理由、犯罪事實、證據等大標)',
            '  一、中標題',
            '    (一) 小標題',
            '      1. 細項',
            '        (1) 子項',
        ],
    },
    {
        id: 2,
        name: '格式二',
        examples: [
            '大標題(訴之聲明、事實及理由、犯罪事實、證據等大標無編號)',
            '  一、中標題',
            '    (一) 小標題',
            '      1. 細項',
            '        (1) 子項',
        ],
    },
    {
        id: 3,
        name: '格式三',
        examples: [
            '大標題 (訴之聲明、事實及理由、犯罪事實、證據等大標無編號)',
            '  壹、中標題',
            '    一、小標題',
            '      (一) 細項',
            '        1. 子項',
            '          (1) 更細項',
        ],
    },
];

export function CanvasFormatTypeFilter({
    canvasFormatType,
    setCanvasFormatType,
}: CanvasFormatTypeFilterProps) {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-base flex items-center gap-2">
                <FileEdit size={16} /> 書狀格式
            </h4>
            <div className="grid gap-3">
                {formatOptions.map((format) => (
                    <div
                        key={format.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            canvasFormatType === format.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setCanvasFormatType(format.id)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{format.name}</span>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                                canvasFormatType === format.id
                                    ? 'border-primary bg-primary'
                                    : 'border-border'
                            }`}>
                                {canvasFormatType === format.id && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                            {format.examples.map((example, idx) => (
                                <div key={idx} style={{ marginLeft: `${(example.match(/^\s*/)?.[0].length || 0) * 0.5}rem` }}>
                                    {example.trim()}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
