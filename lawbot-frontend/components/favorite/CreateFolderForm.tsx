import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Loader2, Plus } from 'lucide-react'

interface CreateFolderFormProps {
  newFolderName: string
  parentFolderName?: string
  isCreating: boolean
  onNameChange: (name: string) => void
  onCreate: () => void
  onCancel: () => void
}

export const CreateFolderForm: React.FC<CreateFolderFormProps> = ({
  newFolderName,
  parentFolderName,
  isCreating,
  onNameChange,
  onCreate,
  onCancel,
}) => {
  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">
          {parentFolderName ? '建立子資料夾' : '建立新資料夾'}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {parentFolderName && (
        <p className="text-xs text-muted-foreground mb-2">
          將在「{parentFolderName}」中建立
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Input
          placeholder="輸入資料夾名稱..."
          value={newFolderName}
          onChange={e => onNameChange(e.target.value)}
          disabled={isCreating}
          className="flex-1 bg-background border-input"
          onKeyDown={e => {
            if (e.key === 'Enter' && newFolderName.trim()) {
              onCreate()
            }
          }}
        />
        <Button
          size="sm"
          onClick={onCreate}
          disabled={!newFolderName.trim() || isCreating}
          className="sm:w-auto w-full"
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          建立
        </Button>
      </div>
    </div>
  )
}
