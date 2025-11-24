import { Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Scale className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-2xl">Lawbot AI</span>
            </div>
            <p className="mt-2">
              © {new Date().getFullYear()} Lawbot AI. 保留所有權利。
            </p>
          </div>
          
          <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10">
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold ml-2">產品專區</h4>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="ghost">
                  <Link href="/">Lawbot AI</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link 
                    href="https://chrome.google.com/webstore/detail/eibgdjiombogdeajdipafaghflidemka" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Chrome 擴充功能
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link 
                    href="https://edu.lawbot.tw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Lawbot AI 教育版
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link 
                    href="https://easy-law.net" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    律點通
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link 
                    href="https://lawtable.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    法律圓桌
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold ml-2">頁面</h4>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="ghost">
                  <Link href="/about">關於我們</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold ml-2">法律</h4>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="ghost">
                  <Link href="/privacy">隱私政策</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/terms">服務條款</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}