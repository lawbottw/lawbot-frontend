import { Badge } from "@/components/ui/badge";
import { Folder, FileText, X } from "lucide-react";
import { Suggestion } from "@/types/suggestion";

interface SelectedSourcesTagsProps {
  selectedSources: Suggestion[];
  onRemoveSource: (source: Suggestion) => void;
  className?: string;
}

export function SelectedSourcesTags({
  selectedSources,
  onRemoveSource,
  className = "",
}: SelectedSourcesTagsProps) {
  if (!selectedSources || selectedSources.length === 0) return null;
  return (
    <div className={`p-2 flex flex-wrap gap-2 ${className}`}>
      {selectedSources.map(source => (
        <Badge
          key={`${source.type}-${source.id}`}
          variant={source.type === 'folder' ? "default" : "secondary"}
          className="flex items-center gap-1 pl-2 pr-1 py-0.5"
        >
          {source.type === 'folder' ? (
            <Folder className="h-3 w-3" />
          ) : (
            <FileText className="h-3 w-3" />
          )}
          <span className={`text-xs font-semibold p-1 ${source.type === 'folder' ? 'text-white' : 'text-primary'}`}>{source.displayName}</span>
          <button
            onClick={() => onRemoveSource(source)}
            className="ml-1 cursor-pointer rounded-full hover:bg-background/60 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label={`移除 ${source.displayName}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

export default SelectedSourcesTags;
