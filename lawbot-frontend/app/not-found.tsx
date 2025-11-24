"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    if (countdown <= 0) {
      clearInterval(timer);
      router.push("/");
    }
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full lg:max-w-3xl mx-auto mb-8">
            {/* <DotLottieReact
            src="/animations/not-found.lottie"
            loop
            autoplay
            /> */}
        </div>
        <h1 className="text-3xl font-bold mb-4">頁面不存在</h1>
        <p className="text-lg mb-6">
            將在 {countdown} 秒後自動返回主頁
        </p>
        <Link 
            href="/"
            className="px-4 py-2 mb-12 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">
            返回主頁
        </Link>
    </div>
  );
}