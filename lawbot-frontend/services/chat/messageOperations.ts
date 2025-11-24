import { doc, updateDoc, setDoc, deleteDoc, getDocs, getDoc, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatData, Message, Citation } from "@/types/chat";
import { toast } from "sonner";
import { User } from "firebase/auth";

export async function sendMessage(
  chatId: string,
  userQuery: string,
  localModel: "flash" | "think" | "agent",
  setChatData: React.Dispatch<React.SetStateAction<ChatData | null>>,
  user: User | null, 
  apiPost: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>,
  docs?: { doc_id: string; source_table: string }[],
  is_folder_data?: boolean,
  apiFilters?: Record<string, any>,
  files?: { id: string; name: string; url: string; mime_type: string; uploadedAt: Date }[],
  websearch?: boolean,
  isCanvasEdit?: boolean,
  currentCanvasId?: string,
  canvasAction?: 'suggest' | 'longer' | 'shorter' | 'verify',
  projectId?: string
) {
  if (!user) { 
    toast.error("User not authenticated");
    return false;
  }
  
  if (!canvasAction && !userQuery.trim()) {
    toast.warning("請輸入查詢內容", {
      description: "查詢內容不能為空",
      duration: 2000,
    });
    return false;
  }
  
  const isAgentMode = localModel === "agent";
  
  if (!canvasAction) {
    const timestampForId = Date.now();
    const messageId = timestampForId.toString().padStart(16, '0');

    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: userQuery,
      timestamp: new Date(),
      ...(files && files.length > 0 && { files: files }),
      ...(websearch !== undefined && { websearch: websearch }),
      ...(isCanvasEdit !== undefined && { isCanvasEdit: isCanvasEdit }),
      ...(currentCanvasId && { currentCanvasId: currentCanvasId })
    };

    setChatData(prev => ({
      ...prev!,
      status: "pending",
      model: localModel,
      messages: [...(prev?.messages || []), userMessage],
      ...(projectId ? { projectId } : { projectId: prev?.projectId} )
    }));

    try {
      const chatRef = doc(db, "legalChats", chatId);
      const chatDoc = await getDoc(chatRef);
      const chatData = chatDoc.data() || {};
      const currentMessages = chatData.messages || [];

      const importDocsForMessage: Citation[] | undefined = docs?.map(doc => ({
        doc_id: doc.doc_id,
        category: doc.source_table,
        title: "",
        content: "",
        featured: "",
      }));
      
      const docUserMessage = {
        id: messageId,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: new Date().toISOString(), 
        ...(importDocsForMessage && { importDocs: importDocsForMessage }),
        ...(is_folder_data !== undefined && { is_folder_data: is_folder_data }),
        ...(files && files.length > 0 && { files: files }),
        ...(websearch !== undefined && { websearch: websearch }),
        ...(isCanvasEdit !== undefined && { isCanvasEdit: isCanvasEdit }),
        ...(currentCanvasId && { currentCanvasId: currentCanvasId })
      };
      
      let updatedMessages = [...currentMessages, docUserMessage];
      if (updatedMessages.length > 6) {
        updatedMessages = updatedMessages.slice(-6);
      }
      
      await updateDoc(chatRef, {
        status: "pending",
        statusMessage: "正在處理你的查詢...",
        model: localModel,
        lastUpdated: new Date(),
        messages: updatedMessages,
        agentStatusHistory: [],
        ...(projectId ? { projectId } : {} )
      });
      
      await setDoc(doc(db, `legalChats/${chatId}/messages`, messageId), {
        role: userMessage.role,
        content: userMessage.content,
        ...(importDocsForMessage && { importDocs: importDocsForMessage }),
        ...(is_folder_data !== undefined && { is_folder_data: is_folder_data }),
        ...(files && files.length > 0 && { files: files }),
        ...(websearch !== undefined && { websearch: websearch }),
        ...(isCanvasEdit !== undefined && { isCanvasEdit: isCanvasEdit }),
        ...(currentCanvasId && { currentCanvasId: currentCanvasId }),
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error("Error updating Firebase for normal message:", error);
      
      const chatRef = doc(db, "legalChats", chatId);
      await updateDoc(chatRef, {
        status: "error",
        statusMessage: "處理查詢時發生錯誤"
      });

      setChatData(prev => {
          const updatedMessages = [...(prev?.messages || [])];
          const lastIndex = updatedMessages.length - 1;
          if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'user') {
            const importDocsForError: Citation[] | undefined = docs?.map(doc => ({
              doc_id: doc.doc_id,
              category: doc.source_table,
              title: "",
              content: "",
              featured: "",
            }));

            updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                ...(importDocsForError && { importDocs: importDocsForError }),
                ...(is_folder_data !== undefined && { is_folder_data: is_folder_data }),
                status: 'error'
            };

            return {
              ...prev!,
              status: "error",
              messages: updatedMessages
          };
          }
          return prev;
      });

      return false;
    }
  } else {
    setChatData(prev => ({
      ...prev!,
      status: "pending",
      model: localModel
    }));

    try {
      const chatRef = doc(db, "legalChats", chatId);
      
      await updateDoc(chatRef, {
        status: "pending",
        statusMessage: `正在${getCanvasActionDescription(canvasAction)}...`,
        model: localModel,
        lastUpdated: new Date(),
        agentStatusHistory: []
      });
    } catch (error) {
      console.error("Error updating Firebase for canvas action:", error);
      
      const chatRef = doc(db, "legalChats", chatId);
      await updateDoc(chatRef, {
        status: "error",
        statusMessage: "處理Canvas操作時發生錯誤"
      });

      setChatData(prev => ({
        ...prev!,
        status: "error"
      }));

      return false;
    }
  }

  try {
    const apiEndpoint = isAgentMode 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/agent/process`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`;
    
    const apiPayload = isAgentMode 
      ? {
          chat_id: chatId,
          project_id: projectId || '',
          files: files || [],
        }
      : {
          chat_id: chatId,
          ...(websearch !== undefined && { websearch: websearch }),
          ...(canvasAction && { canvasAction: canvasAction }),
          ...(apiFilters && apiFilters)
        };
    
    const data = await apiPost(apiEndpoint, apiPayload);
    
    if (!data?.success) {
      throw new Error(data?.message || 'Failed to process message');
    }
    
    return true;
  } catch (error) {
    console.error("Error in API call:", error);
    
    const chatRef = doc(db, "legalChats", chatId);
    await updateDoc(chatRef, {
      status: "error",
      statusMessage: isAgentMode ? "AI 代理處理失敗" : (canvasAction ? "Canvas操作失敗" : "處理查詢時發生錯誤")
    });

    if (!canvasAction) {
      setChatData(prev => {
          const updatedMessages = [...(prev?.messages || [])];
          const lastIndex = updatedMessages.length - 1;
          if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'user') {
            const importDocsForError: Citation[] | undefined = docs?.map(doc => ({
              doc_id: doc.doc_id,
              category: doc.source_table,
              title: "",
              content: "",
              featured: "",
            }));

            updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                ...(importDocsForError && { importDocs: importDocsForError }),
                ...(is_folder_data !== undefined && { is_folder_data: is_folder_data }),
                status: 'error'
            };

            return {
              ...prev!,
              status: "error",
              messages: updatedMessages
          };
          }
          return prev;
      });
    } else {
      setChatData(prev => ({
        ...prev!,
        status: "error"
      }));
    }

    return false;
  }
}

