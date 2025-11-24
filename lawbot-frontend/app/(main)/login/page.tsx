'use client'

import AuthComponent from '@/components/auth/AuthComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import LoginSkeleton from "@/components/skeleton/LoginSkeleton"
import { useAuth } from "@/context/AuthContext"
import { PartyPopper, BadgeCheck, Clock, ArrowRight } from "lucide-react"

function LoginContent() {
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get('from') || '/'
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const [userTypeChecked, setUserTypeChecked] = useState(false)
  const [showFreeTrial, setShowFreeTrial] = useState(false)
  const isNewUserRef = useRef(false)
  const prevUserRef = useRef<typeof user>(user)
  const initialAuthResolved = useRef(false)

  // GoogleSignIn 內 onNewUser 呼叫
  const handleNewUser = () => {
    isNewUserRef.current = true
    setShowFreeTrial(true)
    setUserTypeChecked(true)
  }

  const handleExistingUser = () => {
    isNewUserRef.current = false
    setUserTypeChecked(true)
  }

  const handleTryNow = () => {
    router.replace('/billing')
  }
  
  const handleSkip = () => {
    isNewUserRef.current = false
    router.replace(redirectPath)
  }

  // 處理：用戶剛透過此頁面登入
  useEffect(() => {
    // 只有在 userTypeChecked 後（也就是新舊戶檢查完畢）才執行
    if (authLoading || !userTypeChecked) return

    // prevUserRef 確保這只在從 null -> user 的轉換時觸發一次
    if (prevUserRef.current === null && user) {
      if (isNewUserRef.current) {
        setShowFreeTrial(true)
      } else {
        router.replace(redirectPath)
      }
    }

    prevUserRef.current = user
  }, [authLoading, user, redirectPath, router, userTypeChecked])

  // 處理：用戶在進入此頁面時就已經是登入狀態
  useEffect(() => {
    // 確保只在首次 auth 狀態解析完畢後執行一次
    if (!authLoading && !initialAuthResolved.current) {
      initialAuthResolved.current = true;
      // 如果用戶存在，代表是「已登入」狀態，直接導向
      if (user) {
        router.replace(redirectPath);
      }
    }
  }, [authLoading, user, redirectPath, router]);

  // 如果正在載入認證狀態，顯示載入畫面
  if (authLoading) {
    return <LoginSkeleton />
  }

  // 如果用戶已登入且要顯示免費試用
  if (user && showFreeTrial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 mx-4 relative overflow-hidden">
          {/* 彩帶裝飾 */}
          <div className="absolute -top-8 -right-8 opacity-30">
            <PartyPopper size={96} strokeWidth={1.5} className="text-indigo-300" />
          </div>
          <div className="absolute -bottom-8 -left-8 opacity-20">
            <PartyPopper size={72} strokeWidth={1.5} className="text-purple-200" />
          </div>
          <div className="text-center mb-8">
            <Image 
              src="/img/logo.png" 
              alt="法律智能助手" 
              width={72} 
              height={72} 
              className="h-16 w-auto mx-auto mb-4 drop-shadow-lg"
            />
            <div className="flex justify-center items-center gap-2 mb-2">
              <BadgeCheck className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">歡迎加入！</h2>
            </div>
            <div className="flex justify-center items-center gap-2 mb-3">
              <Clock className="text-indigo-500" size={22} />
              <h3 className="text-lg font-semibold text-indigo-600">免綁卡免費試用 <span className="font-bold">14 天</span>(到期後會自動取消訂閱!)</h3>
            </div>
            <p className="text-gray-600 mb-6">
              恭喜成為新用戶！即刻啟用免費升級，體驗完整進階功能。
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleTryNow}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-lg"
            >
              <PartyPopper size={20} className="inline-block" />
              立即啟用免費試用
              <ArrowRight size={20} className="inline-block" />
            </button>
            <button
              onClick={handleSkip}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              先不用，直接開始使用
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 如果用戶已登入且不需要顯示免費試用，直接導向
  if (user && !showFreeTrial) {
    return null
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden mx-4">
        {/* 左側資訊面板 */}
        <div className="hidden md:flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 md:w-1/2 justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-6">法律智能助手</h1>
            <p className="text-lg mb-8 opacity-90">
              專業法律顧問隨時待命，解答您的各種法律疑問，提供精準的法律見解
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>快速解答您的法律問題</p>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>專業分析與建議</p>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>安全可靠的資訊保護</p>
              </div>
            </div>
          </div>
          {/* 背景裝飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-10"></div>
        </div>
        
        {/* 右側登入區 */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center items-center md:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center">
              <Image 
                src="/img/logo.png" 
                alt="法律智能助手" 
                width={80} 
                height={80} 
                className="h-16 w-auto"
              />
            </div>
            <AuthComponent redirectPath={redirectPath} onNewUser={handleNewUser} onOldUser={handleExistingUser} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}
