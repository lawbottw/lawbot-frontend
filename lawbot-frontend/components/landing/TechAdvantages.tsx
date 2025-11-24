"use client"

import { motion } from "framer-motion"
import { Brain, Search, Sparkles, Workflow } from "lucide-react";


export default function TechAdvantages() {

  return (
    <section className="py-16">
        <div className="px-8 sm:px-12 mx-auto xl:px-24">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">我們的技術優勢</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            不僅是搜尋引擎，更是您的AI法律助理
            </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            <div className="space-y-6">
                <div className="flex gap-4">
                <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">語意理解搜尋</h3>
                    <p className="text-muted-foreground">
                    不只看關鍵字，而是理解問題的實質內容。例如搜尋「公司負責人責任」時，
                    即使判決書中只提到「董事長義務」，我們的系統也能辨識關聯並納入結果。
                    </p>
                </div>
                </div>
                
                <div className="flex gap-4">
                <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">AI 法律分析</h3>
                    <p className="text-muted-foreground">
                    自動分析判決書與法條之間的關聯性，提取重點論述與適用邏輯，
                    幫助您快速掌握法院見解的發展脈絡。
                    </p>
                </div>
                </div>
                
                <div className="flex gap-4">
                <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                    <Workflow className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">全域 AI 助理</h3>
                    <p className="text-muted-foreground">
                    在任何頁面，按下 <kbd className="px-2 py-1 rounded bg-muted">Ctrl</kbd> + <kbd className="px-2 py-1 rounded bg-muted">L</kbd> 
                    快捷鍵即可喚醒 AI 視窗，進行即時法律資訊查詢與分析，無需中斷工作流程。
                    </p>
                </div>
                </div>
            </div>
            </motion.div>
            
            <motion.div
                className="rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                >
                <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center sm:aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full md:w-4/5 lg:w-[90%] h-auto md:h-3/4 bg-card rounded-lg shadow-lg p-3 md:p-4 lg:p-5 flex flex-col">
                        <div className="flex flex-wrap items-center justify-center mb-2 md:mb-3 space-x-2">
                        <Search className="h-5 w-5 text-primary" />
                        <span className="font-medium">傳統搜尋</span>
                        <span className="text-muted-foreground">vs</span>
                        <Brain className="h-5 w-5 text-primary" />
                        <span className="font-medium">語意搜尋</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded-lg p-2 md:p-3 lg:p-4">
                            <p className="text-sm mb-1 font-medium">搜尋詞: "房屋漏水責任"</p>
                            <ul className="text-xs space-y-1 lg:space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>僅包含精確關鍵詞的結果</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>忽略"滲水"、"水患"等同義詞</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>需多次修改搜尋詞</span>
                            </li>
                            </ul>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 md:p-3 lg:p-4">
                            <p className="text-sm mb-1 font-medium">提問: "房屋漏水責任"</p>
                            <ul className="text-xs space-y-1 lg:space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>理解問題意圖</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>包含語意相關詞彙的判決</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>識別相關法條與案例</span>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </motion.div>

        </div>
        </div>
    </section>
  );
}