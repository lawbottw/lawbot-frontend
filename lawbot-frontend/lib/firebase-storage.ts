import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';
import { UploadedFile } from '@/types/upload-file';

// 支援的檔案類型
const SUPPORTED_FILE_TYPES = [
  // 圖片格式
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  // 文件格式
  'application/pdf',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_FILES = 5;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `檔案大小不能超過 15MB，目前檔案大小：${(file.size / 1024 / 1024).toFixed(2)}MB` };
  }
  
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `不支援的檔案格式：${file.type}` };
  }
  
  return { valid: true };
}

export function validateFileList(files: FileList, existingFiles: UploadedFile[]): { valid: boolean; error?: string } {
  if (existingFiles.length + files.length > MAX_FILES) {
    return { valid: false, error: `最多只能上傳 ${MAX_FILES} 個檔案，目前已有 ${existingFiles.length} 個檔案` };
  }
  
  return { valid: true };
}

export async function uploadFileToStorage(
  file: File, 
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadedFile> {
  const fileId = uuidv4();
  const fileName = `${fileId}_${file.name}`;
  const filePath = `users/${userId}/uploads/${fileName}`;
  
  try {
    const storageRef = ref(storage, filePath);
    
    // 模擬進度更新（Firebase Storage Web SDK 不支援進度監聽）
    if (onProgress) {
      onProgress(0);
      const progressInterval = setInterval(() => {
        // 模擬進度增長
        onProgress(Math.min(90, Math.random() * 80 + 10));
      }, 200);
      
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 1000);
    }
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    if (onProgress) {
      onProgress(100);
    }
    
    return {
      id: fileId,
      name: file.name,
      url: downloadURL,
      mime_type: file.type,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`上傳失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

export async function deleteFileFromStorage(file: UploadedFile, userId: string): Promise<void> {
  try {
    const fileName = `${file.id}_${file.name}`;
    const filePath = `users/${userId}/uploads/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`刪除失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}