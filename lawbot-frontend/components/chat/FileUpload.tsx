import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, File as FileIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext'; // 只保留 useUser
import { UploadedFile, FileUploadProps, FileItem} from '@/types/upload-file';
import { uploadFileToStorage, validateFile, validateFileList } from '@/lib/firebase-storage';

export function FileUpload({
  files: propFiles,
  onFilesChange,
  onUploadProgress,
  disabled = false,
  maxFiles = 5,
  onShowUpgradeModal,
  onPanelClose, // 新增參數
}: FileUploadProps) {
  const { user } = useAuth();
  const { plan, loading: planLoading } = useUser(); // 使用 useUser 取得 plan 與 loading
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayFiles, setDisplayFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    setDisplayFiles(prevDisplayFiles => {
      const propFileItems: FileItem[] = propFiles.map(pf => ({
        ...pf,
        isUploading: false,
        uploadProgress: 100,
        uploadError: undefined,
      }));

      const propFileIds = new Set(propFiles.map(f => f.id));

      const locallyManagedFiles = prevDisplayFiles.filter(
        df => (df.isUploading || df.uploadError) && !propFileIds.has(df.id)
      );

      const combinedMap = new Map<string, FileItem>();
      propFileItems.forEach(file => combinedMap.set(file.id, file));
      locallyManagedFiles.forEach(file => {
        if (!combinedMap.has(file.id)) {
          combinedMap.set(file.id, file);
        }
      });
      return Array.from(combinedMap.values());
    });
  }, [propFiles]);

  useEffect(() => {
    if (onUploadProgress) {
      const timerId = setTimeout(() => {
        onUploadProgress(displayFiles);
      }, 0);
      return () => clearTimeout(timerId);
    }
  }, [displayFiles, onUploadProgress]);

  const handleFileSelect = async (selectedLocalFiles: FileList | null) => {
    if (!selectedLocalFiles || !user || disabled) return;

    const fileListValidation = validateFileList(selectedLocalFiles, propFiles);
    if (!fileListValidation.valid) {
      toast.error(fileListValidation.error);
      return;
    }

    // 關閉 panel
    if (onPanelClose) {
      onPanelClose();
    }

    const newLocalFileItems: FileItem[] = [];
    const filesToUpload: File[] = [];

    for (const file of Array.from(selectedLocalFiles)) {
      const fileValidation = validateFile(file);
      if (!fileValidation.valid) {
        toast.error(`${file.name}: ${fileValidation.error}`);
        continue;
      }

      const tempFileId = `${Date.now()}_${file.name}_${Math.random().toString(36).substring(2, 11)}`;
      const tempFileItem: FileItem = {
        id: tempFileId,
        name: file.name,
        url: '', // Will be filled by uploadedFile
        mime_type: file.type,
        uploadedAt: new Date(), // Placeholder, updated on success
        isUploading: true,
        uploadProgress: 0,
      };
      newLocalFileItems.push(tempFileItem);
      filesToUpload.push(file);
    }

    if (newLocalFileItems.length === 0) return;

    // 立即更新 displayFiles 並觸發 onUploadProgress
    const newDisplayFiles = [...displayFiles, ...newLocalFileItems];
    setDisplayFiles(newDisplayFiles);
    
    // 立即觸發 onUploadProgress 以更新父組件的 allFiles
    if (onUploadProgress) {
      onUploadProgress(newDisplayFiles);
    }

    const successfullyUploadedInThisBatch: UploadedFile[] = [];

    for (let i = 0; i < newLocalFileItems.length; i++) {
      const tempFileItem = newLocalFileItems[i];
      const originalFile = filesToUpload[i];

      try {
        const uploadedFile = await uploadFileToStorage(
          originalFile,
          user.uid,
          (progress) => {
            const newUploadProgress = Math.round(progress * 100);
            setDisplayFiles(prevDisplayFiles =>
              prevDisplayFiles.map(item =>
                item.id === tempFileItem.id
                  ? { ...item, uploadProgress: newUploadProgress }
                  : item
              )
            );
          }
        );

        setDisplayFiles(prev =>
          prev.map(item =>
            item.id === tempFileItem.id
              ? { ...uploadedFile, isUploading: false, uploadProgress: 100, uploadError: undefined }
              : item
          )
        );
        successfullyUploadedInThisBatch.push(uploadedFile);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '上傳失敗';
        setDisplayFiles(prev =>
          prev.map(item =>
            item.id === tempFileItem.id
              ? { ...item, isUploading: false, uploadError: errorMessage }
              : item
          )
        );
        toast.error(`${originalFile.name}: ${errorMessage}`);

        setTimeout(() => {
          setDisplayFiles(prevDisplayFiles => prevDisplayFiles.filter(item => item.id !== tempFileItem.id));
        }, 3000);
      }
    }

    if (successfullyUploadedInThisBatch.length > 0) {
      onFilesChange([...propFiles, ...successfullyUploadedInThisBatch]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      // Check if user is on free plan
      if ((!planLoading && plan === "free") || !user) {
        onShowUpgradeModal();
        return;
      }

      // Calculate current non-errored files count for disabling button if maxFiles is reached.
      const currentDisplayedCount = displayFiles.filter(df => !df.uploadError).length;
      if (maxFiles != null && currentDisplayedCount >= maxFiles) {
          toast.info(`已達檔案上限 ${maxFiles} 個。`);
          return;
      }
      fileInputRef.current?.click();
    }
  };
  
  // Calculate current files for disabling input/button
  const currentValidFileCount = displayFiles.filter(df => !df.uploadError).length;
  const isMaxFilesReached = maxFiles != null && currentValidFileCount >= maxFiles;
  
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={handleClick}
        disabled={disabled || isMaxFilesReached}
        className="w-full justify-start px-3 py-2 h-auto hover:bg-accent/50"
        title="附加檔案"
      >
          <>
            <Upload className="h-4 w-4 mr-3" />
            <span className="text-sm">上傳附件</span>
          </>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFileSelect(e.target.files);
          if (e.target) e.target.value = ''; // Allow selecting the same file(s) again
        }}
        disabled={disabled || isMaxFilesReached}
        accept="image/*,.pdf,.docx,.odt,.txt"
      /> 
    </>
  );
}

export function FileAttachments({ files, onFileDelete, disabled = false }: {
  files: FileItem[];
  onFileDelete: (file: FileItem) => void;
  disabled?: boolean;
}) {
  if (files.length === 0) return null;

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors ${
              file.uploadError
                ? 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40'
                : file.isUploading
                ? 'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 '
                : 'bg-secondary/50 hover:bg-secondary/80'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className="text-xs font-medium truncate max-w-[100px]"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 w-6 p-0 rounded-full flex-shrink-0 ${
                file.uploadError
                  ? 'hover:bg-red-200 dark:hover:bg-red-800/50 hover:text-red-700 dark:hover:text-red-300'
                  : 'hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onFileDelete(file);
              }}
              disabled={disabled || file.isUploading} // Disable delete if actively uploading
              title="移除檔案"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}