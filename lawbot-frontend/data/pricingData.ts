export interface PricingPlan {
  name: string;
  description: string;
  monthly: { price: number; originalPrice?: number };
  yearly: { price: number; originalPrice?: number };
  features: Array<{
    text: string;
    tooltip?: string;
  }>;
  pointsTotal: number;
  pointsBreakdown: {
    general: string;
    reasoning: string;
    deepExploration: string;
  };
}

export const pricingPlans = {
  lite: {
    name: 'Lite 方案',
    description: '適合個人輕度使用',
    monthly: { price: 480, originalPrice: undefined },
    yearly: { price: 5200, originalPrice: 5760 },
    features: [
      { 
        text: '每月總計1000點數',
        tooltip: '用於一般問答、書狀、推理、深度探索、摘要、案件模式等AI功能'
      },
      { text: '關鍵字搜尋、語意搜尋無限量使用' },
      { text: '相關法條、歷審裁判分析、母法找子法、螢光筆、書籤' }
    ],
    pointsTotal: 1000,
    pointsBreakdown: {
      general: '800 ~ 1200',
      reasoning: '400 ~ 500',
      deepExploration: '50'
    }
  } as PricingPlan,
  pro: {
    name: 'Pro 方案',
    description: '適合專業法律工作者或律所使用',
    monthly: { price: 1000, originalPrice: undefined },
    yearly: { price: 10800, originalPrice: 12000 },
    features: [
      { 
        text: '每月總計3000點數',
        tooltip: '用於一般問答、書狀、推理、深度探索、摘要、案件模式等AI功能'
      },
      { 
        text: '更強大的檢索能力',
        tooltip: 'AI問答加強 50% 的檢索力度'
      },
      { text: '更強大的AI模型' },
      { text: '高級功能優先體驗' }
    ],
    pointsTotal: 3000,
    pointsBreakdown: {
      general: '2400 ~ 3600',
      reasoning: '1200 ~ 1500',
      deepExploration: '150'
    }
  } as PricingPlan,
  enterprise: {
    name: 'Enterprise 方案',
    description: '適合團隊與機構客製化使用',
    monthly: { price: 0, originalPrice: undefined }, // Custom pricing
    yearly: { price: 0, originalPrice: undefined }, // Custom pricing
    features: [
      { text: '打造專屬資料庫RAG系統' },
      { text: '架設本地端自有AI模型' },
      { text: '文檔數位化OCR' },
      { text: 'API 串接與AI智慧客服' }
    ],
    pointsTotal: 0, // Custom
    pointsBreakdown: {
      general: '客製化',
      reasoning: '客製化',
      deepExploration: '客製化'
    }
  } as PricingPlan
};

export type PlanType = keyof typeof pricingPlans;
