"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/landing/Hero"
import FeatureTabs from "@/components/landing/FeatureTabs"
import PricingPlans from "@/components/landing/PricingPlans"
import FeatureOverview from "@/components/landing/FeatureOverview"
import CallToAction from "@/components/landing/CallToAction"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function LandingPage() {
  
  // 控制動畫的 state
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    setIsInView(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
        {/* 頁首區域 */}
        <Header />

        <div className="h-16"></div>

        {/* 首頁 Hero 區塊 */}
        <Hero  />

        {/* 三大核心功能輪播 */}
        <FeatureTabs />

        {/* 功能總覽區塊 */}
        <FeatureOverview />

        {/* 價格方案區塊 */}
        <PricingPlans />
      
        {/* 號召行動區 */}
        <CallToAction />
        {/* 頁尾區域 */}
        <Footer />
    </div>
  )
}