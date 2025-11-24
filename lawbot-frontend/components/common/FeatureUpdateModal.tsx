"use client";

import { useState, useEffect } from "react";
import { X, Check, ExternalLink } from "lucide-react";
import { 
  CURRENT_FEATURE_UPDATE, 
  hasSeenCurrentUpdate, 
  markUpdateAsSeen
} from "@/config/featureUpdates";
import { Button } from "@/components/ui/button";

interface FeatureUpdateModalProps {
  onClose?: () => void;
}

export function FeatureUpdateModal({ onClose }: FeatureUpdateModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 檢查是否需要顯示更新 modal
    const shouldShow = !hasSeenCurrentUpdate();
    // const shouldShow = true
    if (shouldShow) {
      // 延遲一點顯示，讓頁面先載入完成
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // 如果不需要顯示 modal，立即通知父組件
      onClose?.();
    }
  }, [onClose]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      markUpdateAsSeen();
      onClose?.();
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleBlogClick = () => {
    if (CURRENT_FEATURE_UPDATE.blogLink) {
      window.open(CURRENT_FEATURE_UPDATE.blogLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-background border rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto transform transition-all duration-200 ${
          isAnimating ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {CURRENT_FEATURE_UPDATE.title}
          </h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            aria-label="關閉"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-muted-foreground text-sm mb-4">
            {CURRENT_FEATURE_UPDATE.description}
          </p>
          
          <div className="space-y-3">
            {/* <h3 className="font-medium text-sm">新功能亮點：</h3> */}
            <ul className="space-y-2">
              {CURRENT_FEATURE_UPDATE.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          {CURRENT_FEATURE_UPDATE.blogLink && (
            <Button
              onClick={handleBlogClick}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
            >
              立即啟用
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
          <Button
            onClick={handleClose}
            variant="default"
            className="w-full"
          >
            了解了
          </Button>
        </div>
      </div>
    </div>
  );
}
