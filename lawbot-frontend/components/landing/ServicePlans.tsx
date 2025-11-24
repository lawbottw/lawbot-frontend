"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Star, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


export default function ServicePlans() {
  const router = useRouter();

  return (
    <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">選擇最適合您的方案</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            無論您是初階律師還是資深法學專家，我們都有適合您的解決方案
            </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
            className="bg-background rounded-xl p-8 shadow-sm border-2 border-transparent relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            >
            <div className="absolute -right-12 -top-12 bg-muted/30 rounded-full w-40 h-40"></div>
            
            <div className="relative">
                <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-2xl font-bold">Flash 模式</h3>
                </div>
                
                <p className="text-muted-foreground mb-6">適合日常快速查詢與基礎法律資訊獲取</p>
                
                <ul className="space-y-3 mb-8">
                {[
                    "快速回答基本法律問題",
                    "提供相關法條與判決摘要",
                    "基礎法律概念解釋",
                    "引導式問答協助",
                    "搜尋結果優先展示"
                ].map((item, index) => (
                    <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                    </li>
                ))}
                </ul>
                
                <Button className="w-full" variant="outline" onClick={() => router.push('/')}>
                立即體驗 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            </motion.div>
            
            <motion.div 
            className="bg-background rounded-xl p-8 shadow-lg border-2 border-primary relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
            <div className="absolute -right-12 -top-12 bg-primary/10 rounded-full w-40 h-40"></div>
            <div className="absolute top-4 right-4 bg-primary text-white text-xs py-1 px-3 rounded-full">
                推薦
            </div>
            
            <div className="relative">
                <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-2xl font-bold">Pro 模式</h3>
                </div>
                
                <p className="text-muted-foreground mb-6">適合深度法律研究與複雜案件分析</p>
                
                <ul className="space-y-3 mb-8">
                {[
                    "Flash 模式的所有功能",
                    "深度法律分析與論證",
                    "跨案例比較與趨勢分析",
                    "多維度法律風險評估",
                    "專業法律文件草擬建議",
                    "優先支援與客製化功能"
                ].map((item, index) => (
                    <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                    </li>
                ))}
                </ul>
                
                <Button className="w-full" onClick={() => router.push('/')}>
                升級至 Pro <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            </motion.div>
        </div>
        </div>
    </section>
  );
}