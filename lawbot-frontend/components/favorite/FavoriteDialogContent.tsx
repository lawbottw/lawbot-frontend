import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Expand, Minimize2 } from 'lucide-react'
import { FolderTree } from './FolderTree'
import { CreateFolderForm } from './CreateFolderForm'
import { FolderHierarchy } from '@/types/favorite'

interface FavoriteDialogContentProps {
  foldersLoading: boolean
  folderTree: { tree: FolderHierarchy[] } | null
  selectedFolderIds: Set<string>
  expandedFolders: Set<string>
  searchTerm: string
  showCreateFolderForm: boolean
  newFolderName: string
  newFolderParentId: string | null
  isCreatingFolder: boolean
  selectedCount: number
  onSearchChange: (term: string) => void
  onToggleFolder: (folderId: string) => void
  onToggleSelection: (folderId: string, checked: boolean) => void
  onCreateSubFolder: (parentId: string) => void
  onShowCreateForm: () => void
  onCancelCreateForm: () => void
  onFolderNameChange: (name: string) => void
  onCreate: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
  filterFolders: (folders: FolderHierarchy[], term: string) => FolderHierarchy[]
  findFolderInTree: (folderId: string, folders: FolderHierarchy[]) => FolderHierarchy | null
}

export const FavoriteDialogContent: React.FC<FavoriteDialogContentProps> = ({
  foldersLoading,
  folderTree,
  selectedFolderIds,
  expandedFolders,
  searchTerm,
  showCreateFolderForm,
  newFolderName,
  newFolderParentId,
  isCreatingFolder,
  selectedCount,
  onSearchChange,
  onToggleFolder,
  onToggleSelection,
  onCreateSubFolder,
  onShowCreateForm,
  onCancelCreateForm,
  onFolderNameChange,
  onCreate,
  onExpandAll,
  onCollapseAll,
  filterFolders,
  findFolderInTree,
}) => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto">
      <p className="text-sm text-muted-foreground">
        選擇要將此項目加入或移除的資料夾。
      </p>

      <div className="mx-2 lg:mx-4 mb-2">
        <Input
          placeholder="搜尋資料夾名稱..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="flex-1 bg-background border-input"
        />
      </div>

      {foldersLoading ? (
        <div className="flex justify-center items-center h-32 sm:h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">選擇資料夾</Label>
              {selectedCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                  已選 {selectedCount} 個
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {folderTree && folderTree.tree.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const hasExpanded = expandedFolders.size > 0
                    if (hasExpanded) {
                      onCollapseAll()
                    } else {
                      onExpandAll()
                    }
                  }}
                  className="h-7 px-2 text-xs"
                  title={expandedFolders.size > 0 ? "摺疊全部" : "展開全部"}
                >
                  {expandedFolders.size > 0 ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Expand className="h-3 w-3" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onShowCreateForm}
                className="h-7 px-2 text-xs"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="h-[250px] overflow-y-auto w-full rounded-md border border-input bg-background p-3">
            {!folderTree || folderTree.tree.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                尚未建立任何資料夾。
              </p>
            ) : (
              <div className="space-y-1">
                <FolderTree
                  folders={filterFolders(folderTree.tree, searchTerm)}
                  selectedFolderIds={selectedFolderIds}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
                  onToggleSelection={onToggleSelection}
                  onCreateSubFolder={onCreateSubFolder}
                />
              </div>
            )}
          </div>

          {showCreateFolderForm && (
            <CreateFolderForm
              newFolderName={newFolderName}
              parentFolderName={
                newFolderParentId
                  ? findFolderInTree(newFolderParentId, folderTree?.tree || [])?.folder_name
                  : undefined
              }
              isCreating={isCreatingFolder}
              onNameChange={onFolderNameChange}
              onCreate={onCreate}
              onCancel={onCancelCreateForm}
            />
          )}
        </>
      )}
    </div>
  )
}
