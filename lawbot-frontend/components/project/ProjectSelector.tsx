"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderClosed, Plus } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { CreateProject } from "@/components/project/CreateProject";
import { CaseResponse } from "@/types/project";
import { useUser } from "@/context/UserContext";
import UpgradeModal from "../common/UpgradeModal";

interface ProjectSelectorProps {
  selectedProjectId?: string | null;
  onProjectSelect: (projectId: string) => void;
  disabled?: boolean;
  isFixedProject?: boolean;
  onPanelClose?: () => void;
  variant?: "feature" | "default";
  onProjectCreated?: (projectId: string) => void;
  onCreateProject?: () => void;
  renderTrigger?: (props: { onClick: () => void; disabled: boolean }) => React.ReactNode;
}

export function ProjectSelector({
  selectedProjectId,
  onProjectSelect,
  disabled = false,
  isFixedProject = false,
  onPanelClose,
  variant = "default",
  onProjectCreated,
  onCreateProject,
  renderTrigger,
}: ProjectSelectorProps) {
  const { cases, isLoading } = useProject();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { plan, loading: planLoading } = useUser();

  // Get selected project from context using ID
  const selectedProject = selectedProjectId
    ? cases.find((project) => project.id === selectedProjectId)
    : null;

  const handleProjectSelect = (project: CaseResponse) => {
    onProjectSelect(project.id); // Pass project ID instead of full object
    setDropdownOpen(false);
    onPanelClose?.();
  };

  const handleCreateProject = () => {
    setDropdownOpen(false);
    onPanelClose?.();
    if (onCreateProject) {
      onCreateProject();
    } else {
      setShowCreateDialog(true);
    }
  };

  // 判斷是否允許案件管理功能
  const allowProject = plan === "lite" || plan === "pro";

  // 如果是固定專案，直接顯示專案名稱
  if (isFixedProject && selectedProject) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
        disabled={true}
      >
        <FolderClosed className="h-4 w-4 mr-3" />
        <span className="text-sm truncate">{selectedProject.title}</span>
      </Button>
    );
  }

  // 方案不符時，點擊直接跳出升級 modal
  const handleTriggerClick = () => {
    if (!allowProject && !planLoading) {
      setShowUpgradeModal(true);
      return;
    }
    setDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {renderTrigger ? (
            renderTrigger({
              onClick: handleTriggerClick,
              disabled,
            })
          ) : (
            <Button
              id="step5"
              type="button"
              variant="ghost"
              size="sm"
              className={
                variant === "feature"
                  ? "flex items-center gap-2 px-3 py-1 h-8 rounded-xl text-sm hover:bg-accent/50"
                  : "w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
              }
              disabled={disabled}
              onClick={handleTriggerClick}
            >
              <FolderClosed className="h-3 w-3" />
              <span className="hidden md:flex text-sm">選取案件</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        {/* 只有允許時才顯示下拉內容，否則不顯示 */}
        {allowProject && (
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-40 sm:w-48 md:w-64 max-h-[300px] overflow-y-auto"
            sideOffset={4}
          >
            {isLoading ? (
              <DropdownMenuItem disabled>
                <span className="text-muted-foreground">載入中...</span>
              </DropdownMenuItem>
            ) : cases.length > 0 ? (
              <>
                <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
                  {cases.map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className="cursor-pointer flex-shrink-0"
                    >
                      <FolderClosed className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{project.title}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem disabled>
                  <span className="text-muted-foreground">尚無專案</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={handleCreateProject}
              className="cursor-pointer flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>新增專案</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* 只在沒有外部處理 onCreateProject 時才顯示內部對話框 */}
      {!onCreateProject && (
        <CreateProject
          open={showCreateDialog}
          setOpen={setShowCreateDialog}
          onProjectCreated={(project) => {
            onProjectSelect(project.id);
            onProjectCreated?.(project.id);
          }}
        />
      )}

      {/* 升級 modal */}
      <UpgradeModal
        open={showUpgradeModal}
        mode="project"
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          window.location.href = "/billing";
        }}
      />
    </>
  );
}