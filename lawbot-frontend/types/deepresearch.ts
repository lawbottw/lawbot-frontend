import { DocumentData } from "firebase/firestore";

// Define the structure matching Firestore
interface SectionPlanItem {
    section_id: string;
    section_description: string;
  }
  
  // Define the structure for cited/uncited documents based on user description
  interface DocumentMetadata {
    category?: string;
    content?: string; // Content only present for cited docs
    doc_id: string;
    title?: string;
    url?: string;
  }
  
// Uncited docs have the same structure but lack content
type UncitedDocumentMetadata = Omit<DocumentMetadata, 'content'>;

// Define and export the ResearchPlan interface
export interface ResearchPlan {
    research_summary?: string;
    research_approach?: string;
    sections?: SectionPlanItem[];
    error?: string | null;
}

export interface DeepResearchDocument extends DocumentData {
    userId?: string;
    createdAt?: any;
    lastUpdated?: any;
    initialQuery?: string;
    status?: 'planning' | 'planned' | 'researching' | 'completed' | 'error';
    statusMessage?: string;
    plan?: ResearchPlan | null; // Use the exported ResearchPlan type
    researchResult?: {
      report?: string;
      cited_docs_metadata?: DocumentMetadata[];
      uncited_docs_metadata?: UncitedDocumentMetadata[];
    } | null;
    chatId?: string;
    isPublic?: boolean;
    projectId?: string;
}

// Define and export the HeadingData interface for sidebar content
export interface HeadingData {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}


export interface ExportDeepResearchProps {
  title: string;
  content: string;
  exportDocument: (
    title: string,
    content: string,
    format: "pdf" | "docx"
  ) => Promise<void>
}