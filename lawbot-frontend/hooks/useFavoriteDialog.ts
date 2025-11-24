import { useState, useEffect, useRef } from 'react'
import { useFavorites } from '@/context/FavoriteContext'
import { useAuth } from '@/context/AuthContext'
import { FolderHierarchy } from '@/types/favorite'
import { toast } from 'sonner'

export const useFavoriteDialog = (
  docId: string,
  source_table: string,
  title: string
) => {
  const { user } = useAuth()
  const {
    folderTree,
    loading: foldersLoading,
    addFavoriteItem,
    removeFavoriteItem,
    createFolder,
    getFoldersForDoc,
  } = useFavorites()

  const [open, setOpen] = useState(false)
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<string>>(new Set())
  const [initialFolderIds, setInitialFolderIds] = useState<Set<string>>(new Set())
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [showCreateFolderForm, setShowCreateFolderForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const initializedRef = useRef(false)

  useEffect(() => {
    if (open && user && !foldersLoading && !initializedRef.current) {
      const current = getFoldersForDoc(docId, source_table)
      setSelectedFolderIds(new Set(current))
      setInitialFolderIds(new Set(current))
      initializedRef.current = true
      
      if (folderTree && current.length > 0) {
        const expandedSet = new Set<string>()
        const expandParents = (folderId: string, folders: FolderHierarchy[]) => {
          for (const folder of folders) {
            if (folder.folder_id === folderId) return true
            if (folder.children && expandParents(folderId, folder.children)) {
              expandedSet.add(folder.folder_id)
              return true
            }
          }
          return false
        }
        
        current.forEach(folderId => expandParents(folderId, folderTree.tree))
        setExpandedFolders(expandedSet)
      }
    }
    if (!open) {
      initializedRef.current = false
    }
  }, [open, user, foldersLoading, folderTree, docId, source_table, getFoldersForDoc])

  const findFolderInTree = (folderId: string, folders: FolderHierarchy[]): FolderHierarchy | null => {
    for (const folder of folders) {
      if (folder.folder_id === folderId) return folder
      if (folder.children) {
        const found = findFolderInTree(folderId, folder.children)
        if (found) return found
      }
    }
    return null
  }

  const checkDuplicateFolderName = (name: string, parentId: string | null): boolean => {
    if (!folderTree) return false
    const targetFolders = parentId 
      ? findFolderInTree(parentId, folderTree.tree)?.children || []
      : folderTree.tree
    return targetFolders.some(folder => folder.folder_name === name.trim())
  }

  const handleSaveChanges = async () => {
    if (!user) return
    setIsSaving(true)

    const toAdd = [...selectedFolderIds].filter(id => !initialFolderIds.has(id))
    const toRemove = [...initialFolderIds].filter(id => !selectedFolderIds.has(id))

    try {
      const titleNoSpace = title.replace(/\s+/g, '')
      const addPromises = toAdd.map(folderId =>
        addFavoriteItem(folderId, {
          doc_id: docId,
          source_table,
          title: titleNoSpace,
        })
      )
      const removePromises = toRemove.map(folderId => {
        if (!folderTree) return Promise.resolve()
        const folder = findFolderInTree(folderId, folderTree.tree)
        const fav = folder?.favorites.find(
          f => f.doc_id === docId && f.source_table === source_table
        )
        if (fav?.favorite_id) {
          return removeFavoriteItem(folderId, fav.favorite_id)
        }
        return Promise.resolve()
      })
      await Promise.all([...addPromises, ...removePromises])
      setOpen(false)
      setInitialFolderIds(new Set(selectedFolderIds))
    } catch (error) {
      console.error('Error updating favorites:', error)
      if (error instanceof Error && error.message === 'FAVORITE_LIMIT_REACHED') {
        setOpen(false)
        setSelectedFolderIds(new Set(initialFolderIds))
      } else {
        toast.error('更新失敗，請稍後再試。')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user) return
    
    if (checkDuplicateFolderName(newFolderName, newFolderParentId)) {
      toast.warning('目標資料夾中已存在同名資料夾')
      return
    }
    
    setIsCreatingFolder(true)
    try {
      const newId = await createFolder(newFolderName.trim(), newFolderParentId)
      if (newId) {
        setNewFolderName('')
        setNewFolderParentId(null)
        setShowCreateFolderForm(false)
        setSelectedFolderIds(prev => new Set(prev).add(newId))
        if (newFolderParentId) {
          setExpandedFolders(prev => new Set(prev).add(newFolderParentId))
        }
      } else {
        throw new Error()
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'DEPTH_LIMIT_EXCEEDED') {
        setNewFolderName('')
        setNewFolderParentId(null)
        setShowCreateFolderForm(false)
      } else {
        toast.error('建立失敗，請稍後再試。')
      }
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const expandAllFolders = () => {
    if (!folderTree) return
    const getAllFolderIds = (folders: FolderHierarchy[]): string[] => {
      const ids: string[] = []
      folders.forEach(folder => {
        ids.push(folder.folder_id)
        if (folder.children && folder.children.length > 0) {
          ids.push(...getAllFolderIds(folder.children))
        }
      })
      return ids
    }
    setExpandedFolders(new Set(getAllFolderIds(folderTree.tree)))
  }

  const collapseAllFolders = () => {
    setExpandedFolders(new Set())
  }

  const filterFolders = (folders: FolderHierarchy[], term: string): FolderHierarchy[] => {
    if (!term.trim()) return folders
    const lowerTerm = term.trim().toLowerCase()
    const filtered: FolderHierarchy[] = []
    for (const folder of folders) {
      const nameMatch = folder.folder_name.toLowerCase().includes(lowerTerm)
      let children: FolderHierarchy[] = []
      if (folder.children && folder.children.length > 0) {
        children = filterFolders(folder.children, term)
      }
      if (nameMatch || children.length > 0) {
        filtered.push({ ...folder, children })
      }
    }
    return filtered
  }

  const handleDialogClose = () => {
    setOpen(false)
    setShowCreateFolderForm(false)
    setNewFolderName('')
    setNewFolderParentId(null)
  }

  return {
    open,
    setOpen,
    selectedFolderIds,
    setSelectedFolderIds,
    newFolderName,
    setNewFolderName,
    newFolderParentId,
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
    hasChanges: selectedFolderIds.size !== initialFolderIds.size || 
      [...selectedFolderIds].some(id => !initialFolderIds.has(id)),
    selectedCount: selectedFolderIds.size,
  }
}
