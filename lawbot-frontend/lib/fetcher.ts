export class ApiError extends Error {
  status: number;
  info?: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
    this.name = 'ApiError';
  }
}

type FetcherOptions = RequestInit & {
  timeout?: number;
};

export const baseFetcher = async <T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T | null> => {
  const { headers, timeout, ...rest } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = timeout
    ? setTimeout(() => controller.abort(), timeout)
    : null;

  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      signal: controller.signal,
      ...rest,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      let errorInfo;
      try {
        errorInfo = await response.json();
      } catch {
        errorInfo = await response.text();
      }

      throw new ApiError(
        errorInfo?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorInfo
      );
    }

    const contentType = response.headers.get('content-type');

    // 無內容時回傳 null
    if (!contentType) return null;

    if (contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    return (response as unknown) as T;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }

    throw new ApiError((error as Error).message || 'Network error', 0);
  }
};

// shortcut methods
export const get = <T = any>(url: string, options?: FetcherOptions) =>
  baseFetcher<T>(url, { ...options, method: 'GET' });

export const post = <T = any>(url: string, body?: any, options?: FetcherOptions) =>
  baseFetcher<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const put = <T = any>(url: string, body?: any, options?: FetcherOptions) =>
  baseFetcher<T>(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const del = <T = any>(url: string, options?: FetcherOptions) =>
  baseFetcher<T>(url, { ...options, method: 'DELETE' });
