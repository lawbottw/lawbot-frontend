import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ChevronRight, ChevronDown, FolderPlus } from 'lucide-react'
import { FolderHierarchy } from '@/types/favorite'

interface FolderTreeProps {
  folders: FolderHierarchy[]
  selectedFolderIds: Set<string>
  expandedFolders: Set<string>
  onToggleFolder: (folderId: string) => void
  onToggleSelection: (folderId: string, checked: boolean) => void
  onCreateSubFolder: (parentId: string) => void
  depth?: number
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderIds,
  expandedFolders,
  onToggleFolder,
  onToggleSelection,
  onCreateSubFolder,
  depth = 0,
}) => {
  return (
    <>
      {folders.map(folder => (
        <div key={folder.folder_id} className="mb-1">
          <div 
            className={cn(
              "flex items-center space-x-2 p-1 rounded-md transition-colors group",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            {folder.children && folder.children.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4 hover:bg-transparent"
                onClick={() => onToggleFolder(folder.folder_id)}
              >
                {expandedFolders.has(folder.folder_id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-4" />
            )}
            
            <Checkbox
              id={`folder-${folder.folder_id}`}
              checked={selectedFolderIds.has(folder.folder_id)}
              onCheckedChange={checked => onToggleSelection(folder.folder_id, !!checked)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            
            <Label
              htmlFor={`folder-${folder.folder_id}`}
              className="text-sm font-medium cursor-pointer flex-1"
            >
              {folder.folder_name}
            </Label>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onCreateSubFolder(folder.folder_id)
              }}
              title={`在 ${folder.folder_name} 中建立子資料夾`}
            >
              <FolderPlus className="h-3 w-3" />
            </Button>
          </div>
          
          {folder.children && folder.children.length > 0 && expandedFolders.has(folder.folder_id) && (
            <div className="ml-4">
              <FolderTree
                folders={folder.children}
                selectedFolderIds={selectedFolderIds}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onToggleSelection={onToggleSelection}
                onCreateSubFolder={onCreateSubFolder}
                depth={depth + 1}
              />
            </div>
          )}
        </div>
      ))}
    </>
  )
}
