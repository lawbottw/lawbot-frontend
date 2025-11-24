import { useState, useEffect, useCallback, useRef } from "react";
import { doc, onSnapshot, collection, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatData, Message, AgentLogStatus } from "@/types/chat";
import { useRouter } from "next/navigation";

interface StreamingState {
  content: string;
  isActive: boolean;
  messageId: string | null;
}

export function useChatData(chatId: string) {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localModel, setLocalModel] = useState<"flash" | "think">("flash");
  const router = useRouter();
  
  const [streamingState, setStreamingState] = useState<StreamingState>({
    content: "",
    isActive: false,
    messageId: null
  });
  
  const [pauseFirebaseListener, setPauseFirebaseListener] = useState(false);
  const [streamingStartMessageCount, setStreamingStartMessageCount] = useState(0);

  const startStreaming = useCallback((messageId: string) => {
    setStreamingState({
      content: "",
      isActive: true,
      messageId: messageId
    });
    setPauseFirebaseListener(true);
    
    setChatData(prev => {
      if (prev) {
        setStreamingStartMessageCount(prev.messages.length);
      }
      return prev;
    });
  }, []);

  const updateStreamingContent = useCallback((content: string) => {
    setStreamingState(prev => ({
      ...prev,
      content: content
    }));
  }, []);

  const endStreaming = useCallback(() => {
    setStreamingState({
      content: "",
      isActive: false,
      messageId: null
    });
    setPauseFirebaseListener(false);
  }, []);

  const endStreamingRef = useRef(endStreaming);
  const streamingStateRef = useRef(streamingState);

  useEffect(() => {
    endStreamingRef.current = endStreaming;
    streamingStateRef.current = streamingState;
  }, [endStreaming, streamingState]);

  useEffect(() => {
    const chatRef = doc(db, "legalChats", chatId);

    const unsubscribeChatDoc = onSnapshot(chatRef, async (docSnapshot) => {
      if (pauseFirebaseListener && docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.status !== "error") {
          return;
        }
      }
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        setLocalModel(data.model || "flash");

        const docMessages = data.messages || [];
        
        setChatData(prev => ({
          ...prev || { 
            messages: [],
            status: "completed",
            model: "flash",
            statusMessage: "",
            lastUpdated: data.lastUpdated || null,
            researchId: data.researchId || null,
          },
          status: data.status,
          statusMessage: data.statusMessage || "",
          agentStatusHistory: (data.agentStatusHistory as AgentLogStatus[]) || [],
          lastUpdated: data.lastUpdated || null,
          model: (data.model as "flash" | "think" | "agent") || "flash",
          projectId: data.projectId || '',
          sharedFrom: data.sharedFrom || '',
          clonedFrom: data.clonedFrom || '',
          userId: data.userId || '',
          chatName: data.chatName || '',
          messages: prev?.messages?.length 
            ? prev.messages 
            : docMessages.map((msg: any) => ({
                ...msg,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              }))
        }));
      } else {
        setChatData({
          messages: [],
          status: "error",
          model: "flash",
          statusMessage: "找不到聊天紀錄",
          lastUpdated: null,
          error: "Chat not found",
          projectId: ''
        });
        router.push("/");
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error listening to chat document:", error);
      setIsLoading(false);
    });

    const messagesRef = collection(db, "legalChats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    
    const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Message;
        messages.push(message);
      });
      
      const currentStreamingState = streamingStateRef.current;
      
      if (pauseFirebaseListener && currentStreamingState.isActive) {
        if (messages.length > streamingStartMessageCount) {
          endStreamingRef.current();
        } else {
          return;
        }
      } else if (pauseFirebaseListener) {
        return;
      }
      
      setChatData(prev => {
        if (!prev) {
          return {
            status: "completed", 
            model: "flash",
            messages: messages,
            statusMessage: "",
            lastUpdated: null
          };
        }

        return {
          ...prev,
          messages: messages
        };
      });
      
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to messages:", error);
      setIsLoading(false);
    });
    
    return () => {
      unsubscribeChatDoc();
      unsubscribeMessages();
    };
  }, [chatId, isLoading, pauseFirebaseListener, router]);

  return { 
    chatData, 
    setChatData, 
    isLoading, 
    localModel, 
    setLocalModel,
    streamingState,
    startStreaming,
    updateStreamingContent,
    endStreaming
  };
}
