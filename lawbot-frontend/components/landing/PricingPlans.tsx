"use client"

import { motion } from "framer-motion"
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, CheckCircle, Star, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { pricingPlans } from "@/data/pricingData";

interface PricingPlansProps {
  context?: "landing" | "billing";
  currentPlan?: string | null;
}

export default function PricingPlans({ context = "landing", currentPlan = null }: PricingPlansProps) {
  const router = useRouter();
  const [isYearlyBilling, setIsYearlyBilling] = useState(true);

  return (
    <section className="">
        <div className="container px-4 mx-auto">
            <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >

            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">實惠的價格方案</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  選擇最適合您需求與預算的訂閱方案
              </p>
              {context === "landing" && (
                <div className="bg-primary/10 rounded-lg p-4 mb-8 max-w-3xl mx-auto border border-primary/30">
                    <p className="text-lg font-medium text-primary mb-3">免費試用開放中</p>
                    <Link 
                        href="/billing" 
                        className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 
                                px-4 py-2 rounded-md font-medium text-sm transition-colors 
                                duration-200 shadow-sm hover:shadow-md"
                    >
                        立即免費試用14天，體驗完整功能
                    </Link>
                </div>
              )}
            </>

            {/* special event part */}
            {/* <div className="bg-gradient-to-r from-yellow-50 to-white rounded-xl p-6 mb-12 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="justify-between items-center">
                  <div className="mb-4">
                    <h3 className="flex justify-center mb-2 items-center text-yellow-800">
                      🎉 歡慶律師節，限時限量優惠（只到10/31）
                    </h3>
                  </div>
                </div>
                
                <div className="mt-4 text-black/90">
                  <p className="text-lg list-decimal list-inside space-y-1 ml-2">
                    前往<Link href="https://www.instagram.com/p/DOVujaFk7-e/" target="_blank" className="underline-offset-3 underline mx-1 font-bold text-lg">IG</Link>、
                      <Link href="https://www.facebook.com/share/p/1DRVYwqTHg/" target="_blank" className="underline-offset-3 underline mx-1 font-bold text-lg">FB</Link>、
                      <Link href="https://www.threads.com/@lawbot_tw/post/DOVV_ypk-lz/" target="_blank" className="underline-offset-3 underline mx-1 font-bold text-lg">Threads</Link>
                      ，在任一平台轉發（或標注Lawbot AI）並分享使用心得，即可享有年費優惠 Lite <span className="font-bold text-2xl">$4,800</span>（原價5760）或 Pro <span className="font-bold text-2xl">$10,000</span>（原價12000）
                  </p>
                </div>
              </div>
                  <div className="mt-6 flex-shrink-0">
                    <Button 
                      size="lg"
                      className="text-white bg-yellow-700 hover:bg-yellow-800"
                      onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSeFn0yNUryqM58979oNr0aXt8pCEDvU_QV7Z_pAfeKH4xqkdA/viewform", "_blank")}
                    >
                      立即參加活動
                    </Button>
                  </div>
            </div> */}
            
            {/* 年/月切換 */}
            <div className={`flex items-center justify-center ${context === 'billing' ? 'mb-8' : 'mb-8'}`}>
                <div className="bg-muted rounded-full p-1 flex">
                <Button 
                    variant="ghost"
                    className={`rounded-full px-6 py-1.5 ${isYearlyBilling ? 'bg-background shadow-sm' : ''}`}
                    onClick={() => setIsYearlyBilling(true)}
                >
                    年付
                    {isYearlyBilling && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">省最多</span>}
                </Button>
                <Button 
                    variant="ghost"
                    className={`rounded-full px-6 py-1.5 ${!isYearlyBilling ? 'bg-background shadow-sm' : ''}`}
                    onClick={() => setIsYearlyBilling(false)}
                >
                    月付
                </Button>
                </div>
            </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
            {Object.entries(pricingPlans).map(([key, plan]) => {
              const isCurrentPlan = currentPlan === plan.name;
              const planPrice = plan[isYearlyBilling ? 'yearly' : 'monthly'];
              const isEnterprise = key === 'enterprise';
              
              return (
                <motion.div
                  key={key}
                  className={`bg-background rounded-xl p-8 shadow-sm border relative overflow-hidden ${
                    isCurrentPlan && context === "billing" 
                      ? "border-2 border-green-500 shadow-lg" 
                      : key === 'pro' && context === "landing"
                      ? "border-2 border-primary shadow-lg"
                      : "border-muted"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Object.keys(pricingPlans).indexOf(key) * 0.1 }}
                >
                  {isCurrentPlan && context === "billing" && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs py-1 px-3 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" /> 目前方案
                    </div>
                  )}
                  
                  {key === 'pro' && context === "landing" && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs py-1 px-3 rounded-full">
                      熱門方案
                    </div>
                  )}
                  
                  <div className="absolute -right-12 -top-12 bg-muted/30 rounded-full w-40 h-40"></div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    {isEnterprise ? (
                      <>
                        <span className="text-3xl font-bold">客製化</span>
                        <p className="text-xs text-muted-foreground mt-2">為您的團隊量身打造</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-4xl font-bold whitespace-nowrap">
                            NT$ {planPrice.price.toLocaleString()}
                            <span className="text-muted-foreground text-2xl ml-1 whitespace-nowrap">/ {isYearlyBilling ? '年' : '月'}</span>
                          </span>

                          {/* an info to shows that this special price needs to finish the upper tasks */}
                          {/* {isYearlyBilling && !isEnterprise && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground cursor-pointer mt-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>參加上方活動可享額外限時優惠價</p>
                              </TooltipContent>
                            </Tooltip>
                          )} */}
                        </div>
                        {planPrice.originalPrice && !isEnterprise && (
                          <div className="mt-1 text-base">
                            <span className="text-2xl line-through text-muted-foreground">原價NT$ {planPrice.originalPrice.toLocaleString()}</span>
                            <p className="text-sm text-muted-foreground mt-2">
                              {isYearlyBilling 
                                ? `相當於每月 NT$ ${Math.round(planPrice.price / 12)}元`
                                : `約每日 NT${Math.round(planPrice.price / 30)} 元起`
                              }
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1.5 flex-shrink-0" />
                        <span>{feature.text}</span>
                        {feature.tooltip && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground mt-1.5 cursor-pointer ml-1" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {feature.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  {context === "billing" ? (
                    isCurrentPlan ? (
                      <Button variant="ghost" className="w-full" disabled>
                        {isEnterprise ? "目前方案 (客製)" : "目前方案"}
                      </Button>
                    ) : isEnterprise ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open("https://page.line.me/081ddxee", "_blank")}
                      >
                        洽詢 Enterprise
                      </Button>
                    ) : (
                      <Button
                        variant={key === 'pro' ? "default" : "outline"}
                        className="w-full"
                        onClick={() => {
                          if (currentPlan === "pro" && key === 'lite') {
                            window.open("https://page.line.me/081ddxee", "_blank");
                          } else {
                            router.push(`/payment?plan=${key}`);
                          }
                        }}
                      >
                        {currentPlan === "pro" && key === 'lite' 
                          ? "降級至 Lite" 
                          : `升級至 ${plan.name.replace(' 方案', '')}`
                        }
                      </Button>
                    )
                  ) : (
                    <Button
                      variant={isEnterprise ? "outline" : key === 'pro' ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        if (isEnterprise) {
                          window.open("https://page.line.me/081ddxee", "_blank");
                        } else {
                          // 傳遞方案到 payment 頁面
                          router.push(`/payment?plan=${key}`);
                        }
                      }}
                    >
                      {isEnterprise ? "聯絡銷售" : `選擇 ${plan.name}`}
                    </Button>
                  )}
                </motion.div>
              );
            })}
            </div>

            <div className="max-w-4xl mx-auto py-12 px-5 md:px-10 overflow-x-auto">
                <h3 className="text-center mb-4">點數換算表</h3>
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-muted-foreground">模式</th>
                        <th className="px-4 py-2 border-b text-muted-foreground">Lite 方案({pricingPlans.lite.pointsTotal}點)</th>
                        <th className="px-4 py-2 border-b text-muted-foreground">Pro 方案({pricingPlans.pro.pointsTotal}點)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="bg-background">
                        <td className="px-4 py-2 border-b">一般模式</td>
                        <td className="px-4 py-2 border-b">{pricingPlans.lite.pointsBreakdown.general}</td>
                        <td className="px-4 py-2 border-b">{pricingPlans.pro.pointsBreakdown.general}</td>
                    </tr>
                    <tr className="bg-muted/10">
                        <td className="px-4 py-2 border-b">推理模式</td>
                        <td className="px-4 py-2 border-b">{pricingPlans.lite.pointsBreakdown.reasoning}</td>
                        <td className="px-4 py-2 border-b">{pricingPlans.pro.pointsBreakdown.reasoning}</td>
                    </tr>
                    <tr className="bg-background">
                        <td className="px-4 py-2">深度探索</td>
                        <td className="px-4 py-2">{pricingPlans.lite.pointsBreakdown.deepExploration}</td>
                        <td className="px-4 py-2">{pricingPlans.pro.pointsBreakdown.deepExploration}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-center mb-6">
                {/* <p className="text-sm text-muted-foreground mt-1 mb-2">最終優惠只到5/31</p> */}
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    所有方案均含 7 天試用期，不滿意可全額退款。價格均已含稅，會開立發票。
                </p>
            </div>

            {context === "landing" ? (
                <Button 
                    size="lg"
                    variant="secondary"
                    onClick={() => window.open("https://page.line.me/081ddxee", "_blank")}
                    className="flex items-center justify-center mx-auto my-6 text-lg"
                >
                    我想使用銀行轉帳付款
                </Button>
            ) : (
                <div className='my-12'>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">銀行轉帳</h2>
                    <p className="text-muted-foreground text-center mb-4">
                    我們也提供銀行轉帳方式進行付款
                    </p>
                    <div className="space-y-6">
                        <div className="p-4 border rounded-lg bg-muted/30">
                        <p><strong>銀行名稱：</strong> 永豐銀行</p>
                        <p><strong>分行名稱：</strong> 竹北光明分行</p>
                        <p><strong>帳戶號碼：</strong> (807) 19301800188478</p>
                        <p><strong>戶名：</strong> 遠律科技有限公司</p>
                        <p><strong>統一編號：</strong> 93691731</p>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-800">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-2 mt-1.5 flex-shrink-0 text-yellow-600" />
                            <div>
                            <h4 className="font-semibold">重要提醒：</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                                <li>轉帳後，請務必將帳戶末5碼及欲註冊之email發送至我們的客服 LINE (ID: <Link href="https://page.line.me/081ddxee" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">@081ddxee</Link>) 或 Email (<a href="mailto:lawbottw@gmail.com" className="underline hover:text-yellow-900">lawbottw@gmail.com</a>)。</li>
                                <li>我們會在1~2個工作日確認款項後為您啟用或延長您的訂閱。</li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )
        }
        </div>
    </section>
  );
}