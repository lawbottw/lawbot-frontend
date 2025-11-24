// /lib/server-api.ts
import { baseFetcher } from './fetcher';

type ServerApiOptions = RequestInit & {
  revalidate?: number;
};

/**
 * Server Component 專用 API 函數
 * 支援 Next.js 的 revalidate cache
 */

// 公開 API (有快取)
export const serverGet = <T = any>(
  url: string,
  revalidate: number = 30,
  options?: ServerApiOptions
) => {
  return baseFetcher<T>(url, {
    ...options,
    method: 'GET',
    next: { revalidate, ...options?.next },
  });
};

// 公開 API POST (不快取)
export const serverPost = <T = any>(
  url: string,
  body?: any,
  options?: ServerApiOptions
) => {
  return baseFetcher<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
};