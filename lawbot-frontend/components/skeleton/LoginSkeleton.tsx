import { Skeleton } from "@/components/ui/skeleton"

export default function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden mx-4">
        {/* 左側資訊面板 Skeleton */}
        <div className="hidden md:flex flex-col bg-gradient-to-br from-blue-500/70 to-indigo-600/70 p-10 md:w-1/2 justify-center relative overflow-hidden">
          <div className="relative z-10">
            {/* 標題 Skeleton */}
            <Skeleton className="h-10 w-3/4 bg-white/20 mb-6" />
            
            {/* 段落 Skeleton */}
            <Skeleton className="h-4 w-full bg-white/20 mb-2" />
            <Skeleton className="h-4 w-5/6 bg-white/20 mb-8" />
            
            {/* 功能點 Skeleton */}
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-9 w-9 rounded-full bg-white/20 mr-3" />
                  <Skeleton className="h-4 w-3/4 bg-white/20" />
                </div>
              ))}
            </div>
          </div>
          
          {/* 背景裝飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-10"></div>
        </div>
        
        {/* 右側登入區 Skeleton */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center items-center md:w-1/2">
          <div className="w-full max-w-md">
            {/* Logo Skeleton */}
            <div className="mb-6 flex justify-center">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            
            {/* Auth Component Skeleton */}
            <div className="w-full flex flex-col items-center">
              {/* Heading Skeleton */}
              <Skeleton className="h-8 w-3/4 mb-2 mx-auto" />
              <Skeleton className="h-4 w-5/6 mb-8 mx-auto" />
              
              {/* Google Sign In Button Skeleton */}
              <Skeleton className="h-10 w-56 rounded-3xl mx-auto mb-6" />
              
              {/* Divider Skeleton */}
              <div className="relative w-full my-4">
                <Skeleton className="h-px w-full mb-4" />
              </div>
              
              {/* Contact Button Skeleton */}
              <Skeleton className="h-10 w-full rounded-lg mt-4" />
              
              {/* Footer Text Skeleton */}
              <Skeleton className="h-3 w-4/5 mt-8 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}