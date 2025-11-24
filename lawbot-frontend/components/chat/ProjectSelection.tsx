"use client"

import { Button } from "@/components/ui/button";
import { FolderClosed, X } from "lucide-react";
import { ProjectSelector } from "../project/ProjectSelector";

interface ProjectSelectionProps {
  selectedProject?: { id?: string; title?: string | null } | null;
  selectedProjectId?: string | null;
  fixedProject: boolean;
  isFixedProject?: boolean;
  loading?: boolean;
  isDeepResearchLoading?: boolean;
  submitDisabled?: boolean;
  onClear?: () => void;
  onSelect?: (projectId: string) => void;
}

export function ProjectSelection({
  selectedProject,
  selectedProjectId,
  fixedProject,
  isFixedProject = false,
  loading,
  isDeepResearchLoading,
  submitDisabled,
  onClear,
  onSelect,
}: ProjectSelectionProps) {
  if (!onSelect) return null;

  return (
    <div className="relative">
      {selectedProject ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(fixedProject || isFixedProject) ? undefined : onClear}
          disabled={loading || isDeepResearchLoading || submitDisabled}
          className={`flex items-center gap-1 px-3 py-1 h-8 rounded-xl text-sm ${
            (fixedProject || isFixedProject)
              ? 'bg-accent/60 text-foreground cursor-default' 
              : 'bg-accent/60 text-foreground hover:bg-accent/80'
          }`}
        >
          <FolderClosed className="h-3 w-3"/>
          <span className="hidden md:flex truncate max-w-[120px]">{selectedProject.title}</span>
          {!fixedProject && !isFixedProject && (
            <X className="h-3 w-3 ml-1 opacity-70 hover:opacity-100" />
          )}
        </Button>
      ) : (
        <ProjectSelector
          selectedProjectId={selectedProjectId}
          onProjectSelect={onSelect}
          disabled={loading || isDeepResearchLoading}
          variant="feature"
          onPanelClose={() => {}}
          onProjectCreated={onSelect}
        />
      )}
    </div>
  );
}
