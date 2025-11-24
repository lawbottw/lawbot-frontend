"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter();
  
  return (
    <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
            {/* 左側文字區 */}
            <motion.div 
            className="w-full lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                一站式 AI 法律助理：搜尋、分析到撰寫書狀
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                告別繁雜關鍵字，直接以自然語言提問，讓 AI 自動摘要、分析，草擬書狀，一次到位。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                size="lg" 
                className="gap-2" 
                onClick={() => router.push('/')}
                >
                立即體驗 <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                    const demoSection = document.getElementById('features');
                    demoSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                >
                了解更多
                </Button>
            </div>
            </motion.div>
            
            {/* 右側圖片展示區 */}
            <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            >
            {/* light / dark 模式各自顯示對應圖片 */}
            <Image
                src="/img/hero-light.png"
                alt="Hero Light"
                width={1600}
                height={1600}
                className="mx-auto w-full lg:w-3/4 xl:w-4/5 h-auto rounded-xl shadow-lg dark:hidden hover:scale-105 lg:hover:scale-110 transition-transform duration-500"
            />
            <Image
                src="/img/hero-dark.png"
                alt="Hero Dark"
                width={1600}
                height={1600}
                className="mx-auto w-full lg:w-3/4 xl:w-4/5 h-auto rounded-xl shadow-lg hidden dark:block hover:scale-105 lg:hover:scale-110 transition-transform duration-500"
            />
            </motion.div>
        </div>
        </div>
        
        {/* 背景裝飾 */}
        <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="400" height="400" viewBox="0 0 200 200">
            <path
            fill="currentColor"
            d="M47.1,-57.5C59.9,-47.3,68.4,-32,73.2,-15C78,2,79,20.7,71.1,34.3C63.2,47.9,46.4,56.5,29.7,63.5C12.9,70.5,-3.9,76,-20.9,73.1C-37.9,70.3,-55,59,-65.1,43.1C-75.2,27.3,-78.2,7,-74.1,-11.1C-70,-29.2,-58.8,-45,-44.3,-55.2C-29.8,-65.4,-11.9,-70,4.2,-74.9C20.2,-79.7,34.3,-67.6,47.1,-57.5Z"
            transform="translate(100 100)"
            />
        </svg>
        </div>
    </section>
  );
}