export function getCanvasActionDescription(action: 'suggest' | 'longer' | 'shorter' | 'verify'): string {
  switch (action) {
    case 'suggest': return '生成修改建議';
    case 'longer': return '擴寫內容';
    case 'shorter': return '精簡內容';
    case 'verify': return '驗證內容';
    default: return '處理中';
  }
}

export async function editMessageAndRewrite(
  chatId: string,
  messageId: string,
  newContent: string,
  user: User | null,
  apiPost: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>,
  apiFilters?: Record<string, any>,
  mode?: "flash" | "think" | "deepresearch" | "agent",
  websearch?: boolean
) {
  if (!user) {
    toast.error("User not authenticated");
    return false;
  }
  if (!newContent.trim()) {
    toast.warning("訊息內容不能為空", { duration: 2000 });
    return false;
  }

  try {
    const token = await user.getIdToken();
    const chatRef = doc(db, "legalChats", chatId);
    const messageRef = doc(db, "legalChats", chatId, "messages", messageId);
    const messagesColRef = collection(db, "legalChats", chatId, "messages");

    await updateDoc(messageRef, {
      content: newContent,
      timestamp: new Date(),
      ...(websearch !== undefined && { websearch: websearch })
    });

    const allMessagesQuery = query(messagesColRef, orderBy("__name__"));
    const allMessagesSnapshot = await getDocs(allMessagesQuery);
    const allMessageDocs = allMessagesSnapshot.docs;

    const targetIndex = allMessageDocs.findIndex(doc => doc.id === messageId);

    if (targetIndex === -1) {
      console.error("Edited message ID not found in subcollection:", messageId);
      toast.error("找不到要編輯的訊息");
      return false;
    }

    const messagesToDelete = allMessageDocs.slice(targetIndex + 1);
    const deletePromises = messagesToDelete.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    const chatDoc = await getDoc(chatRef);
    let updatedDocMessages = [];

    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      const currentDocMessages = chatData.messages || [];

      const mainDocTargetIndex = currentDocMessages.findIndex((msg: Message) => msg.id === messageId);

      if (mainDocTargetIndex !== -1) {
        updatedDocMessages = currentDocMessages.slice(0, mainDocTargetIndex + 1);
        updatedDocMessages[mainDocTargetIndex] = {
          ...updatedDocMessages[mainDocTargetIndex],
          content: newContent,
          timestamp: new Date().toISOString(),
          ...(websearch !== undefined && { websearch: websearch })
        };
      } else {
        console.warn(`Message ID ${messageId} not found in main doc array. Reconstructing.`);
        const messagesToKeep = allMessageDocs.slice(0, targetIndex + 1);
        updatedDocMessages = messagesToKeep.map(docSnapshot => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            role: data.role,
            content: docSnapshot.id === messageId ? newContent : data.content,
            timestamp: (docSnapshot.id === messageId ? new Date() : data.timestamp?.toDate?.() || new Date()).toISOString(),
            ...(data.importDocs && { importDocs: data.importDocs }),
            ...(data.is_folder_data !== undefined && { is_folder_data: data.is_folder_data }),
            ...(docSnapshot.id === messageId && websearch !== undefined && { websearch: websearch }),
            ...(docSnapshot.id !== messageId && data.websearch !== undefined && { websearch: data.websearch })
          };
        });
      }
    } else {
       console.error("Chat document not found:", chatId);
       toast.error("找不到聊天紀錄");
       return false;
    }

    if (updatedDocMessages.length > 6) {
      updatedDocMessages = updatedDocMessages.slice(-6);
    }
    
    const isAgentMode = mode === "agent";
    const effectiveMode = isAgentMode ? "agent" : mode || "flash";
    
    await updateDoc(chatRef, {
      status: "pending",
      statusMessage: "編輯訊息並重新生成回應中...",
      lastUpdated: new Date(),
      messages: updatedDocMessages,
      model: effectiveMode,
      agentStatusHistory: []
    });

    const apiEndpoint = isAgentMode 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/agent/process`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`;

    const apiPayload = isAgentMode 
      ? { chat_id: chatId }
      : {
          chat_id: chatId,
          ...(apiFilters && apiFilters),
          ...(websearch !== undefined && { websearch: websearch })
        };

    const data = await apiPost(apiEndpoint, apiPayload);
    
    if (!data?.success) {
      throw new Error(data?.message || 'API failed to process edit/rewrite request');
    }
    return true;

  } catch (error) {
    console.error("Error editing message and rewriting:", error);
    toast.error(`編輯訊息時發生錯誤: ${error instanceof Error ? error.message : String(error)}`);
    
    const chatRef = doc(db, "legalChats", chatId);
    try {
      await updateDoc(chatRef, {
        status: "error",
        statusMessage: "編輯訊息時發生錯誤"
      });
    } catch (updateError) {
       console.error("Failed to update chat status to error:", updateError);
    }
    return false;
  }
}

