"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useUser } from "@/context/UserContext";
import UpgradeModal from "../common/UpgradeModal";
import { FileAttachments } from "./FileUpload";
import { AutocompletePopover } from "./AutocompletePopover";
import SelectedSourcesTags from "./SelectedSourcesTags";
import { useAutocompleteSuggestion } from "@/hooks/useAutocompleteSuggestion";
import { useQueryFileUpload } from "@/hooks/useQueryFileUpload";
import { Suggestion } from "@/types/suggestion";
import { QueryInputProps, Mode } from "@/types/queryinput";
import { ActiveFeatures } from "./ActiveFeatures";
import { ModePanel } from "./ModePanel";
import { ProjectSelection } from "./ProjectSelection";
import { toast } from "sonner";

export function QueryInput({
  value,
  onChange,
  onSubmit,
  loading,
  isDeepResearchLoading = false,
  mode = "flash",
  onModeChange,
  placeholder = "輸入問題、生成書狀，或用 @ 匯入書籤資料...",
  submitDisabled = false,
  className = "",
  filterTrigger,
  files = [],
  onFilesChange,
  websearch: externalWebsearch,
  onWebsearchChange,
  onStopGeneration,
  selectedProjectId,
  setSelectedProjectId,
  isFixedProject = false
}: QueryInputProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { plan, loading: planLoading } = useUser();
  const { cases } = useProject();
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeepResearchMode, setIsDeepResearchMode] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<null | "think" | "files" | "web" | "agent">(null);
  const [websearch, setWebsearch] = useState(externalWebsearch || false);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [fixedProject, setFixedProject] = useState(isFixedProject);
  const MAX_SUGGESTIONS = 10;

  const {
    allFiles,
    setAllFiles,
    handleFilesChange,
    handleFileDelete,
    handleFilesFromInput,
    hasUploadingFiles,
  } = useQueryFileUpload({
    user,
    files,
    onFilesChange,
    isDeepResearchMode,
    websearch,
  });

  const {
    showAutocomplete,
    autocompleteSuggestions,
    handleAutocompleteSearch,
    parseAutocomplete,
    hideAutocomplete,
    selectedSources,
    setSelectedSources,
    insertSuggestion,
    removeSource
  } = useAutocompleteSuggestion({
    maxSuggestions: MAX_SUGGESTIONS,
    isDeepResearchMode: mode === "deepresearch",
    filesPresent: files.length > 0,
    websearchEnabled: websearch
  });
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const removeSourceHandler = (sourceToRemove: Suggestion) => {
    removeSource(sourceToRemove);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPosition = e.target.selectionStart;
    parseAutocomplete(newValue, cursorPosition);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.defaultPrevented) {
      return;
    }

    if (!showAutocomplete && e.key === "Enter" && !e.shiftKey && !isComposing && !isMobile) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectedProject = selectedProjectId ? cases.find(project => project.id === selectedProjectId) : null;

  const handleSubmit = () => {
    const isDisabled = (isDeepResearchMode ? isDeepResearchLoading : loading) || submitDisabled || hasUploadingFiles;
    if (isDisabled) return;

    const sourcesToSubmit = mode === 'deepresearch' ? [] : selectedSources;
    const filesToSubmit = files.length > 0 ? files : undefined;
    const projectIdToSubmit = selectedProjectId || undefined;
    
    onSubmit(sourcesToSubmit, mode, filesToSubmit, websearch, undefined, projectIdToSubmit);
    
    setSelectedSources([]);
    if (onFilesChange) {
      onFilesChange([]);
    }
    setWebsearch(false);
    if (onWebsearchChange) {
      onWebsearchChange(false);
    }
    setIsDeepResearchMode(false);

    if (selectedProjectId && !fixedProject) {
      setFixedProject(true);
    }
  };

  const applyModeChange = (nextMode: Mode) => {
    if (nextMode === "agent" && !planLoading) {
      if (!plan || plan === "free" || plan === "lite") {
        setShowUpgradeModal(nextMode);
        return false;
      }
    }

    if (nextMode === "think" && !planLoading) {
      if (!plan || plan === "free") {
        setShowUpgradeModal(nextMode);
        return false;
      }
    }

    if (nextMode === "deepresearch" || nextMode === "agent") {
      setWebsearch(false);
      onWebsearchChange?.(false);
    }

    setIsDeepResearchMode(nextMode === "deepresearch");
    onModeChange?.(nextMode);
    return true;
  };

  const handleThinkToggle = () => {
    applyModeChange(mode === "think" ? "flash" : "think");
  };

  const handleDeepResearchToggle = () => {
    if (mode === "deepresearch") {
      applyModeChange("flash");
      return;
    }

    if (selectedSources.length > 0) {
      toast.info("深度探索模式不支持匯入來源，已自動移除。");
      setSelectedSources([]);
    }

    setWebsearch(false);
    onWebsearchChange?.(false);

    applyModeChange("deepresearch");
  };

  const handleAgentToggle = () => {
    if (mode === "agent") {
      applyModeChange("flash");
      return;
    }

    if (selectedSources.length > 0) {
      toast.info("AI 代理模式不支援匯入來源，已自動移除。");
      setSelectedSources([]);
    }
    setWebsearch(false);
    onWebsearchChange?.(false);

    applyModeChange("agent");
  };

  const handleWebsearchWithFeature = () => {
    if (!websearch && (!plan || plan === "free")) {
      setShowUpgradeModal("web");
      return;
    }
    
    if (!websearch) {
      if (selectedSources.length > 0) {
        setSelectedSources([]);
      }
      
      if (files.length > 0 && onFilesChange) {
        onFilesChange([]);
      }
      
      if (mode === "deepresearch" || mode === "agent") {
        applyModeChange("flash");
      }
    }
    
    const newWebsearch = !websearch;
    setWebsearch(newWebsearch);
    if (onWebsearchChange) {
      onWebsearchChange(newWebsearch);
    }
  };

  useEffect(() => {
    const features: string[] = [];
    if (mode === "think") features.push("思考");
    if (mode === "deepresearch") features.push("研究");
    if (mode === "agent") features.push("代理");
    if (websearch) features.push("搜尋");
    setActiveFeatures(features);
  }, [mode, websearch]);

  const handleRemoveFeature = (featureToRemove: string) => {
    if (featureToRemove === "思考" && mode === "think") {
      handleThinkToggle();
    } else if (featureToRemove === "研究" && mode === "deepresearch") {
      handleDeepResearchToggle();
    } else if (featureToRemove === "代理" && mode === "agent") {
      handleAgentToggle();
    } else if (featureToRemove === "搜尋" && websearch) {
      handleWebsearchWithFeature();
    }
  };

  useEffect(() => {
    if (externalWebsearch !== undefined && externalWebsearch !== websearch) {
      setWebsearch(externalWebsearch);
    }
  }, [externalWebsearch, websearch]);

  const handlePaste = useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    let handled = false;
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
      event.preventDefault();
      await handleFilesFromInput(event.clipboardData.files);
      handled = true;
    }

    const text = event.clipboardData.getData('text');
    if (text) {
      event.preventDefault();
      if (textareaRef.current) {
        const el = textareaRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const newValue = before + text + after;
        onChange(newValue);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + text.length, start + text.length);
        }, 0);
        handleAutocompleteSearch(text);
      } else {
        onChange(value + text);
        handleAutocompleteSearch(text);
      }
      handled = true;
    }

    if (!handled) return;
  }, [handleFilesFromInput, value, onChange, handleAutocompleteSearch]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesFromInput(e.dataTransfer.files);
    }
  }, [handleFilesFromInput]);

  return (
    <div className="mx-2 sm:mx-4">
      <div id="step2" className="relative flex flex-col border bg-background rounded-3xl shadow-md">
        <div className="relative">
          <Textarea 
              ref={textareaRef}
              placeholder={placeholder}
              value={value}
              onChange={handleTextChange}
              className={`md:text-lg min-h-[80px] md:min-h-[100px] xl:min-h-[120px] p-4 resize-none rounded-t-xl border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${className}`}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onCompositionStart={() => {
              setIsComposing(true);
            }}
            onCompositionEnd={() => {
              setTimeout(() => {
                setIsComposing(false);
              }, 0);
            }}
          />
          <AutocompletePopover
            show={showAutocomplete}
            suggestions={autocompleteSuggestions}
            maxSuggestions={MAX_SUGGESTIONS}
            isComposing={isComposing}
            onSuggestionSelect={(suggestion) =>
              insertSuggestion(suggestion, {
                value,
                onChange,
                textareaRef,
                toast
              })
            }
            onClose={hideAutocomplete}
          />
        </div>

        <SelectedSourcesTags
          selectedSources={selectedSources}
          onRemoveSource={removeSourceHandler}
        />

        {allFiles.length > 0 && (
          <FileAttachments 
            files={allFiles}
            onFileDelete={handleFileDelete}
            disabled={loading || isDeepResearchLoading}
          />
        )}

        <div className={`flex items-center justify-between p-2 py-1`}>
          <div className="flex items-center gap-1">
            {filterTrigger}
            
            <ModePanel
              mode={mode}
              loading={loading}
              isDeepResearchLoading={isDeepResearchLoading}
              submitDisabled={submitDisabled}
              files={files}
              hasUploadingFiles={hasUploadingFiles}
              selectedSources={selectedSources}
              websearch={websearch}
              onThinkClick={handleThinkToggle}
              onDeepResearchClick={handleDeepResearchToggle}
              onAgentClick={handleAgentToggle}
              onWebsearchClick={handleWebsearchWithFeature}
              handleFilesChange={handleFilesChange}
              setAllFiles={setAllFiles}
              onShowUpgradeModal={setShowUpgradeModal}
            />

            <ProjectSelection
              selectedProject={selectedProject}
              selectedProjectId={selectedProjectId}
              fixedProject={fixedProject}
              isFixedProject={isFixedProject}
              loading={loading}
              isDeepResearchLoading={isDeepResearchLoading}
              submitDisabled={submitDisabled}
              onClear={() => setSelectedProjectId?.('')}
              onSelect={(projectId) => setSelectedProjectId?.(projectId)}
            />

            <ActiveFeatures
              activeFeatures={activeFeatures}
              loading={loading}
              isDeepResearchLoading={isDeepResearchLoading}
              submitDisabled={submitDisabled}
              selectedProject={selectedProject}
              onRemove={handleRemoveFeature}
            />
          </div>
          
          <Button
            onClick={() => {
              if (!isDeepResearchMode && loading && onStopGeneration) {
                onStopGeneration();
              } else {
                handleSubmit();
              }
            }}
            size="lg"
            className="p-2 h-9 w-9 sm:h-10 sm:w-10 rounded-full"
            disabled={
              (isDeepResearchMode ? isDeepResearchLoading : (loading && !onStopGeneration)) ||
              submitDisabled ||
              hasUploadingFiles
            }
          >
            { !isDeepResearchMode && loading && onStopGeneration ? (
              <Square className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
            ) : (isDeepResearchMode ? isDeepResearchLoading : loading) ? (
              <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </div>

      <UpgradeModal
        open={!!showUpgradeModal}
        mode={showUpgradeModal}
        onClose={() => setShowUpgradeModal(null)}
        onUpgrade={() => {
          setShowUpgradeModal(null);
          if (!user){
            router.push('/login');
          }else{
            router.push("/billing");
          }
        }}
      />
    </div>
  );
}
