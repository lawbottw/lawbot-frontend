"use client"

import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function SidebarToggler() {
  return (
    <div className="flex items-center group-data-[state=collapsed]:justify-center">
      <Link 
      href="/landing"
      className="flex items-center">
        <Image
          src="/img/logo.png"
          alt="Logo"
          width={52}
          height={52}
          className="rounded-lg group-data-[state=collapsed]:hidden dark:invert w-10 h-10"
        />
      </Link>
      <SidebarTrigger className="ml-auto" />
    </div>
  )
}