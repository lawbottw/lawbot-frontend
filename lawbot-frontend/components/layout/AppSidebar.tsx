"use client"

import { cn } from "@/lib/utils"
import { Search, MessageCircle, Loader2, Bot, FolderHeart, FolderClosed } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./NavUser"
import { useEffect, useState } from "react"
import { useDynamicSidebar } from "@/context/DynamicSidebarContext"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChatActions } from "../chat/ChatAction"
import { ChatRecord } from "@/types/chat"
import { useUser } from "@/context/UserContext"
import { SidebarToggler } from "./SidebarToggler"

export function AppSidebar() {
  const pathname = usePathname()
  const [chats, setChats] = useState<ChatRecord[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { setOpenMobile } = useSidebar();

  // 使用 UserContext 統一處理用戶資料邏輯 (包含過期檢查)
  const { userData, plan } = useUser();
  
  const routes = [
    {
      href: "/",
      label: "AI 問答",
      icon: Bot
    },
    {
      href: "/project",
      label: "案件管理",
      icon: FolderClosed,
      isNew: true
    },
    {
      href: "/search",
      label: "精準搜尋",
      icon: Search
    },
    {
      href: '/favorites',
      label: '書籤內容',
      icon: FolderHeart
    }
  ]

  // 準備 NavUser 所需的資料物件
  // 邏輯：如果 Firestore 尚未載入完成，優先顯示 Auth 中的基本資料
  const navUserData = {
    displayName: userData?.displayName || user?.displayName || "",
    email: userData?.email || user?.email || "",
    photoURL: userData?.photoURL || user?.photoURL || "",
    plan: plan // 直接使用 context 處理完畢的 plan
  }

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  // 移除原有的 User Data Fetching useEffect (已轉移至 useUserData)

  // 監聽用戶的聊天紀錄
  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }
    setIsLoading(false);

    // 建立 Firestore 查詢
    const chatsQuery = query(
      collection(db, "legalChats"),
      where("userId", "==", user.uid),
      orderBy("lastUpdated", "desc"),
      limit(5)
    );

    // 使用 onSnapshot 監聽變化
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatData: ChatRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatData.push({
          id: doc.id,
          chatName: data.chatName || (data.messages && data.messages[0] && data.messages[0].content.substring(0, 20) + (data.messages[0].content.length > 10 ? "..." : "")),
          lastUpdated: data.lastUpdated ? data.lastUpdated.toDate() : new Date(),
          messages: data.messages || []
        });
      });
      setChats(chatData);
      setIsLoading(false);
    }, (error) => {
      //console.error("Error fetching chats:", error);
    });

    // 清理 listener
    return () => unsubscribe();
  }, [user]);

    // 處理聊天更新
    const handleChatUpdate = (chatId: string, newName: string) => {
      setChats(prevChats => 
          prevChats.map(chat => 
          chat.id === chatId 
              ? { ...chat, chatName: newName } 
              : chat
          )
      );
    };

    // 處理聊天刪除
    const handleChatDelete = (chatId: string) => {
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    };
  
  // 檢查是否應該顯示聊天紀錄的函數
  const shouldShowChatRecords = () => {
    const allowedPaths = ['/', '/search', '/c', '/favorites', '/project'];
    return !!pathname && (allowedPaths.includes(pathname) || pathname.startsWith('/c/') || pathname.startsWith('/project/'));
  };

  return (
    <Sidebar id="step1" collapsible="icon" className="border-secondary">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarToggler />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 h-full overflow-scroll scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem 
                    className={`flex-1 text-lg rounded-lg justify-center items-center`} 
                    key={item.label}
                  >
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.href} 
                        className={cn(
                          "flex items-center transition-colors duration-200 rounded-lg py-2", 
                          isActive && "bg-primary text-primary-foreground" 
                        )}
                        onClick={() => {
                          setTimeout(() => {
                            setOpenMobile(false);
                          }, 10);
                        }}
                      >
                        <item.icon/>
                        <p className={cn("mb-1 ml-1 text-lg", isActive ? "font-medium" : "")}>
                          {item.label}
                        </p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem 
                className={`flex-1 text-lg rounded-lg justify-center items-center`} 
              >
                <SidebarMenuButton asChild>
                  <Link 
                    href="/c"
                    className={cn(
                      `flex items-center transition-colors duration-200 rounded-lg
                      ${pathname === "/c" && "bg-primary text-primary-foreground"}`
                    )}
                    onClick={() => {
                      setTimeout(() => {
                        setOpenMobile(false);
                      }, 10);
                    }}
                  >
                    <MessageCircle/>
                    <p className={cn("mb-1 ml-1 text-lg", pathname === "/c" ? "font-medium" : "")}>
                      聊天紀錄
                    </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {shouldShowChatRecords() && user && chats.map((chat) => {
                const isActive = pathname === `/c/${chat.id}`;
                
                return (
                  <SidebarMenuItem key={chat.id}>
                    <div className={cn(
                      "flex items-center justify-between ml-6 px-4 mr-2 rounded-md hover:bg-muted/50 hover:text-foreground group",
                      isActive && "bg-primary text-primary-foreground"
                    )}>
                      <Link 
                        href={`/c/${chat.id}`}
                        className="flex-1 truncate text-sm"
                        onClick={() => {
                          setTimeout(() => {
                            setOpenMobile(false);
                          }, 10);
                        }}
                      >
                        {chat.chatName || "無標題對話"}
                      </Link>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChatActions 
                          chatId={chat.id}
                          chatName={chat.chatName || "無標題對話"}
                          onUpdate={handleChatUpdate}
                          onDelete={handleChatDelete}
                          projectId={chat.projectId}
                          redirectAfterDelete={true}
                        />
                      </div>
                    </div>
                  </SidebarMenuItem>
                );
              })}

              {shouldShowChatRecords() && isLoading && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* 動態內容區塊 */}
        <DynamicSidebarContent />
      </SidebarContent>
      <SidebarFooter>
        {!user ? (
          <Link 
            href={`/login?from=${encodeURIComponent(pathname || "")}`}
            className="flex items-center text-center text-lg px-4 py-1 mx-4 my-2 rounded-lg bg-background hover:bg-primary/10 transition-colors duration-200 border border-muted-foreground/20"
            onClick={() => {
              setTimeout(() => {
                setOpenMobile(false);
              }, 10);
            }}
          >
            <p className="text-center mx-auto font-medium">登入</p>
          </Link>
        ) : (
          <NavUser user={navUserData} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function DynamicSidebarContent() {
  const { dynamicContent } = useDynamicSidebar();
  return (
    <div className="p-4 pt-2">
      {dynamicContent ? dynamicContent : <></>}
    </div>
  );
}