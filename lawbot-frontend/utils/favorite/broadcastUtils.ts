import { User } from 'firebase/auth';

// Broadcast Update Utility
export const createBroadcastUpdate = (broadcastChannelRef: React.RefObject<BroadcastChannel | null>, authUser: User | null) => {
  return (payload: any) => {
    try {
      if (broadcastChannelRef.current && payload && authUser) {
        // 添加發送者ID以避免處理自己的消息
        const messageWithSender = {
          ...payload,
          payload: {
            ...payload.payload,
            senderId: authUser.uid
          }
        };
        broadcastChannelRef.current.postMessage(messageWithSender);
      }
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  };
};
