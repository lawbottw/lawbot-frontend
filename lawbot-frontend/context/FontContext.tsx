"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';

type FontType = 'sans' | 'serif';

interface FontContextType {
  font: FontType;
  setFont: (font: FontType) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<FontType>('sans');
  const [mounted, setMounted] = useState(false);

  // 初始化時檢查 localStorage 中的字體設定
  useEffect(() => {
    setMounted(true);
    const savedFont = localStorage.getItem('font') as FontType;
    if (savedFont && (savedFont === 'serif' || savedFont === 'sans')) {
      setFont(savedFont);
    }
  }, []);

  // 當字體變更時，更新 localStorage 和 document 的 class
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('font', font);
    
    // 直接修改 document.body 的 className
    const bodyClassList = document.body.classList;
    if (font === 'serif') {
      bodyClassList.add('use-serif');
      bodyClassList.remove('use-sans');
    } else {
      bodyClassList.add('use-sans');
      bodyClassList.remove('use-serif');
    }
  }, [font, mounted]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
