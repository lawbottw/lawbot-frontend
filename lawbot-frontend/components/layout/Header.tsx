"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 處理滾動效果
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "首頁", path: "/landing" },
    { name: "AI問答", path: "/" },
    { name: "法學搜尋", path: "/search" },
    { name: "部落格", path: "/blog" },
    { name: "關於我們", path: "/about" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 px-4 transition-all duration-500 ${scrolled ? "pt-2" : "pt-6 "}`}>
      <motion.div 
        className={`container mx-auto rounded-full shadow-lg max-w-6xl py-4 px-6 bg-white dark:bg-black ${
          scrolled 
            ? "bg-white" 
            : "bg-white/95 dark:bg-black/90 backdrop-blur-sm"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          {/* Logo 區域 */}
          <Button asChild variant="ghost" className="p-0 m-0 h-auto">
            <Link href="/landing" className="flex items-center space-x-2">
              {/* <Scale className="h-6 w-6 text-primary" /> */}
              <span className="font-bold text-xl">Lawbot AI</span>
            </Link>
          </Button>

          {/* 桌面版導航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button asChild key={item.path} variant={isActive(item.path) ? "default" : "ghost"} className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <Link href={item.path}>
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>

          {/* 登入/註冊按鈕 - 桌面版 */}
          <div className="hidden md:flex items-center">
            <Button asChild className="gap-1 rounded-full text-lg group-hover:bg-primary/90">
              <Link href="/login" className="group">
                登入
                <ArrowRight size={24} className="rounded-full transition-transform duration-300 group-hover:-rotate-45" />
              </Link>
            </Button>
          </div>

          {/* 手機版選單按鈕 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="主選單"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.div>

      {/* 手機版選單 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2 container mx-auto max-w-6xl"
          >
            <div className="bg-white dark:bg-black rounded-2xl shadow-lg py-4 px-6 flex flex-col space-y-3">
              {navItems.map((item) => (
                <Button asChild key={item.path} variant={isActive(item.path) ? "default" : "ghost"} className={`px-4 py-3 rounded-lg text-sm font-medium ${isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} onClick={() => setMobileMenuOpen(false)}>
                  <Link href={item.path}>
                    {item.name}
                  </Link>
                </Button>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button asChild variant="outline" size="sm" className="rounded-full w-full">
                  <Link href="/login">
                    登入
                  </Link>
                </Button>
                <Button asChild size="sm" className="gap-1 rounded-full w-full">
                  <Link href="/">
                    立即開始 <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
