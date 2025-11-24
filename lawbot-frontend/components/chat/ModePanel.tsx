"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./FileUpload";
import { Atom, BrainCircuit, Globe, Lightbulb, Plus } from "lucide-react";
import { UploadedFile } from "@/types/upload-file";
import { Suggestion } from "@/types/suggestion";
import { Mode } from "@/types/queryinput";

interface ModePanelProps {
  mode: Mode;
  loading?: boolean;
  isDeepResearchLoading?: boolean;
  submitDisabled?: boolean;
  files: UploadedFile[];
  hasUploadingFiles: boolean;
  selectedSources: Suggestion[];
  websearch: boolean;
  onThinkClick: () => void;
  onDeepResearchClick: () => void;
  onAgentClick: () => void;
  onWebsearchClick: () => void;
  handleFilesChange: (files: UploadedFile[]) => void;
  setAllFiles: React.Dispatch<React.SetStateAction<any[]>>;
  onShowUpgradeModal: (mode: null | "think" | "files" | "web" | "agent") => void;
}

export function ModePanel({
  mode,
  loading,
  isDeepResearchLoading,
  submitDisabled,
  files,
  hasUploadingFiles,
  selectedSources,
  websearch,
  onThinkClick,
  onDeepResearchClick,
  onAgentClick,
  onWebsearchClick,
  handleFilesChange,
  setAllFiles,
  onShowUpgradeModal,
}: ModePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const closePanel = () => setIsOpen(false);

  return (
    <div id="step4" className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-secondary/80 relative ${
          isOpen ? 'bg-accent' : ''
        }`}
        disabled={loading || isDeepResearchLoading || submitDisabled}
        title="切換功能"
      >
        <Plus className={`transition-transform ${isOpen ? 'rotate-45' : ''}`} size={18} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-background border rounded-xl shadow-lg p-2 min-w-[200px] z-20">
          <div className="space-y-1">
            <FileUpload
              files={files}
              onFilesChange={handleFilesChange}
              onUploadProgress={setAllFiles}
              disabled={loading || isDeepResearchLoading || mode === "deepresearch" || selectedSources.length > 0 || websearch}
              maxFiles={5}
              onShowUpgradeModal={() => onShowUpgradeModal("files")}
              onPanelClose={closePanel}
            />

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onThinkClick();
                closePanel();
              }}
              className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
              disabled={loading || submitDisabled}
            >
              <Lightbulb className="h-4 w-4 mr-3" />
              <span className="text-sm">思考模式</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                onDeepResearchClick();
                closePanel();
              }}
              className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
              disabled={loading || submitDisabled || files.length > 0 || hasUploadingFiles || websearch}
            >
              <BrainCircuit className="h-4 w-4 mr-3" />
              <span className="text-sm">深度搜查</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                onAgentClick();
                closePanel();
              }}
              className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
              disabled={loading || submitDisabled || selectedSources.length > 0 || websearch}
            >
              <Atom className="h-4 w-4 mr-3" />
              <span className="text-sm">AI 代理</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onWebsearchClick();
                closePanel();
              }}
              className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
              disabled={loading || isDeepResearchLoading || submitDisabled || selectedSources.length > 0 || files.length > 0 || hasUploadingFiles || mode === "deepresearch" || mode === "agent"}
            >
              <Globe className="h-4 w-4 mr-3" />
              <span className="text-sm">網路搜尋</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
