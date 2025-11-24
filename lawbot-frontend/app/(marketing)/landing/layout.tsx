
export const metadata = {
  // You can override or extend the metadata from the root layout here
  title: '台灣法律AI',
  description: 'Lawbot AI 是專為律師與法律工作者打造的全方位法律 AI 工具，結合自然語言搜尋、法律文件摘要、判決分析與 AI 書狀編輯功能，支援自動引用法條、模板生成與智能校對，協助律師、法務與法律研究者高效完成法律工作。Lawbot AI 是您不可或缺的台灣法律 AI 助手。',
  openGraph: {
    type: 'website',
    url: 'https://www.lawbot.tw/landing',
    siteName: 'Lawbot AI',
    title: '台灣法律AI | Lawbot AI',
    description: 'Lawbot AI 是專為律師與法律工作者打造的全方位法律 AI 工具，結合自然語言搜尋、法律文件摘要、判決分析與 AI 書狀編輯功能，支援自動引用法條、模板生成與智能校對，協助律師、法務與法律研究者高效完成法律工作。Lawbot AI 是您不可或缺的台灣法律 AI 助手。',
    images: [
      {
        url: 'https://www.lawbot.tw/img/logo.png',
        width: 1200,
        height: 630,
        alt: '台灣法律 AI | Lawbot AI',
      }
    ]
  },
  alternates: {
    canonical: 'https://www.lawbot.tw/landing',
  },
  
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Note that you don't need the html and body tags as they're in the root layout
    <div>  
        {children}
    </div>
  );
}
