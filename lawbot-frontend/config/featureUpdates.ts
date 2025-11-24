export interface FeatureUpdate {
  version: string;
  title: string;
  description: string;
  features: string[];
  date: string;
  blogLink?: string;
  blogTitle?: string;
}

// 每次有新功能時，只需要更新這個配置
export const CURRENT_FEATURE_UPDATE: FeatureUpdate = {
  version: "2025.10.15",   // 更新版本號
  title: "AI代理",
  description: "模擬實際使用情境，自動迭代搜尋詞並分析結果。",
  features: [
    "判斷爭點後自行搜尋、整理資料、變更搜尋詞後持續查找，直到找到符合條件的資料",
    "自動判斷是否需要查找歷審裁判、法條版本等相關資料，提高資料的正確性",
    "自動驗證生成結果並提升品質，減少錯誤資訊。並可於最後生成用戶指定的形式（問答、書狀）",
  ],
  date: "2025年10月",
  // blogLink: "/project",
  // blogTitle: "立即體驗",
};

// LocalStorage 鍵名
export const FEATURE_UPDATE_STORAGE_KEY = "law_app_feature_updates_seen";

// 檢查用戶是否已經看過當前版本的更新
export const hasSeenCurrentUpdate = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  try {
    const seenUpdates = JSON.parse(
      localStorage.getItem(FEATURE_UPDATE_STORAGE_KEY) || '[]'
    ) as string[];
    return seenUpdates.includes(CURRENT_FEATURE_UPDATE.version);
  } catch {
    return false;
  }
};

// 標記當前版本的更新為已看過
export const markUpdateAsSeen = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const seenUpdates = JSON.parse(
      localStorage.getItem(FEATURE_UPDATE_STORAGE_KEY) || '[]'
    ) as string[];
    
    if (!seenUpdates.includes(CURRENT_FEATURE_UPDATE.version)) {
      seenUpdates.push(CURRENT_FEATURE_UPDATE.version);
      localStorage.setItem(FEATURE_UPDATE_STORAGE_KEY, JSON.stringify(seenUpdates));
    }
  } catch (error) {
    console.error('Error saving feature update status:', error);
  }
};

