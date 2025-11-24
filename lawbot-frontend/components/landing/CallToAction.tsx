"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="py-20 relative overflow-hidden">
        <motion.div 
        className="absolute inset-0 -z-10 opacity-10"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M47.1,-57.5C59.9,-47.3,68.4,-32,73.2,-15C78,2,79,20.7,71.1,34.3C63.2,47.9,46.4,56.5,29.7,63.5C12.9,70.5,-3.9,76,-20.9,73.1C-37.9,70.3,-55,59,-65.1,43.1C-75.2,27.3,-78.2,7,-74.1,-11.1C-70,-29.2,-58.8,-45,-44.3,-55.2C-29.8,-65.4,-11.9,-70,4.2,-74.9C20.2,-79.7,34.3,-67.6,47.1,-57.5Z" transform="translate(100 100)" />
        </svg>
        </motion.div>
        
        <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            法律科技的起點
            </motion.h2>
            
            <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            >
            邀您加入新一代的法律科技革命，體驗 AI 如何徹底改變您的法律工作流程。
            </motion.p>
            
            <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            >
            <Button 
                size="lg" 
                className="gap-2" 
                onClick={() => router.push('/')}
            >
                立即開始 <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://page.line.me/081ddxee', '_blank')}
            >
                聯絡我們
            </Button>
            </motion.div>
        </div>
        </div>
    </section>
  );
}