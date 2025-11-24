import { Timestamp } from "firebase/firestore"
import { UploadedFile } from "./upload-file"

export interface Citation {
  doc_id: string
  title: string
  category: string
  content: string
  url?: string
  featured: string
}

export interface WebResource {
  title: string
  url: string
  content: string
}

export interface Message {
  role: "user" | "assistant"
  content: string
  id?: string
  timestamp: Date
  citations?: Citation[]
  importDocs?: Citation[]
  files?: UploadedFile[] // 附件的 URL 列表
  status?: "sending" | "error"
  extend_questions?: string[] // 用於延伸問題的列表
  web_resources?: WebResource[] // Add web resources field
  websearch?: boolean
  canvas_file_id?: string; // Added canvas file ID
  canvas_file_title?: string; // Added canvas file title
  isStreaming?: boolean; // 新增 isStreaming 屬性
}

// Add AgentStatus interface
export interface AgentLogStatus {
  step: string;
  log: string;
}

export interface ChatData {
  messages: Message[]
  status: "pending" | "completed" | "error" | "cancelled" | "searching" | "processing",
  agentStatusHistory?: AgentLogStatus[] // Changed from string[] to AgentStatus[]
  statusMessage?: string,
  lastUpdated: Timestamp | null,
  model: "flash" | "think" | 'agent'
  chatName?: string
  userId?: string
  error?: string
  researchId?: string
  projectId?: string
  originalChatId?: string 
  isShared?: boolean      
  sharedBy?: string       
  sharedFrom?: string
  clonedFrom?: string
}

export interface ChatRecord {
  id: string;
  chatName: string;
  lastUpdated: Date;
  messages: Array<{
    content: string;
    role: string;
  }>;
  projectId?: string;
}

export interface APIResponse {
  success: boolean
  message?: string
}
