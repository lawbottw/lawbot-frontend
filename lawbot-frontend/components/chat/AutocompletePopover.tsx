import { ScrollArea } from "../ui/scroll-area";
import { Folder, FileText } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AutocompletePopoverProps } from "@/types/suggestion";


export const AutocompletePopover: React.FC<AutocompletePopoverProps> = ({
  show,
  suggestions,
  maxSuggestions,
  isComposing,
  onSuggestionSelect,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset activeIndex when suggestions change
  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions, show]);

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (suggestions[activeIndex]) {
          // 修改: 支援 context 物件
          onSuggestionSelect(suggestions[activeIndex].item);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, suggestions, activeIndex, onSuggestionSelect, onClose]);

  // Scroll active suggestion into view
  useEffect(() => {
    if (
      suggestionRefs.current &&
      suggestionRefs.current[activeIndex] &&
      show
    ) {
      suggestionRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, show]);

  if (!show || suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-10 w-full md:w-3/4 lg:w-1/2 bg-background border rounded-md shadow-lg mb-1"
      style={{ bottom: "100%" }}
    >
      <ScrollArea
        className="max-h-44"
        style={{
          height:
            suggestions.length === 0
              ? "40px"
              : Math.min(suggestions.length * 36, 176) + "px",
        }}
      >
        {suggestions.slice(0, maxSuggestions).map((result, index) => (
          <div
            key={`${result.item.type}-${result.item.id}`}
            ref={(el) => {
              suggestionRefs.current[index] = el;
            }}
            // 修改: 支援 context 物件
            onClick={() => onSuggestionSelect(result.item)}
            className={`flex items-center justify-between p-2 cursor-pointer hover:bg-accent ${
              index === activeIndex ? "bg-accent" : ""
            }`}
            role="option"
            aria-selected={index === activeIndex}
          >
            <div className="flex items-center min-w-0 flex-1">
              {result.item.type === "folder" ? (
                <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {result.item.displayName || result.item.name}
              </span>
            </div>
            {result.item.path && (
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {result.item.path}
              </span>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
