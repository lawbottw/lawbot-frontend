import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import { Citation } from '@/types/chat';
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { CitationCard } from "@/components/ai-search/CitationCard";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Favorite from '@/components/Favorite';

// 處理帶有援引標記的文本
export const renderTextWithCitations = (text: string, citations?: Citation[]) => {
  if (!citations || citations.length === 0) return text;
  
  // 尋找[數字]格式的引用
  const regex = /\[(\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // 添加引用前的文字
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const citationIndex = parseInt(match[1], 10);
    // 檢查引用索引是否有效 (索引從1開始)
    if (citationIndex > 0 && citationIndex <= citations.length) {
      const citation = citations[citationIndex - 1]; // 調整為0基礎索引

      // Check if should show award icon
      const showAward = citation.featured && ['V', 'F', 'G'].includes(citation.featured);

      // 添加帶有HoverCard的引用標記，每個標記為獨立的行內元素
      parts.push(
        <span key={match.index} className='inline-block'>
          {/* 桌面版使用HoverCard */}
          <span className="hidden lg:block">
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link 
                  target="_blank" 
                  href={`/${citation.url || ""}`} 
                  className="text-primary cursor-pointer bg-primary/10 rounded-sm px-2 ml-1 text-base font-semibold">
                  {citationIndex}
                </Link>
              </HoverCardTrigger>
              <CitationCard citation={citation} />
            </HoverCard>
          </span>
          
          {/* 行動版使用Drawer */}
          <span className="inline-block lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <span className="text-primary cursor-pointer bg-primary/10 rounded-sm px-2 ml-1 text-base font-semibold">
                  {citationIndex}
                </span>
              </DrawerTrigger>
              <DrawerContent className='max-h-[85vh] min-h-[50vh]'>
                <DrawerHeader className="pb-0 mb-0">
                  <DrawerTitle>
                    <div className="flex items-center justify-center w-full">
                      {/* Title 可選取 */}
                      <div className="select-text px-2 flex items-center">
                        {showAward && (
                          <Award size={18} className="text-yellow-800 mr-1 flex-shrink-0" />
                        )}
                        <Link
                          href={`/${citation.url || ""}`}
                          target="_blank"
                          className="select-text hover:underline hover:underline-offset-2 text-primary text-xl font-medium break-words"
                        >
                          {citation.title}
                        </Link>
                      </div>
                      {/* Favorite 按鈕（僅 citation 類型） */}
                      {['article_content', 'judgment', 'interpretation', 'constitution', "directive", "legal_question", "resolution", "explanation"].includes(citation.category) && (
                        <Favorite
                          docId={citation.doc_id}
                          source_table={citation.category}
                          title={citation.title}
                          // 若需初始書籤狀態，需在外層組件用 useFavorites
                          className="h-4 w-4 flex-shrink-0"
                        />
                      )}
                    </div>
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-8 overflow-y-auto select-text">
                  <p className="text-base my-2 break-words">{citation.content}</p>
                </div>
              </DrawerContent>
            </Drawer>
          </span>
          {' '}
        </span>
      );
    } else {
      // 如果引用索引無效，保持原樣
      parts.push(match[0]);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // 添加剩餘文字
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

// 遞迴處理節點中的引用
export const processNodeWithCitations = (node: React.ReactNode, citations?: Citation[]): React.ReactNode => {
  // 處理純文本節點
  if (typeof node === 'string') {
    return renderTextWithCitations(node, citations);
  }
  
  // 處理 React 元素節點
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{children?: React.ReactNode}>;
    // 深度複製子元素並遞迴處理它們
    const processedChildren = React.Children.map(element.props.children, child => 
      processNodeWithCitations(child, citations)
    );
    
    // 用處理過的子元素克隆原元素
    return React.cloneElement(element, {}, ...(processedChildren || []));
  }
  
  // 處理數組節點（例如 fragments）
  if (Array.isArray(node)) {
    return node.map(child => processNodeWithCitations(child, citations));
  }
  
  // 其他類型的節點直接返回
  return node;
};