export async function rewriteResponse(
  chatId: string,
  messageId: string,
  user: User | null,
  apiPost: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>,
  apiFilters?: Record<string, any>,
  mode?: "flash" | "think" | "deepresearch" | "agent",
  websearch?: boolean
) {
    try {
      if (!user) {
        toast.error("User not authenticated");
        return false;
      }
      
      const chatRef = doc(db, "legalChats", chatId);
      const chatDoc = await getDoc(chatRef);
      const chatData = chatDoc.data() || {};
      
      const messagesRef = collection(db, `legalChats/${chatId}/messages`);
      const allMessagesQuery = query(messagesRef, orderBy("__name__"));
      const allMessagesSnapshot = await getDocs(allMessagesQuery);
      
      const allMessageDocs = allMessagesSnapshot.docs;
      const targetIndex = allMessageDocs.findIndex(doc => doc.id === messageId);
      
      if (targetIndex !== -1) {
        const messagesToDelete = allMessageDocs.slice(targetIndex);
        const deletePromises = messagesToDelete.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        const targetMessageDoc = allMessageDocs[targetIndex];
        const targetMessageData = targetMessageDoc.data();
        const targetMessageTimestamp = targetMessageData.timestamp?.toDate?.() 
          ? targetMessageData.timestamp.toDate().toISOString() 
          : new Date().toISOString();
        
        const currentDocMessages = chatData.messages || [];
        
        const mainDocTargetIndex = currentDocMessages.findIndex((msg: {role: string, content: string, timestamp?: string}) => {
            if (msg.role === targetMessageData.role && msg.content === targetMessageData.content) {
              return true;
            }
          
          if (msg.timestamp && targetMessageTimestamp) {
            return msg.timestamp === targetMessageTimestamp;
          }
          
          return false;
        });
        
        let updatedDocMessages;
        
        if (mainDocTargetIndex !== -1) {
          updatedDocMessages = currentDocMessages.slice(0, mainDocTargetIndex);
        } else {
          const validMessages = allMessageDocs.slice(0, targetIndex);
          
          updatedDocMessages = validMessages.map(doc => {
            const msgData = doc.data();
            return {
              role: msgData.role,
              content: msgData.content,
              timestamp: msgData.timestamp?.toDate?.() 
                ? msgData.timestamp.toDate().toISOString() 
                : new Date().toISOString(),
              ...(msgData.citations && { citations: msgData.citations })
            };
          });
        }
        
        if (updatedDocMessages.length > 6) {
          updatedDocMessages = updatedDocMessages.slice(-6);
        }
        
        const isAgentMode = mode === "agent";
        const effectiveMode = isAgentMode ? "agent" : mode || "flash";

        await updateDoc(chatRef, {
          status: "pending",
          statusMessage: "重新生成回應中...",
          lastUpdated: new Date(),
          messages: updatedDocMessages,
          model: effectiveMode, 
          agentStatusHistory: []
        });
        
        const apiEndpoint = isAgentMode 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/agent/process`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`;

        const apiPayload = isAgentMode 
          ? { chat_id: chatId }
          : {
              chat_id: chatId,
              ...(apiFilters && apiFilters),
              ...(websearch !== undefined && { websearch: websearch })
            };

        const data = await apiPost(apiEndpoint, apiPayload);
        
        if (!data?.success) {
          throw new Error(data?.message || 'Failed to regenerate response');
        }
        
        return true;
      } else {
        console.error("找不到訊息 ID:", messageId);
        return false;
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
      const chatRef = doc(db, "legalChats", chatId);
      await updateDoc(chatRef, {
        status: "error",
        statusMessage: "重新生成回應失敗"
      });
      return false;
    }
  }

export const stopChatGeneration = async (
  chatId: string, 
  apiPost: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>
): Promise<boolean> => {
  try {
    const result = await apiPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/stop`, {
      chat_id: chatId
    });

    return result?.success || false;
  } catch (error) {
    console.error("Error stopping generation:", error);
    return false;
  }
};
