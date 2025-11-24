export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  mime_type: string;
  uploadedAt: Date;
}

export interface UploadProgress {
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onUploadProgress?: (uploadingFiles: FileItem[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  onShowUpgradeModal: () => void;
  onPanelClose?: () => void; // 新增：關閉 panel 的回調
}

export interface FileItem extends UploadedFile {
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
}