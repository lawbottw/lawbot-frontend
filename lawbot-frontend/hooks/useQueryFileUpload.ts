"use client"

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { uploadFileToStorage, validateFile } from "@/lib/firebase-storage";
import { UploadedFile } from "@/types/upload-file";

type SimpleUser = { uid: string } | null | undefined;

interface UseQueryFileUploadProps {
  user: SimpleUser;
  files: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  isDeepResearchMode: boolean;
  websearch: boolean;
}

export function useQueryFileUpload({
  user,
  files,
  onFilesChange,
  isDeepResearchMode,
  websearch
}: UseQueryFileUploadProps) {
  const [allFiles, setAllFiles] = useState<any[]>([]);

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    if (onFilesChange) {
      onFilesChange(newFiles);
    }

    setAllFiles(prev => {
      const successfulFileNames = new Set(newFiles.map(f => f.name));

      const filteredPrev = prev.filter(f => {
        if (f.isUploading && !successfulFileNames.has(f.name)) return true;
        if (f.uploadError) return true;
        return false;
      });

      const successfulFiles = newFiles.map(f => ({
        ...f,
        isUploading: false,
        uploadProgress: 100,
        uploadError: undefined
      }));

      return [...filteredPrev, ...successfulFiles];
    });
  }, [onFilesChange]);

  const handleFileDelete = useCallback((fileToDelete: any) => {
    if (fileToDelete.isUploading || fileToDelete.uploadError) {
      setAllFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      return;
    }

    const updatedFiles = files.filter(f => f.id !== fileToDelete.id);
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
    setAllFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
  }, [files, onFilesChange]);

  const handleFilesFromInput = useCallback(async (inputFiles: FileList | File[]) => {
    if (!user || !onFilesChange || isDeepResearchMode || websearch) return;
    const filesArray = Array.from(inputFiles);
    if (filesArray.length === 0) return;

    const maxFiles = 5;
    if (files.length + filesArray.length > maxFiles) {
      toast.error(`最多只可上傳 ${maxFiles} 個檔案，已經有 ${files.length} 個檔`);
      return;
    }

    const validFiles: File[] = [];
    const tempFileItems: any[] = [];

    for (const file of filesArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name || "檔案"}: ${validation.error}`);
        continue;
      }
      const tempFileId = `${Date.now()}_${file.name}_${Math.random().toString(36).substring(2, 11)}`;
      tempFileItems.push({
        id: tempFileId,
        name: file.name,
        url: '',
        mime_type: file.type,
        uploadedAt: new Date(),
        isUploading: true,
        uploadProgress: 0,
      });
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setAllFiles(prev => [...prev, ...tempFileItems]);

    const successfullyUploaded: UploadedFile[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const tempFileItem = tempFileItems[i];
      try {
        const uploaded = await uploadFileToStorage(
          file,
          user.uid,
          (progress) => {
            setAllFiles(prev => prev.map(item =>
              item.id === tempFileItem.id ? { ...item, uploadProgress: Math.round(progress) } : item
            ));
          }
        );
        setAllFiles(prev => prev.map(item =>
          item.id === tempFileItem.id
            ? { ...uploaded, isUploading: false, uploadProgress: 100, uploadError: undefined }
            : item
        ));
        successfullyUploaded.push(uploaded);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '上傳失敗';
        setAllFiles(prev => prev.map(item =>
          item.id === tempFileItem.id ? { ...item, isUploading: false, uploadError: errorMessage } : item
        ));
        toast.error(`${file.name || "檔案"} 上傳失敗`);
        setTimeout(() => {
          setAllFiles(prev => prev.filter(item => item.id !== tempFileItem.id));
        }, 3000);
      }
    }
    if (successfullyUploaded.length > 0) {
      onFilesChange([...files, ...successfullyUploaded]);
    }
  }, [user, files, onFilesChange, isDeepResearchMode, websearch]);

  const hasUploadingFiles = allFiles.some(file => file.isUploading);

  return {
    allFiles,
    setAllFiles,
    handleFilesChange,
    handleFileDelete,
    handleFilesFromInput,
    hasUploadingFiles,
  };
}
