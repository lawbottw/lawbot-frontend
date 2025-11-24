type ParsedSSEvent = {
  event: string;
  data: string;
};

const parseSseEvent = (rawEvent: string): ParsedSSEvent | null => {
  if (!rawEvent) return null;
  const sanitized = rawEvent.replace(/\r/g, "");
  const lines = sanitized.split("\n");
  let eventName = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim() || "message";
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5));
    }
  }

  return {
    event: eventName,
    data: dataLines.join("\n"),
  };
};

export type ChatStreamEventHandlers = Record<string, (payload: any) => void>;

export interface ConnectChatStreamOptions {
  chatId: string;
  streamId?: string;
  getFirebaseToken: () => Promise<string | null>;
  signal?: AbortSignal;
  handlers?: ChatStreamEventHandlers;
  apiBaseUrl?: string;
  apiKey?: string;
  fetcher?: typeof fetch;
  onOpen?: () => void;
  onClose?: () => void;
}

export async function connectChatStream(options: ConnectChatStreamOptions): Promise<void> {
  const {
    chatId,
    streamId,
    getFirebaseToken,
    signal,
    handlers = {},
    apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetcher = fetch,
    onOpen,
    onClose,
  } = options;

  if (!chatId) {
    throw new Error("chatId is required to open chat stream");
  }
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  const token = await getFirebaseToken();
  if (!token) {
    throw new Error("Unable to acquire Firebase token for chat stream");
  }

  const response = await fetcher(`${apiBaseUrl}/api/v1/chat/stream/${chatId}`, {
    method: 'GET',
    headers: {
      Accept: 'text/event-stream',
      'Firebase-Auth': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to establish chat stream (${response.status})`);
  }

  if (!response.body) {
    throw new Error('Readable stream is not available on this environment');
  }

  onOpen?.();

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  const cancelReader = async () => {
    try {
      await reader.cancel();
    } catch {
      // ignore cancellation errors
    }
  };

  const handleAbort = () => {
    cancelReader();
  };

  if (signal) {
    if (signal.aborted) {
      await cancelReader();
      onClose?.();
      return;
    }
    signal.addEventListener('abort', handleAbort, { once: true });
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let separatorIndex: number;
      while ((separatorIndex = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);
        if (!rawEvent.trim()) continue;

        const parsed = parseSseEvent(rawEvent);
        if (!parsed) continue;

        let payload: any = parsed.data;
        if (payload) {
          try {
            payload = JSON.parse(payload);
          } catch {
            // keep raw payload string
          }
        }

        if (
          streamId &&
          payload &&
          typeof payload === 'object' &&
          'stream_id' in payload &&
          payload.stream_id !== streamId
        ) {
          continue;
        }

        const handler = handlers[parsed.event] || handlers.message;
        handler?.(payload);
      }
    }
  } finally {
    onClose?.();
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
    await cancelReader();
  }
}
