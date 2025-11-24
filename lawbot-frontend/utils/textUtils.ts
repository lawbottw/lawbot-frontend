export const formatMessageContent = (content: string) => {
    return content.replace(/@\(([^)]+)\)/g, '@$1');
  };