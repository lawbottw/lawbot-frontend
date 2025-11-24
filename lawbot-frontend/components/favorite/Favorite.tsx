import { cn } from '@/lib/utils'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Star } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useFavoriteDialog } from '@/hooks/useFavoriteDialog'
import { FavoriteDialogContent } from './FavoriteDialogContent'

interface FavoriteProps {
  docId: string
  source_table: string
  title: string
  className?: string
  isInitiallyFavorited?: boolean
}

const Favorite: React.FC<FavoriteProps> = ({
  docId,
  source_table,
  title,
  className,
  isInitiallyFavorited,
}) => {
  const {
    open,
    setOpen,
    selectedFolderIds,
    setSelectedFolderIds,
    newFolderName,
    setNewFolderName,
    setNewFolderParentId,
    isCreatingFolder,
    isSaving,
    expandedFolders,
    showCreateFolderForm,
    setShowCreateFolderForm,
    searchTerm,
    setSearchTerm,
    folderTree,
    foldersLoading,
    handleSaveChanges,
    handleCreateFolder,
    toggleFolder,
    expandAllFolders,
    collapseAllFolders,
    filterFolders,
    findFolderInTree,
    handleDialogClose,
    hasChanges,
    selectedCount,
  } = useFavoriteDialog(docId, source_table, title)

  const handleToggleSelection = (folderId: string, checked: boolean) => {
    setSelectedFolderIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(folderId)
      } else {
        next.delete(folderId)
      }
      return next
    })
  }

  const handleCreateSubFolder = (parentId: string) => {
    setNewFolderParentId(parentId)
    setShowCreateFolderForm(true)
  }

  const handleShowCreateForm = () => {
    setNewFolderParentId(null)
    setShowCreateFolderForm(true)
  }

  const handleCancelCreateForm = () => {
    setShowCreateFolderForm(false)
    setNewFolderName('')
    setNewFolderParentId(null)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          isInitiallyFavorited ? 'text-yellow-400' : 'text-muted-foreground',
          className
        )}
        aria-label={isInitiallyFavorited ? '編輯書籤' : '加入書籤'}
        onClick={() => setOpen(true)}
      >
        <Star className={cn('h-4 w-4', isInitiallyFavorited && 'fill-current')} />
      </Button>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>管理書籤</DialogTitle>
          </DialogHeader>
          
          <FavoriteDialogContent
            foldersLoading={foldersLoading}
            folderTree={folderTree ?? null}
            selectedFolderIds={selectedFolderIds}
            expandedFolders={expandedFolders}
            searchTerm={searchTerm}
            showCreateFolderForm={showCreateFolderForm}
            newFolderName={newFolderName}
            newFolderParentId={null}
            isCreatingFolder={isCreatingFolder}
            selectedCount={selectedCount}
            onSearchChange={setSearchTerm}
            onToggleFolder={toggleFolder}
            onToggleSelection={handleToggleSelection}
            onCreateSubFolder={handleCreateSubFolder}
            onShowCreateForm={handleShowCreateForm}
            onCancelCreateForm={handleCancelCreateForm}
            onFolderNameChange={setNewFolderName}
            onCreate={handleCreateFolder}
            onExpandAll={expandAllFolders}
            onCollapseAll={collapseAllFolders}
            filterFolders={filterFolders}
            findFolderInTree={findFolderInTree}
          />

          <DialogFooter className="flex-shrink-0">
            <Button className="mt-2 sm:mt-0" variant="outline" onClick={handleDialogClose}>
              取消
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              disabled={isSaving || foldersLoading || !hasChanges}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hasChanges ? '儲存變更' : '已是最新'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default React.memo(Favorite)