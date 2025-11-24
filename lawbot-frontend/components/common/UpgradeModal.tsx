import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Mode = "think" | "files" | "web" | "verify" | "project" | "agent";

interface ModeConfig {
  title: string;
  headline: string;
  features: string[];
  cta: string;
}

const modeConfigs: Record<Mode, ModeConfig> = {
  think: {
    title: "推理模式",
    headline: "讓 AI 幫你快速推理、整理爭點，節省大量找資料的時間！",
    features: [
      "一鍵找出最重要的判決與法條",
      "自動整理複雜案件重點",
      "多輪問答、合約審閱超高效率",
    ],
    cta: "進階會員專屬，立即解鎖專業 AI 助理",
  },
  web: {
    title: "網路搜尋",
    headline: "即時搜尋最新法律新聞與專欄文章，資訊永遠跟上時代脈動！",
    features: [
      "搜尋最新修法動態與重要判決",
      "獲取即時法律新聞與實務見解",
      "補強資料庫未收錄的最新資訊",
      "結合 AI 分析，提供更完整答案",
    ],
    cta: "進階會員專屬，掌握最新法律脈動",
  },
  verify: {
    title: "驗證功能",
    headline: "AI 智能驗證文件內容，確保法律論述準確無誤！",
    features: [
      "智能檢核法條引用正確性",
      "驗證判決書引述準確度",
      "分析論證邏輯完整性",
      "提供專業修正建議",
    ],
    cta: "Pro 會員專屬，專業驗證服務",
  },
  project: {
    title: "案件管理",
    headline: "高效管理您的所有案件，清楚呈現對話與背景資料",
    features: [
      "建立、分類和管理每個案件",
      "處理大量附件和共享背景資訊",
    ],
    cta: "Lite 會員以上專屬，立即升級，讓AI為您處理案件",
  },
  agent: {
    title: "AI代理",
    headline: "智能AI代理功能，讓AI幫你工作！",
    features: [
      "智能多輪搜尋",
      "自主驗證檢核",
      "自動優化品質",
    ],
    cta: "Pro 會員專屬，體驗全方位AI助理",
  },
  files: {
    title: "附件功能",
    headline: "上傳文件讓 AI 幫您閱讀，專業見解一次到位！",
    features: [
      "支援 PDF 等多種格式",
      "AI 智能解讀合約、判決書、文檔內容",
      "快速提取關鍵資訊",
      "搭配法條查詢，分析更精準",
    ],
    cta: "進階會員專屬，解鎖文件智能分析",
  },
};

interface UpgradeModalProps {
  open: boolean;
  mode: Mode | null;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ open, mode, onClose, onUpgrade }: UpgradeModalProps) {
  if (!mode) return null;

  const config = modeConfigs[mode];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <p>{config.title}</p>
          </DialogTitle>
        </DialogHeader>
        <div className="py-1">
          <div className="text-lg font-bold text-primary mb-2">
            {config.headline}
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            {config.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <div className="mt-4 font-medium">
            {config.cta}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 mt-2">
          <Button variant="default" size="lg" onClick={onUpgrade} className="w-full font-bold text-base py-2">
            立即升級，節省寶貴時間
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}