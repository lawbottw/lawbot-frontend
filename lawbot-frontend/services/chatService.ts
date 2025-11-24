// Re-export hooks
export { useChatData } from './chat/chatHooks';

// Re-export message operations
export {
  sendMessage,
  editMessageAndRewrite,
  rewriteResponse,
  stopChatGeneration,
  getCanvasActionDescription
} from './chat/messageOperations';

// Re-export message creation operations
export { createChatOperation } from './chat/messageCreation';
export type { CreateChatResult } from './chat/messageCreation';

// Re-export streaming operations
export type { ChatStreamEventHandlers, ConnectChatStreamOptions } from './chat/streamOperations';
export { connectChatStream } from './chat/streamOperations';

