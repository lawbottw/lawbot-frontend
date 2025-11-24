// 定義資料類型
export interface Case {
  id: string;
  user_id: string;
  title: string;
  case_facts: string;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  id: string; // 確保有 id 欄位
  doc_id: string;
  title: string;
  content: string;
  source_table: string;
  featured?: string;
  evaluation_score: number;
  url?: string;
  is_manual?: boolean; // 新增：是否為手動標記
}

export interface UploadedFile {
  id: string;
  filename: string;
  ai_summary?: string | null;
}

// 定義後端 API 回應的案件類型
export type CaseResponse = {
  id: string;
  user_id: string;
  title: string | null;
  case_facts: string;
  created_at: string;
  updated_at: string;
  case_id: string;
};

// 合併面板 props
export interface CombinedProjectPanelProps {
  caseData: Case | null;
  caseFacts: string;
  setCaseFacts: (v: string) => void;
  updateCaseInfo: (data: Partial<Case>) => Promise<void>;
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: File[]) => Promise<UploadedFile[]>;
  onFileDelete: (fileId: string) => Promise<void>;
  caseId: string;
  onStartSearch: (fact: string) => Promise<void>;
  results: SearchResult[];
  fetchRelatedJudgments: (docId: string) => Promise<any>;
  deleteCase: (caseId: string) => Promise<{ success?: boolean; deleted?: boolean; message?: string }>;
}

// 案件資訊區塊
export interface CaseInfoSectionProps {
  caseData: Case | null;
  updateCaseInfo: (data: Partial<Case>) => Promise<void>;
  deleteCase: (caseId: string) => Promise<{ success?: boolean; deleted?: boolean; message?: string }>;
  caseFacts: string; // 新增
  setCaseFacts: (v: string) => void; // 新增
}

// 研究結果區塊
export interface ResearchResultsSectionProps {
  results: SearchResult[];
  fetchRelatedJudgments: (docId: string) => Promise<any>;
  onStartSearch?: (fact: string) => Promise<void>;
  caseFacts?: string;
}

export interface FileUploadSectionProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: File[]) => Promise<UploadedFile[]>;
  onFileDelete: (fileId: string) => Promise<void>;
}

export interface CreateCasePayload {
  title: string;
  case_facts: string;
}