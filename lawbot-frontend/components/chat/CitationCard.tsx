import React from "react";
import { HoverCardContent } from "@/components/ui/hover-card";
import Link from "next/link";
import { Award } from 'lucide-react';
import Favorite from '@/components/Favorite';
import { useFavorites } from "@/context/FavoriteContext";
import { Citation, WebResource } from '@/types/chat';

type ResourceData = Citation | WebResource;

interface CitationCardProps {
  citation: ResourceData;
}

export function CitationCard({ citation }: CitationCardProps) {
  const { isDocFavorited } = useFavorites();
  
  // Check if it's a Citation (has category and doc_id) or WebResource
  const isCitation = 'category' in citation && 'doc_id' in citation;
  const category = isCitation ? (citation as Citation).category : 'web';
  const showFavorite = isCitation && ['article_content', 'judgment', 'interpretation', 'constitution',"directive","legal_question","resolution", "explanation"].includes(category);
  
  // Check if should show award icon
  const showAward = isCitation && 
    (citation as Citation).featured && 
    ['V', 'F', 'G'].includes((citation as Citation).featured);

  return (
    <HoverCardContent className={`w-96 p-4 max-h-[300px] overflow-y-auto rounded-xl scrollbar-hide`}>
        <div className="flex justify-between items-center mb-1">
          <Link target="_blank" href={isCitation ? `/${(citation as Citation).url || ""}` : (citation as WebResource).url} className="flex-grow mr-2">
            <div className="flex items-center">
              {showAward && (
                <Award size={18} className="text-yellow-800 mr-1 flex-shrink-0" />
              )}
              <h3 className="text-lg font-medium hover:underline hover:underline-offset-4 break-words">{citation.title}</h3>
            </div>
          </Link>
          {showFavorite && (
            <Favorite
              docId={(citation as Citation).doc_id}
              source_table={(citation as Citation).category}
              title={citation.title}
              isInitiallyFavorited={isDocFavorited((citation as Citation).doc_id, (citation as Citation).category)}
              className="ml-2"
            />
          )}
        </div>
        <p className="text-base mt-1 border-l-2 border-primary/50 pl-2 break-words break-all">
          {citation.content}
        </p>
    </HoverCardContent>
  );
}
