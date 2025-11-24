"use client"

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { QueryInput } from "@/components/chat/QueryInput";
import { Suggestion } from "@/types/suggestion";
import { toast } from "sonner";
import { RateLimitBanner } from "@/components/common/RateLimitBanner";
import { checkUserUsageAndSubscription } from "@/services/rateLimitService"; 
import { RateLimitCheckResult } from "@/config/rateLimitConfig";
import { formatMessageContent } from "@/utils/textUtils";
import { useSearchFilters } from "@/hooks/useSearchFilters"; 
import { FilterSheetTrigger } from "@/components/search/FilterSheetTrigger";
import { useUser } from "@/context/UserContext";
import { UploadedFile } from "@/types/upload-file";
import { useFavorites } from "@/context/FavoriteContext";
import { useNextStep } from 'nextstepjs';
import { FeatureUpdateModal } from "@/components/common/FeatureUpdateModal";
import { Mode } from "@/types/queryinput";
import { useApi } from "@/hooks/useApi";
import { createInitialDeepResearchDoc, setDeepResearchDocError } from "@/services/deepResearchService";
import { createChatOperation } from "@/services/chatService";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("flash");
  const [loading, setLoading] = useState(false);
  const [isDeepResearchLoading, setIsDeepResearchLoading] = useState(false);
  const { user, authLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showRateLimitInfo, setShowRateLimitInfo] = useState<RateLimitCheckResult | null>(null);
  const { plan, loading: planLoading, hasTried, userData } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { getAllFavoritesFromFolder } = useFavorites();
  const { startNextStep } = useNextStep();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // Change to project ID
  const api = useApi();
  
  // 添加教學和功能更新相關狀態
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [featureModalClosed, setFeatureModalClosed] = useState(false);
  
  // 檢查是否需要顯示教學（延遲到 FeatureUpdateModal 處理完後）
  useEffect(() => {
    // 只有在大螢幕 (>768px) 且用戶已登入、FeatureUpdateModal 已處理完、且不在提交狀態時才檢查
    if (window.innerWidth <= 768) return;
    if (!authLoading && user && !isSubmitted && featureModalClosed) {
      const hasSeenTour = localStorage.getItem('hasSeenMainTour');
      if (!hasSeenTour) {
        setShouldShowTour(true);
      }
    }
  }, [user, authLoading, isSubmitted, featureModalClosed]);

  // 觸發教學並記錄到 localStorage
  useEffect(() => {
    if (shouldShowTour && user && !authLoading && !isSubmitted && featureModalClosed) {
      // 稍微延遲觸發，確保頁面完全載入
      const timer = setTimeout(() => {
        startNextStep('mainTour');
        // 記錄用戶已經看過教學
        localStorage.setItem('hasSeenMainTour', 'true');
        setShouldShowTour(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, user, authLoading, isSubmitted, featureModalClosed, startNextStep]);

  // 處理 FeatureUpdateModal 關閉事件
  const handleFeatureModalClose = () => {
    setFeatureModalClosed(true);
  };

  // 判斷是否顯示促銷資訊
  const shouldShowPromo = user && !planLoading && plan === 'free' && (hasTried === false || hasTried === null);

  // Initialize search filters hook with persistence enabled
  const filters = useSearchFilters({ persist: true });

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  // 增加一個 useRef 在頂部的 hooks 中
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 添加滾動到底部的函數
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update function signature to accept sources and mode
  const handleSearch = async (sources: Suggestion[], mode: Mode, files?: UploadedFile[], websearch: boolean = false, queryText?: string, projectId?: string) => {
    const searchQuery = queryText?.trim() || query.trim();
    
    if (!searchQuery.trim()) {
      toast.warning("請輸入內容", {
        description: "內容不能為空",
        duration: 2000,
      });
      return;
    }

    if (!user) {
      toast("請先登入", {
        description: "此操作需要登入帳號才能執行",
        duration: 3000,
      });
      router.push('/login?from=/');
      return;
    }

    // Close any existing rate limit banner before a new search
    if (showRateLimitInfo) setShowRateLimitInfo(null);

    // --- Rate Limit Check ---
    if (mode === 'deepresearch') setIsDeepResearchLoading(true);
    else setLoading(true);

    // 這裡改為傳 userData 給 checkUserUsageAndSubscription
    const usageCheckResult = checkUserUsageAndSubscription(userData, mode);

    if (!usageCheckResult.allowed) {
      setShowRateLimitInfo(usageCheckResult);
      if (mode === 'deepresearch') setIsDeepResearchLoading(false);
      else setLoading(false);
      setQuery(searchQuery);
      return;
    }

    const queryContent = searchQuery;

    try {
      // --- Deep Research Mode ---
      if (mode === 'deepresearch') {
        if (!isDeepResearchLoading) setIsDeepResearchLoading(true);
        setQuery(""); // Clear input immediately for deep research

        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const deepResearchId = `${timestamp}${randomSuffix}`;

        // 使用 service 建立 initial document
        createInitialDeepResearchDoc(
          deepResearchId,
          user.uid,
          searchQuery,
          websearch,
          projectId || ''
        ).catch(error => {
          console.error("Error creating initial deep research document:", error);
        });

        // 使用 api.post 取代 fetch
        api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/plan_deep_research`, { 
          query: searchQuery, 
          deepResearchId,
          websearch: websearch
        }).catch(async (error) => {
          await setDeepResearchDocError(
            deepResearchId,
            `規劃失敗，可能是網路連線不穩或是使用次數超過限制`
          );
        });

        // Navigate immediately to the deep research page
        setTimeout(() => router.push(`/d/${deepResearchId}`), 50);
        return;
      }

      // --- Agent Mode & Chat Mode ---
      setLoading(true);
      setSubmittedQuery(searchQuery);
      setIsSubmitted(true);
      setQuery("");
      scrollToBottom();

      let docs: { doc_id: string; category: string }[] = [];
      let is_folder_data: boolean = false;

      if (sources && sources.length > 0) {
        if (sources[0].type === 'folder') {
          is_folder_data = true;
          if (sources[0].folder && sources[0].folder.folder_id) {
            const allFavoritesFromFolder = getAllFavoritesFromFolder(sources[0].folder.folder_id);
            docs = allFavoritesFromFolder
              .map(item => ({
                doc_id: item.doc_id,
                category: item.source_table
              }))
              .filter(doc => doc.doc_id && doc.category) as { doc_id: string; category: string }[];
          } else {
            docs = [];
          }
        } else {
          is_folder_data = false;
          docs = sources
            .map(source => source.item ? ({
              doc_id: source.item.doc_id,
              category: source.item.source_table
            }) : null)
            .filter(doc => doc !== null) as { doc_id: string; category: string }[];
        }
      }

      // Get filter values from the hook
      const {
        judgmentTypes,
        judgmentLevels,
        caseTypes,
        featuredFilters,
        selectedSources: filterSources,
        startDate,
        endDate,
        canvasFormatType,
      } = filters;

      // Prepare filters for API payload (only include if they have values)
      const apiFilters: Record<string, any> = {};
      if (judgmentTypes.length > 0 && (judgmentTypes.length > 1 || judgmentTypes[0] !== 'all')) apiFilters.judgment_type = judgmentTypes;
      if (judgmentLevels.length > 0 && (judgmentLevels.length > 1 || judgmentLevels[0] !== 'all')) apiFilters.level = judgmentLevels;
      if (caseTypes.length > 0 && (caseTypes.length > 1 || caseTypes[0] !== 'all')) apiFilters.case_type = caseTypes;
      if (featuredFilters.length > 0 && (featuredFilters.length > 1 || featuredFilters[0] !== 'all')) apiFilters.featured = featuredFilters;
      if (filterSources.length > 0 && (filterSources.length > 1 || filterSources[0] !== 'all')) apiFilters.source = filterSources;
      if (startDate) apiFilters.start_date = startDate;
      if (endDate) apiFilters.end_date = endDate;
      apiFilters.canvas_format_type = canvasFormatType;

      // Use the new chat service function
      const result = await createChatOperation({
        userId: user.uid,
        query: searchQuery,
        mode: mode,
        docs: docs,
        is_folder_data: is_folder_data,
        files: files || [],
        websearch: websearch,
        projectId: projectId || '',
        filters: apiFilters,
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
        apiPost: api.post
      });

      if (!result.success) {
        throw result.error || new Error('Failed to create chat');
      }

      router.push(`/c/${result.chatId}?mode=${mode}`);

    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("處理請求時發生錯誤", {
        description: error instanceof Error ? error.message : "請稍後再試",
        duration: 3000,
      });
      // Reset UI state based on the mode attempted
      if (mode === 'flash') {
        setIsSubmitted(false); // Reset chat UI state
      }
      setQuery(queryContent); // Restore original query to input
    } finally {
      setLoading(false); // Ensure chat loading is always set to false
      setIsDeepResearchLoading(false); // Ensure deep research loading is always set to false
    }
  };

  return (
    <div className={`flex-1 w-full flex flex-col h-dvh ${isSubmitted ? "overflow-hidden" : "overflow-y-auto"} max-h-screen items-center justify-center`}>
        {/* Feature Update Modal */}
        <FeatureUpdateModal onClose={handleFeatureModalClose} />
        
        {showRateLimitInfo && !showRateLimitInfo.allowed && (
          <RateLimitBanner
            title={showRateLimitInfo.reason || "已達使用上限"}
            description={
              showRateLimitInfo.limitTypeHit
                ? `您本月用量已達 ${showRateLimitInfo.limitValue} 點`
                : "請考慮升級方案以獲取更多用量，或稍後再試。"
            }
            userPlan={showRateLimitInfo.plan}
            limitTypeHit={showRateLimitInfo.limitTypeHit}
            limitValue={showRateLimitInfo.limitValue}
            onClose={() => setShowRateLimitInfo(null)}
            onUpgrade={() => {
              setShowRateLimitInfo(null);
              router.push('/billing');
            }}
          />
        )}
        {!isSubmitted ? (
          <>                    
            {shouldShowPromo && (
              <p className="bg-secondary px-2 py-1 rounded-xl text-center text-base text-muted-foreground mt-2 mb-4 max-w-lg mx-auto cursor-pointer hover:text-foreground transition-colors" onClick={() => router.push('/billing')}>
                免綁卡免費試用14天，體驗完整功能！
              </p>
            )}
            {/* <p className="bg-secondary px-2 py-1 rounded-xl text-center text-sm text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
              我們將於7/9的晚上8點至隔天的早上6點進行資料庫維護及優化搜尋引擎，期間可能服務稍不穩定，敬請見諒。
            </p> */}
            <h1 className="text-4xl font-bold text-center mb-12">
            加速<span className="hidden sm:inline">您的</span>法律工作流程⚡
            </h1>

          </>
          ) : (
          // 當提交後顯示類似結果頁的訊息區塊
          <div className="flex-1 w-full overflow-y-auto scroll-smooth transition-all duration-300 ">
            <div className="flex-1 max-w-4xl mx-auto px-4 pl-6 pt-16">
              <div className="mb-4">
                <div className="flex justify-end">
                  <div className="bg-secondary/80 text-foreground/90 rounded-3xl px-4 py-2 max-w-[80%] inline-block">
                    <p className="leading-relaxed whitespace-pre-line">{submittedQuery}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    {/* 上下浮動的圓點 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-3 w-3 bg-primary/70 rounded-full animate-bounce"></div>
                    </div>
                    {/* 漣漪效果 */}
                    <div className="h-4 w-4 rounded-full bg-primary/20 animate-pulse"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">正在處理你的查詢...</span>
                </div>
                <div ref={messagesEndRef}></div>
              </div>
            </div>
          </div>
        )}

        <div className={`mb-2 w-full max-w-4xl mx-auto ${isSubmitted && 'mt-2'}`}>
          <QueryInput
            value={query}
            onChange={setQuery}
            onSubmit={(sources, mode, files, websearch, queryText, projectId) => handleSearch(sources, mode, files, websearch, queryText, projectId)}
            loading={loading} // Pass chat loading state
            isDeepResearchLoading={isDeepResearchLoading} // Pass deep research loading state
            mode={mode}
            onModeChange={handleModeChange}
            // Pass the FilterSheetTrigger component as a prop
            files={uploadedFiles}
            onFilesChange={setUploadedFiles}
            showFileUpload={true} // 如果需要顯示檔案上傳功能
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            isFixedProject={false}

            filterTrigger={
              <FilterSheetTrigger
                selectedSources={filters.selectedSources}
                setSelectedSources={filters.setSelectedSources}
                judgmentTypes={filters.judgmentTypes}
                setJudgmentTypes={filters.setJudgmentTypes}
                judgmentLevels={filters.judgmentLevels}
                setJudgmentLevels={filters.setJudgmentLevels}
                caseTypes={filters.caseTypes}
                setCaseTypes={filters.setCaseTypes}
                featuredFilters={filters.featuredFilters}
                setFeaturedFilters={filters.setFeaturedFilters}
                startDate={filters.startDate}
                setStartDate={filters.setStartDate}
                endDate={filters.endDate}
                setEndDate={filters.setEndDate}
                canvasFormatType={filters.canvasFormatType}
                setCanvasFormatType={filters.setCanvasFormatType}
                resetFilters={filters.resetFilters}
              />}
          />

          {/* FilterToolbar removed from here */}
          {isSubmitted && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              AI 可能犯錯，請自行檢查結果的準確性與完整性。
            </p>
          )}
        </div>
    </div>
  )
}