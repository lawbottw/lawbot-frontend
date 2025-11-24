"use client"

import { Presentation, ChevronsUpDown, CreditCard, LogOut,
  Sparkles, Moon, Sun, Monitor, Type } from "lucide-react"
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "next-themes"
import { useFont } from "@/context/FontContext"
import { useNextStep } from 'nextstepjs';

interface NavUserProps {
  email: string | null;
  photoURL: string | null; // Changed from avatar to photoURL to match usage
  displayName: string | null;
  plan: "free" | "lite" | "pro" | string;
}

export function NavUser({
  user,
}: {
  user: NavUserProps;
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // 新增取得當前路由
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()
  const { startNextStep } = useNextStep();

  const handleLogout = () => {
    try {
      logout();
      // router.push("/login");
    } catch (err) {
      setError("登出失敗，請稍後再試");
    }
  };

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="mr-2 h-5 w-5" />;
      case "dark":
        return <Moon className="mr-2 h-5 w-5" />;
      case "system":
        return <Monitor className="mr-2 h-5 w-5" />;
      default:
        return <Sun className="mr-2 h-5 w-5" />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case "light":
        return "切換為深色模式";
      case "dark":
        return "切換為系統模式";
      case "system":
        return "切換為淺色模式";
      default:
        return "切換為深色模式";
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-accent"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                  {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div 
                  className="flex-1 flex items-center cursor-pointer"
                  onClick={() => {
                    router.push("/billing");
                  }}
                >
                  <Sparkles size="20" className="mr-2" />
                  {user.plan === "free" ? "升級方案" : user.plan}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div
                  className="flex-1 flex items-center cursor-pointer"
                  onClick={() => {
                    router.push("/billing");
                  }}
                >
                  <CreditCard size="20" className="mr-2"/>
                  帳單
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={cycleTheme} className="cursor-pointer">
                {getThemeIcon()}
                {getThemeText()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFont(font === "serif" ? "sans" : "serif")} className="cursor-pointer">
                <Type className="mr-2 h-5 w-5" />
                {font === "serif" ? "切換為黑體" : "切換為宋體"}
              </DropdownMenuItem>
              {pathname === "/" && ( // 僅在首頁顯示使用教學
                <DropdownMenuItem onClick={() => startNextStep('mainTour')} className="cursor-pointer">
                  <Presentation className="mr-2 h-5 w-5" />
                  使用教學
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut/>
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
