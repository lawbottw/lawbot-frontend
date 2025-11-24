import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatMessageContent } from "@/utils/textUtils";
import { UploadedFile } from "@/types/upload-file";
import { Mode } from "@/types/queryinput";

interface CreateChatOptions {
  userId: string;
  query: string;
  mode: Mode;
  docs: { doc_id: string; category: string }[];
  is_folder_data: boolean;
  files?: UploadedFile[];
  websearch?: boolean;
  projectId?: string;
  filters?: Record<string, any>;
  apiBaseUrl: string;
  apiPost: (url: string, payload: any) => Promise<any>;
}

export interface CreateChatResult {
  chatId: string;
  success: boolean;
  error?: Error;
}

export async function createChatOperation(options: CreateChatOptions): Promise<CreateChatResult> {
  const {
    userId,
    query,
    mode,
    docs,
    is_folder_data,
    files = [],
    websearch = false,
    projectId = '',
    filters = {},
    apiBaseUrl,
    apiPost
  } = options;

  try {
    // Generate chat ID
    const chatTimestamp = Date.now();
    const chatRandomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const chatId = `${chatTimestamp}${chatRandomSuffix}`;
    const chatName = formatMessageContent(query.trim().substring(0, 12) + (query.trim().length > 12 ? "..." : ""));

    // Handle agent mode
    if (mode === 'agent') {
      const userMessage = {
        id: chatTimestamp.toString().padStart(16, '0'),
        role: "user",
        content: query,
        timestamp: new Date(),
        files: files,
      };

      const chatDocPromise = setDoc(doc(db, "legalChats", chatId), {
        createdAt: serverTimestamp(),
        status: "pending",
        statusMessage: "AI代理正在處理你的查詢...",
        lastUpdated: serverTimestamp(),
        model: "agent",
        userId: userId,
        chatName: chatName,
        messages: [userMessage],
        projectId: projectId
      });

      const messageId = chatTimestamp.toString().padStart(16, '0');
      const messageDocPromise = setDoc(doc(db, `legalChats/${chatId}/messages`, messageId), {
        role: "user",
        content: query,
        files: files,
        timestamp: serverTimestamp()
      });

      await Promise.all([chatDocPromise, messageDocPromise]);

      const agentPayload = {
        chat_id: chatId,
        initial_query: query,
        project_id: projectId,
        files: files,
      };

      apiPost(`${apiBaseUrl}/api/v1/agent/process`, agentPayload).catch(() => {});

      return { chatId, success: true };
    }

    // Handle chat mode (flash/think)
    const userMessage = {
      id: chatTimestamp.toString().padStart(16, '0'),
      role: "user",
      content: query,
      timestamp: new Date(),
      importDocs: docs,
      is_folder_data: is_folder_data,
      files: files,
      websearch: websearch,
      filters: filters
    };

    const apiPayload = {
      chat_id: chatId,
      initial_query: query,
      model: mode === "think" ? "think" : "flash",
      docs: docs,
      is_folder_data: is_folder_data,
      files: files,
      websearch: websearch,
      project_id: projectId,
      ...filters,
    };

    const chatDocPromise = setDoc(doc(db, "legalChats", chatId), {
      createdAt: serverTimestamp(),
      status: "pending",
      statusMessage: "正在處理你的查詢...",
      lastUpdated: serverTimestamp(),
      model: mode,
      userId: userId,
      chatName: chatName,
      messages: [userMessage],
      projectId: projectId
    });

    const messageId = chatTimestamp.toString().padStart(16, '0');
    const messageDocPromise = setDoc(doc(db, `legalChats/${chatId}/messages`, messageId), {
      role: "user",
      content: query,
      importDocs: docs,
      is_folder_data: is_folder_data,
      files: files,
      websearch: websearch,
      filters: filters,
      timestamp: serverTimestamp()
    });

    await Promise.all([chatDocPromise, messageDocPromise]);
    apiPost(`${apiBaseUrl}/api/v1/chat`, apiPayload).catch(() => {});

    return { chatId, success: true };
  } catch (error) {
    console.error("Error creating chat:", error);
    return {
      chatId: '',
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}
