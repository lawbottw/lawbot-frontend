import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Brain, 
  Lightbulb, 
  Globe, 
  FileText, 
  NotebookPen,
  Bookmark,
  ChevronRight,
  Zap,
  Target,
  Database,
  ChartBar,
  BookOpen
} from "lucide-react";

// 定義功能鍵的類型
type FeatureKey = "ai-modes" | "advanced-features" | "traditional-tools";

export default function FeatureOverview() {
  const [activeTab, setActiveTab] = useState<FeatureKey>("ai-modes");

  const features = {
    "ai-modes": {
      title: "AI 智能模式",
      description: "多種 AI 模式滿足不同工作需求",
      items: [
        {
          icon: <MessageCircle className="w-6 h-6" />,
          title: "一般問答模式",
          description: "快速查找彙整資料",
          details: "即時問答，快速獲得精準資訊整理",
          color: "bg-blue-500"
        },
        {
          icon: <Lightbulb className="w-6 h-6" />,
          title: "推理模式",
          description: "邏輯分析、精準回答",
          details: "適合文本較長或是複雜的情境分析",
          color: "bg-purple-500"
        },
        {
          icon: <Brain className="w-6 h-6" />,
          title: "深度探索",
          description: "針對法律問題查找大量資料",
          details: "高達100~300篇文件進行深度分析",
          color: "bg-green-500"
        },
        {
          icon: <NotebookPen className="w-6 h-6" />,
          title: "書狀模式",
          description: "自動判斷，AI快速生成草稿",
          details: "智能文檔編輯，AI協作與驗證",
          color: "bg-red-500"
        }
      ]
    },
    "advanced-features": {
      title: "輔助功能",
      description: "專業工具提升工作效率",
      items: [
        {
          icon: <FileText className="w-6 h-6" />,
          title: "附件分析",
          description: "針對您上傳的檔案進行內容問答與生成",
          details: "支援多種格式，智能解析文件內容",
          color: "bg-indigo-500"
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: "網路搜尋",
          description: "補充最新時事或跨領域資料",
          details: "即時獲取最新法規與判例更新",
          color: "bg-emerald-500"
        },
        {
          icon: <ChartBar className="w-6 h-6" />,
          title: "歷審裁判分析",
          description: "一鍵分析歷審裁判",
          details: "歷審裁判一次掌握，全局掌握裁判內容",
          color: "bg-amber-500"
        },
        {
          icon: <BookOpen className="w-6 h-6" />,
          title: "AI摘要",
          description: "高品質AI摘要",
          details: "快速生成精簡摘要，節省閱讀時間",
          color: "bg-orange-500"
        }
      ]
    },
    "traditional-tools": {
      title: "傳統功能",
      description: "完整的法律工作工具套件",
      items: [
        {
          icon: <Bookmark className="w-6 h-6" />,
          title: "螢光筆標記",
          description: "重要內容標記與分類",
          details: "多色標記，便於重點整理",
          color: "bg-yellow-500"
        },
        {
          icon: <Database className="w-6 h-6" />,
          title: "階層式書籤",
          description: "系統化整理重要資料",
          details: "智能分類，快速檢索書籤內容",
          color: "bg-teal-500"
        },
        {
          icon: <Target className="w-6 h-6" />,
          title: "法條實務見解",
          description: "完整的法條與實務整合",
          details: "理論與實務並重，全面理解法條應用",
          color: "bg-pink-500"
        },
        {
          icon: <ChevronRight className="w-6 h-6" />,
          title: "母法找子法",
          description: "完整的法規體系連結",
          details: "快速找到相關法規，建立完整法律架構",
          color: "bg-cyan-500"
        }
      ]
    }
  } as const;

  const tabs: Array<{ id: FeatureKey; label: string; icon: React.ReactNode }> = [
    { id: "ai-modes", label: "AI 智能模式", icon: <Zap className="w-4 h-4" /> },
    { id: "advanced-features", label: "輔助功能", icon: <Target className="w-4 h-4" /> },
    { id: "traditional-tools", label: "傳統功能", icon: <Database className="w-4 h-4" /> }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* 標題區域 */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            功能總覽
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            全方位法律工作解決方案
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            從 AI 智能分析到傳統工具，滿足法律專業人士的各種需求
          </p>
        </div>

        {/* 標籤導航 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 功能內容 */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {features[activeTab].title}
            </h3>
            <p className="text-muted-foreground">
              {features[activeTab].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features[activeTab].items.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-card-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2 font-medium">
                    {feature.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}