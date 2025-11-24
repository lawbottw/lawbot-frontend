import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { ThemeProvider } from "@/context/provider/ThemeProvider";
import { Toaster } from "sonner";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: '--font-noto-sans-tc',
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: '--font-noto-serif-tc',
});

// 定義網站的基本 metadata
export const metadata = {
  metadataBase: new URL('https://www.lawbot.tw'),
  title: {
    default: 'AI 法律問答與書狀撰寫 | Lawbot AI',
    template: '%s | Lawbot AI'
  },
  description: 'Lawbot AI 是一款結合 AI 技術的全方位法學資料搜尋與法律文件處理平台，專為律師與法律工作者設計。快速檢索法條、判決與法律見解，Lawbot AI 更支援 AI寫訴狀 與法律文件的生成與編輯，大幅提升法律研究與實務作業的效率與生產力。Lawbot AI 將搜尋、編輯與內容理解整合為一體，是現代法律工作不可或缺的一站式智能助理。',
  keywords: ['法律搜尋', '判決檢索', '智能法律助手', '法律AI問答', '法律 AI', '法律AI GPT', 'ai law bot', '訴狀'],
  authors: [{ name: 'Lawbot AI' }],
  creator: 'Lawbot',
  publisher: 'Lawbot',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.lawbot.tw',
    siteName: 'Lawbot AI',
    title: 'AI 法律問答與書狀撰寫 | Lawbot AI',
    description: 'Lawbot AI 是一款結合 AI 技術的全方位法學資料搜尋與法律文件處理平台，專為律師與法律工作者設計。快速檢索法條、判決與法律見解，Lawbot AI 更支援 AI寫訴狀 與法律文件的生成與編輯，大幅提升法律研究與實務作業的效率與生產力。Lawbot AI 將搜尋、編輯與內容理解整合為一體，是現代法律工作不可或缺的一站式智能助理。',
    images: [
      {
        url: 'https://www.lawbot.tw/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'AI 法律問答與書狀撰寫 | Lawbot AI',
      }
    ]
  },
  alternates: {
    canonical: 'https://www.lawbot.tw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  }
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const sessionUser = await getSessionUser();
  
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <Script
          id='site-schema'
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.lawbot.tw/#website",
                  "name": "Lawbot AI",
                  "alternateName": "Taiwan Law Bot",
                  "url": "https://www.lawbot.tw/",
                  "description": "專為法律從業人員與學習者設計的法律 AI ，法學資料搜尋與法律文件處理平台",
                  "publisher": {
                    "@id": "https://www.lawbot.tw/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://www.lawbot.tw/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.lawbot.tw/#organization",
                  "name": "遠律科技有限公司",
                  "legalName": "遠律科技有限公司",
                  "alternateName": ["Lawbot AI", "Taiwan Law Bot"],
                  "url": "https://www.lawbot.tw",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.lawbot.tw/img/logo.png",
                    "width": 1200,
                    "height": 630,
                    "caption": "Lawbot AI Logo"
                  },
                  "description": "專為法律從業人員與學習者設計的法律 AI ，法學資料搜尋與法律文件處理平台",
                  "foundingDate": "2025",
                  "industry": "Legal Technology",
                  "knowsAbout": ["法律搜尋", "AI法律助手", "判決檢索", "法律文件編輯", "訴狀生成"],
                  "serviceArea": {
                    "@type": "Country",
                    "name": "Taiwan"
                  },
                  "offers": {
                    "@type": "Service",
                    "name": "AI法律搜尋與文件處理服務",
                    "description": "提供法條檢索、判決搜尋、訴狀生成與法律文件編輯等AI輔助服務"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.lawbot.tw/#software",
                  "name": "Lawbot AI",
                  "description": "專為法律從業人員與學習者設計的法律 AI ，法學資料搜尋與法律文件處理平台",
                  "url": "https://www.lawbot.tw",
                  "applicationCategory": "Legal Technology",
                  "operatingSystem": "Web Browser",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "TWD"
                  },
                  "creator": {
                    "@id": "https://www.lawbot.tw/#organization"
                  },
                  "featureList": [
                    "法條搜尋",
                    "裁判書查詢", 
                    "AI法律問答",
                    "訴狀生成",
                    "法律AI"
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        id='gtag'
      />

      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}');
        `}
      </Script>
      <body className={`${notoSerifTC.variable} ${notoSansTC.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
