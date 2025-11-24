"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Scale, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* 主要內容區域 */}
      <main className="flex-1">
        {/* 標題區塊 - 增加更生動的背景漸層 */}
        <section className="pt-28 pb-16 md:pb-24 md:pt-32 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                關於我們
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 text-transparent bg-clip-text"
              >
                我們的使命與願景
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl text-muted-foreground"
              >
                重新定義法律知識的可及性，讓每一位法律工作者都能以最高效的方式獲取所需的專業資訊。
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 我們的故事 - 替換為實際圖片 */}
        <section className="py-16 bg-background">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="h-1 bg-primary mb-6"
                />
                <h2 className="text-3xl font-bold mb-6">我們的故事</h2>
                <div className="space-y-4 text-lg">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    在AI大時代，法律資料庫卻仍停留在上世紀的檢索方式。我們深知這種斷層為法律從業者帶來的挫折與時間浪費。
                    
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    於是，一群來自法學與科技領域的專業人士攜手合作，立志打造一套真正理解法律工作者需求的智能系統。我們不僅是開發者，更是這項服務的第一批使用者。
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    每一次迭代、每一項功能的推出，都源自於實際的法律工作場景，我們深知時間對法律專業人士的珍貴，因此致力於用最快速度找到最精準的資料，創造真正有價值、能夠節省時間的解決方案。
                  </motion.p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <motion.div 
                  className="relative aspect-video rounded-xl overflow-hidden shadow-xl"
                  // whileHover={{ scale: 1.02 }}
                  // transition={{ duration: 0.3 }}
                >
                  <Image 
                    src="/img/about.jpg" 
                    alt="我們的故事" 
                    fill 
                    className="object-cover transition-transform duration-700 hover:scale-105" 
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 核心價值 - 增強視覺效果 */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-100/20 dark:from-primary/10 dark:to-blue-900/10">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                價值理念
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 text-transparent bg-clip-text">我們的核心價值</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                這不僅是一個產品，更是我們對法律工作本質的深刻理解與關懷
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Scale className="h-8 w-8 text-primary" />,
                  title: "卓越的專業性",
                  description: "我們深知法律工作的嚴謹本質，系統設計以專業性為基礎，確保每一項資訊都經過嚴格的品質控管。",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "以人為本的設計",
                  description: "技術應該服務人性，而非相反。我們的每一項功能都源自對使用者真實需求的深刻理解。",
                  color: "from-emerald-500 to-teal-600"
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-primary" />,
                  title: "持續的創新精神",
                  description: "法律與科技都在不斷演進，我們承諾將永遠站在創新的前沿，為您提供最先進的法律科技解決方案。",
                  color: "from-amber-500 to-orange-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="bg-background p-8 rounded-xl shadow-lg border border-muted/30"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} inline-flex mb-5 shadow-md`}>
                    <div className="bg-white dark:bg-background rounded-lg p-2">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 我們的旅程 - 視覺優化 */}
        <section className="py-16 bg-background">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                歷程
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 text-transparent bg-clip-text">我們的成長旅程</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                每一步都是為了更接近我們的願景：讓法律知識觸手可及
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  year: "2024.10",
                  title: "萌生創意",
                  description: "面對傳統法律檢索系統的侷限，我們開始構思如何運用最新的人工智能技術改變現狀。",
                  color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                },
                {
                  year: "2025.1",
                  title: "原型開發",
                  description: "組建核心團隊，開發第一版原型系統，並邀請法律工作者參與測試與反饋。",
                  color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                },
                {
                  year: "2025.4",
                  title: "正式發布",
                  description: "基於大量使用者反饋，我們正式推出完整版服務，並持續優化系統效能與用戶體驗。",
                  color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                },
                {
                  year: "未來",
                  title: "持續精進",
                  description: "我們將不斷擴充數據庫範圍，優化 AI 模型，並開發更多符合法律專業需求的功能。",
                  color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="flex mb-12 last:mb-0 relative"
                >
                  {index < 3 && (
                    <motion.div 
                      className="absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-primary/80 to-transparent"
                      initial={{ height: 0 }}
                      whileInView={{ height: "3rem" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    />
                  )}
                  <div className="mr-6">
                    <motion.div 
                      className={`w-20 h-20 rounded-full ${item.color} flex items-center justify-center shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-bold text-lg">{item.year}</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="pt-3 flex-1"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 號召行動 - 增強視覺吸引力 */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-100/20 dark:from-primary/10 dark:to-blue-900/10">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary inline-flex mb-4"
              >
                加入我們
              </motion.div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 text-transparent bg-clip-text">與我們一同前行</h2>
              <p className="text-lg text-muted-foreground mb-8">
                我們相信，真正的法律科技創新需要與使用者共同成長。
                無論您是期待提升工作效率的法律從業人員，還是對法律科技充滿熱情的專業人士，
                我們都誠摯地邀請您加入這場改變法律資訊檢索方式的旅程。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    onClick={() => router.push('/')}
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg"
                  >
                    立即體驗 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open('https://page.line.me/081ddxee', '_blank')}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    聯絡我們
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}