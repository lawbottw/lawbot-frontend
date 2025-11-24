import { Suggestion } from "./suggestion";
import { UploadedFile } from "./upload-file";

export type Mode = "flash" | "think" | "deepresearch" | "agent";

export interface QueryInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (sources: Suggestion[], mode: Mode, files?: UploadedFile[], websearch?: boolean, queryText?: string, projectId?: string) => void;
  loading?: boolean;
  isDeepResearchLoading?: boolean;
  mode?: Mode;
  onModeChange?: (mode: Mode) => void;
  placeholder?: string
  submitDisabled?: boolean;
  className?: string;
  filterTrigger?: React.ReactNode;
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  showFileUpload?: boolean;
  websearch?: boolean;
  onWebsearchChange?: (websearch: boolean) => void;
  onStopGeneration?: () => void;
  selectedProjectId?: string | null; // Change to project ID
  setSelectedProjectId?: (projectId: string) => void; // Change to setter for ID
  isFixedProject?: boolean;
}