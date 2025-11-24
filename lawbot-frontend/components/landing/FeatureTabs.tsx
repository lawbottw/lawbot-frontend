"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, BookOpen, ChevronLeft, ChevronRight, Clock, CheckCircle, Brain, Sparkles, BarChart3 } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      id: "better-than-gpt",
      title: "讓AI更懂法律",
      icon: <BarChart3 className="h-6 w-6" />, // 換掉 Brain icon
      painPoint: {
        title: "ChatGPT 幻覺問題",
        description: "ChatGPT總是產生幻覺，只會給出錯誤的法條或判決，耗費大量的時間與精力。",
        icon: <BarChart3 className="h-8 w-8 text-red-500" /> // 換掉 Brain icon
      },
      solution: {
        title: "RAG 檢索增強生成技術",
        description: "我們獨家設計的 RAG 技術，大幅降低幻覺，讓用戶能從 2000 萬筆資料中快速定位正確法條與判決，讓AI懂台灣的法律情境。",
        features: [
          "結合 AI 與真實資料庫，回覆有依據",
          "即時定位 2000 萬筆資料，精準可靠",
          "大幅降低錯誤資訊，專業法律工作可放心使用"
        ]
      },
      image: {
        light: "/img/better-than-gpt-light.png",
        dark: "/img/better-than-gpt-dark.png"
      }
    },
    {
      id: "semantic-search",
      title: "語意搜尋",
      icon: <Search className="h-6 w-6" />,
      painPoint: {
        title: "關鍵字匹配局限",
        description: "傳統搜尋引擎依賴精確關鍵字，忽略語意理解，導致大量無關結果和遺漏重要資訊。",
        icon: <Search className="h-8 w-8 text-red-500" />
      },
      solution: {
        title: "AI 語意理解搜尋",
        description: "理解問題背後的意圖，即使用戶使用不同表述，也能找到相關判決。不只看關鍵字，而是理解問題的實質內容。",
        features: [
          "語意相似度分析，找出概念相關的判決",
          "自動擴展同義詞與相關法律概念",
          "智能排序，優先顯示最相關的結果"
        ]
      },
      image: {
        light: "/img/semantic-light.png",
        dark: "/img/semantic-dark.png"
      }
    },
    {
      id: "document-editor",
      title: "書狀撰寫",
      icon: <FileText className="h-6 w-6" />,
      painPoint: {
        title: "文件撰寫耗時",
        description: "從零開始撰寫法律文件耗時費力，格式規範複雜，容易出現錯誤或遺漏重要條款。",
        icon: <Clock className="h-8 w-8 text-red-500" />
      },
      solution: {
        title: "AI 協作編輯助理",
        description: "智能書狀生成與協作編輯，即時重構句子、優化用詞，讓法律書件更具說服力。",
        features: [
          "根據案件類型自動生成標準格式模板",
          "即時語法檢查與用詞優化建議",
          "自動檢查法條引用與格式規範"
        ]
      },
      image: {
        light: "/img/canvas-light.png",
        dark: "/img/canvas-dark.png"
      }
    },
    {
      id: "deep-research",
      title: "深度探索",
      icon: <BookOpen className="h-6 w-6" />,
      painPoint: {
        title: "海量資料難以消化",
        description: "面對爭點龐雜的案件，往往可能需要查找並閱讀上十篇裁判，律師需要花費大量時間閱讀篩選，難以快速掌握爭點發展脈絡。",
        icon: <BookOpen className="h-8 w-8 text-red-500" />
      },
      solution: {
        title: "AI 深度分析報告",
        description: "一次檢索上百篇裁判，針對爭點自動分析並生成研究報告，大幅減少閱讀時間，找出最關鍵資料。",
        features: [
          "批量分析數百篇判決書的共同觀點",
          "自動提取爭點與法院見解",
          "生成結構化研究報告，節省 70% 閱讀時間"
        ]
      },
      image: {
        light: "/img/deepresearch-light.png",
        dark: "/img/deepresearch-dark.png"
      }
    }
  ]

  const nextTab = () => {
    setActiveTab((prev) => (prev + 1) % features.length)
  }

  const prevTab = () => {
    setActiveTab((prev) => (prev - 1 + features.length) % features.length)
  }

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(nextTab, 6000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  const currentFeature = features[activeTab]
  const currentImage = theme === 'dark' ? currentFeature.image.dark : currentFeature.image.light

  return (
    <section className="py-20 bg-secondary dark:bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* 標題區 */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-6">
            重新定義法律工作流程
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            我們不只是解決問題，而是重新定義法律搜尋與文件處理的體驗
          </p>
        </motion.div>

        {/* 功能標籤 */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-muted/50 rounded-lg p-1">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {feature.icon}
                <span className="hidden sm:block font-medium text-base lg:text-lg">{feature.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 內容區 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* 左側內容 */}
            <div className="space-y-8 lg:py-12">
              {/* 痛點 */}
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {currentFeature.painPoint.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {currentFeature.painPoint.title}
                    </h3>
                    <p className="text-muted-foreground text-base lg:text-lg">
                      {currentFeature.painPoint.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 解決方案 */}
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-4 md:mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {currentFeature.solution.title}
                    </h3>
                    <p className="text-muted-foreground text-base lg:text-lg">
                      {currentFeature.solution.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 hidden md:block">
                  {currentFeature.solution.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右側圖片 */}
            <div className="flex-1 hidden md:block">
              <div className="rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-500">
                  <Image
                    src={currentImage}
                    alt={`${currentFeature.title} 功能示意圖`}
                    width={1200}
                    height={1200}
                    className="mx-auto w-full h-auto"
                    priority
                  />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 進度指示器 */}
        <div className="flex justify-center mt-8 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTab === index ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
