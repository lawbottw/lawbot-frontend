export const metadata = {
  title: '登入 / 註冊',
  openGraph: {
    type: 'website',
    url: 'https://www.lawbot.tw/login',
    siteName: 'Lawbot AI',
    title: '登入 / 註冊 | Lawbot AI',
    description: 'Lawbot AI 是一款利用生成式 AI 技術打造的全新法學資料搜尋引擎，旨在為法律從業人士和學習者提供高效、精準的法律資料檢索服務。​透過先進的 AI 技術，Lawbot AI 能夠快速處理大量法律文件，協助用戶迅速找到相關法條、判決和法律見解，提升法律研究與實務工作的效率。​此外，Lawbot AI 摘要、解釋功能，讓用戶更輕鬆地理解複雜的法律內容。',
    images: [
      {
        url: 'https://www.lawbot.tw/img/logo.png',
        width: 1200,
        height: 630,
        alt: '登入 / 註冊 | Lawbot AI',
      }
    ]
  },
  alternates: {
    canonical: 'https://www.lawbot.tw/login',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}