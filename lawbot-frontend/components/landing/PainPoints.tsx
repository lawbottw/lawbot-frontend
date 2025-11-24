"use client"

import { motion } from "framer-motion"
import { BookOpen, CheckCircle, Clock, Search } from "lucide-react";


export default function PainPoints() {

  return (
        <section className="py-16 bg-muted/30" id="features">
            <div className="container px-4 mx-auto">
            <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">傳統法律搜尋的三大痛點</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                我們不只是解決這些問題，而是重新定義法律搜尋的體驗
                </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                {
                    icon: <Search className="h-10 w-10 text-primary" />,
                    title: "關鍵字匹配局限",
                    description: "傳統搜尋引擎依賴精確關鍵字，忽略語意理解，導致大量無關結果和遺漏重要資訊。",
                    solution: "我們的語意搜尋理解問題背後的意圖，即使用戶使用不同表述，也能找到相關判決。"
                },
                {
                    icon: <Clock className="h-10 w-10 text-primary" />,
                    title: "耗時的結果篩選",
                    description: "律師花費大量的時間在搜尋、閱讀與篩選相關法律文件上，效率極低。",
                    solution: "AI 自動分析並提取核心論點，節省您 70% 的文件閱讀時間，協助找出你需要的那筆資料。"
                },
                {
                    icon: <BookOpen className="h-10 w-10 text-primary" />,
                    title: "複雜專業資訊理解",
                    description: "法律資料有些時候過於冗長，某些跨領域案件特定知識晦澀難懂。",
                    solution: "提供智能摘要與解釋，將複雜法律概念轉化為清晰易懂的說明。"
                }
                ].map((item, index) => (
                <motion.div 
                    key={index} 
                    className="bg-background rounded-xl p-6 shadow-sm"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <div className="border-t pt-4">
                    <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{item.solution}</p>
                    </div>
                    </div>
                </motion.div>
                ))}
            </div>
            </div>
        </section>
  );
}