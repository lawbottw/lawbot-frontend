// /hooks/useApi.ts
'use client';

import { useAuth } from '@/context/AuthContext';
import { baseFetcher, ApiError } from '@/lib/fetcher';
import { useCallback, useMemo } from 'react';

type ApiOptions = RequestInit & {
  requireAuth?: boolean;
  timeout?: number;
};

export const useApi = () => {
  const { user } = useAuth();

  const getAuthHeaders = useCallback(async () => {
    if (!user) throw new ApiError('User not authenticated', 401);

    try {
      const token = await user.getIdToken();
      return {
        'Firebase-Auth': `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Failed to get Firebase token:', error);
      throw new ApiError('Failed to authenticate', 401);
    }
  }, [user]);

  const fetchWithAuth = useCallback(
    async <T = any>(url: string, options: ApiOptions = {}): Promise<T | null> => {
      const { requireAuth = true, headers, ...rest } = options;

      let authHeaders = {};

      if (requireAuth) {
        authHeaders = await getAuthHeaders();
      }

      return baseFetcher<T>(url, {
        ...rest,
        headers: {
          ...headers,
          ...authHeaders,
        },
      });
    },
    [getAuthHeaders]
  );

  const api = useMemo(
    () => ({
      get: <T = any>(url: string, options?: ApiOptions) =>
        fetchWithAuth<T>(url, { ...options, method: 'GET' }),

      post: <T = any>(url: string, body?: any, options?: ApiOptions) =>
        fetchWithAuth<T>(url, {
          ...options,
          method: 'POST',
          body: body ? JSON.stringify(body) : undefined,
        }),

      put: <T = any>(url: string, body?: any, options?: ApiOptions) =>
        fetchWithAuth<T>(url, {
          ...options,
          method: 'PUT',
          body: body ? JSON.stringify(body) : undefined,
        }),

      delete: <T = any>(url: string, options?: ApiOptions) =>
        fetchWithAuth<T>(url, { ...options, method: 'DELETE' }),
    }),
    [fetchWithAuth]
  );

  return api;
};

export const usePublicApi = () => {
  return useMemo(
    () => ({
      get: <T = any>(url: string, options?: RequestInit) =>
        baseFetcher<T>(url, { ...options, method: 'GET' }),

      post: <T = any>(url: string, body?: any, options?: RequestInit) =>
        baseFetcher<T>(url, {
          ...options,
          method: 'POST',
          body: body ? JSON.stringify(body) : undefined,
        }),
    }),
    []
  );
};
