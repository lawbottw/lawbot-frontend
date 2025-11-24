'use client';
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { useApi } from '@/hooks/useApi';
import { CaseResponse, CreateCasePayload } from '@/types/project';

interface ProjectContextType {
  cases: CaseResponse[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createCase: (newCase: CreateCasePayload) => Promise<CaseResponse>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { plan, loading: planLoading } = useUser();
  const api = useApi();

  const shouldFetch = !!user && !planLoading && (plan === 'lite' || plan === 'pro');

  const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true
  };


  // 雖然我們這裡用不到 uid，但為了符合 SWR 的呼叫簽章，我們列出它 (或是只寫 url 也可以，JS 會忽略多餘參數)
  const swrFetcher = useCallback(async (url: string, uid: string) => {
    // uid 雖然被傳進來作為 Cache Key 的一部分，但實際 API 請求不需要它 (因為 token 在 header 裡)
    const res = await api.get<CaseResponse[]>(url);
    return res ?? [];
  }, [api]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<CaseResponse[]>(
    shouldFetch 
      ? [`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task/cases`] 
      : null,
    swrFetcher,
    swrConfig
  );

  const cases: CaseResponse[] = useMemo(() => {
    return (data || []).map(c => ({
      ...c,
      case_id: c.id,
    }));
  }, [data]);

  const refresh = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const createCase = useCallback(
    async (newCase: CreateCasePayload) => {
      if (!user) throw new Error("User not authenticated");
      if (!newCase.title.trim()) throw new Error("案件標題為必填");

      try {
        const requestData = {
          ...newCase,
          status: "active"
        };

        const result = await api.post<CaseResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task/create-case`,
          requestData
        );

        // 🟡 優化點: 這裡加個檢查比較安全，因為 api.post 可能回傳 null
        if (!result) throw new Error("Create case failed: No response");

        await mutate();
        return result;
      } catch (err) {
        console.error("Create Case Error:", err);
        throw err;
      }
    },
    [user, api, mutate]
  );

  const contextValue = useMemo(() => ({
    cases,
    isLoading,
    isValidating,
    error,
    refresh,
    createCase
  }), [cases, isLoading, isValidating, error, refresh, createCase]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject 必須在 ProjectProvider 內使用');
  }
  return context;
};