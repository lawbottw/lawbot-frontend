"use client";

import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, MoreHorizontal, FolderClosed } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { CaseResponse } from "@/types/project";
import { ProjectSelector } from "../project/ProjectSelector";
import { CreateProject } from "../project/CreateProject";
import { useUser } from "@/context/UserContext";

interface ChatActionsProps {
  chatId: string;
  chatName: string;
  onUpdate?: (chatId: string, newName: string) => void;
  onDelete?: (chatId: string) => void;
  redirectAfterDelete?: boolean;
  projectId?: string | null;
  projects?: CaseResponse[];
  onAssignProject?: (chatId: string, projectId: string) => void;
}

export function ChatActions({
  chatId,
  chatName,
  onUpdate,
  onDelete,
  redirectAfterDelete = false,
  projectId,
  projects = [],
  onAssignProject,
}: ChatActionsProps) {
  const [editMode, setEditMode] = useState(false);
  const [newChatName, setNewChatName] = useState(chatName);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignProjectOpen, setAssignProjectOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const { plan } = useUser(); // 取得用戶方案

  // 處理重命名聊天
  const handleRenameChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newChatName.trim() || newChatName.trim() === chatName) {
      setEditMode(false);
      setNewChatName(chatName);
      return;
    }
    
    const updatedName = newChatName.trim();
    
    // 先關閉編輯模式，提高用戶體驗
    setEditMode(false);
    
    try {
      await updateDoc(doc(db, "legalChats", chatId), {
        chatName: updatedName
      });
      
      // 通知父組件更新已完成
      if (onUpdate) {
        onUpdate(chatId, updatedName);
      }
    } catch (error) {
      // 恢復原始名稱
      setNewChatName(chatName);
    }
  };

  // 處理刪除聊天
  const handleDeleteChat = async () => {
    try {
      
      
      // 只有在當前正在查看被刪除的對話時，才重定向到首頁
      if (redirectAfterDelete) {
        // 從 URL 獲取當前查看的對話 ID
        const currentPath = window.location.pathname;
        const currentViewingChatId = currentPath.split('/').pop();
        
        // 如果當前查看的就是被刪除的對話，才重定向
        if (currentViewingChatId === chatId) {
          router.push("/");
        }
      }

      await deleteDoc(doc(db, "legalChats", chatId));

      // 通知父組件刪除已完成
      if (onDelete) {
        onDelete(chatId);
      }
      
      setShowDeleteDialog(false);
    } catch (error) {
      // console.error("刪除聊天失敗:", error);
    }
  };

  // 專案標題
  const projectTitle =
    projectId && projects.length > 0
      ? projects.find((p) => p.id === projectId || p.id === projectId)?.title
      : null;

  // 選取專案
  const handleAssignProject = async (selectedProjectId: string) => {
    setAssigning(true);
    try {
      await updateDoc(doc(db, "legalChats", chatId), {
        projectId: selectedProjectId,
      });
      if (onAssignProject) {
        onAssignProject(chatId, selectedProjectId);
      }
      setAssignProjectOpen(false);
      setPopoverOpen(false);
    } catch (e) {
      // 可加錯誤提示
    } finally {
      setAssigning(false);
    }
  };

  // 處理新增專案
  const handleCreateProject = () => {
    setAssignProjectOpen(false);
    setPopoverOpen(false);
    setShowCreateProject(true);
  };

  return (
    <>
      <Popover
        open={popoverOpen}
        onOpenChange={(open) => {
          setPopoverOpen(open);
          if (!projectId ) {
            setAssignProjectOpen(open);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-56 p-2">
          <div className="flex flex-col space-y-1">
            {onAssignProject && !projectId && (plan === 'lite' || plan === 'pro') ? (
              <div>
                {assignProjectOpen && (
                  <div className="mt-2">
                    <ProjectSelector
                      selectedProjectId={null}
                      onProjectSelect={async (selectedId) => {
                        await handleAssignProject(selectedId);
                      }}
                      disabled={assigning}
                      isFixedProject={false}
                      variant="default"
                      onPanelClose={() => setAssignProjectOpen(false)}
                      onProjectCreated={async (createdId) => {
                        await handleAssignProject(createdId);
                      }}
                      onCreateProject={handleCreateProject}
                      renderTrigger={({ onClick, disabled }) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full flex items-center"
                          onClick={onClick}
                          disabled={disabled}
                        >
                          <FolderClosed className="h-4 w-4 mr-2" />
                          <span>選取專案</span>
                        </Button>
                      )}
                    />
                  </div>
                )}
              </div>
            ) : null}
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                setNewChatName(chatName);
                setEditMode(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              <span>重命名</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start text-destructive hover:text-destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              <span>刪除對話</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 刪除與重命名彈窗 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除對話?</AlertDialogTitle>
            <AlertDialogDescription>
              這個操作無法撤銷，刪除後將永久移除此對話及其所有內容。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash className="h-4 w-4 mr-2" />
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 編輯模式彈窗 */}
      {editMode && (
        <AlertDialog open={editMode} onOpenChange={setEditMode}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>重命名對話</AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleRenameChat}>
              <Input
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="mb-4"
                autoFocus
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                  setEditMode(false);
                  setNewChatName(chatName);
                }}>
                  取消
                </AlertDialogCancel>
                <AlertDialogAction type="submit" onClick={handleRenameChat}>
                  儲存
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* 新增專案對話框 */}
      <CreateProject
        open={showCreateProject}
        setOpen={setShowCreateProject}
        onProjectCreated={async (project) => {
          await handleAssignProject(project.id);
        }}
      />
    </>
  );
}