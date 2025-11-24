import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { Calendar, User, Tag } from 'lucide-react';

// SEO Metadata
export const metadata: Metadata = {
  title: '部落格 - 法律科技前緣的引領者',
  description: 'Lawbot AI 部落格專注於法律科技領域，作為前緣的科技引領者，我們深入探討生成式AI在法律文件分析與自動化工作流上的創新應用，並介紹語意搜尋技術與AI問答平台如何提高法律服務效率與精準度。此外，本部落格定期更新最前沿法律科技新聞、業界深度報導與技術教學，提供豐富資源與實用指南，協助司法與法律專業人士掌握未來技術趨勢，創造更智能安全的工作模式。',
  keywords: ['法律科技','台灣法律生成式AI','自動化工作流', '語意搜尋','AI LAW BOT'],
  openGraph: {
    title: '部落格 - 法律科技前緣的引領者',
    description: 'Lawbot AI 部落格專注於法律科技領域，作為前緣的科技引領者，我們深入探討生成式AI在法律文件分析與自動化工作流上的創新應用，並介紹語意搜尋技術與AI問答平台如何提高法律服務效率與精準度。此外，本部落格定期更新最前沿法律科技新聞、業界深度報導與技術教學，提供豐富資源與實用指南，協助司法與法律專業人士掌握未來技術趨勢，創造更智能安全的工作模式。',
    url: 'https://lawbot.ai/blog', // Assuming this is the canonical URL
    type: 'website',
    images: [
      {
        url: 'https://www.lawbot.tw/img/blog-image.png', // Placeholder image URL, please update if needed
        width: 1200,
        height: 630,
        alt: 'Lawbot AI 部落格',
      },
    ],
    siteName: 'Lawbot AI',
  },
  twitter: { // Optional: Add Twitter card metadata as well
    card: 'summary_large_image',
    title: 'Lawbot AI 部落格｜法律科技前緣的科技引領者',
    description: 'Lawbot AI 部落格專注於法律科技領域，作為前緣的科技引領者，我們深入探討生成式AI在法律文件分析與自動化工作流上的創新應用，並介紹語意搜尋技術與AI問答平台如何提高法律服務效率與精準度。此外，本部落格定期更新最前沿法律科技新聞、業界深度報導與技術教學，提供豐富資源與實用指南，協助司法與法律專業人士掌握未來技術趨勢，創造更智能安全的工作模式。',
    images: ['https://www.lawbot.tw/img/blog-image.png'], // Placeholder image URL
  },
};


// 文章介面定義
interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  updatedAt: any; // Firebase Timestamp
  authorName: string;
}

// 獲取文章資料
async function getArticles(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, "articles");
    const articlesQuery = query(articlesRef, orderBy("updatedAt", "desc"), limit(6));
    const snapshot = await getDocs(articlesQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        summary: data.summary || "",
        content: data.content || "",
        category: data.category || "",
        updatedAt: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
        authorName: data.authorName || "Lawbot"
      };
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  const articles = await getArticles();
  
  // 獲取特色文章和一般文章
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white pt-48 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">法律科技的前沿思考</h1>
            <p className="text-xl opacity-90 mb-8">探索最新法律科技趨勢、產品介紹與專業見解</p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 mt-8">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16 md:mx-8 lg:mx-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-3 rounded"></span>
              精選文章
            </h2>
            <div className="bg-card rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl">
              <div className="md:flex">
                <div className="md:w-2/3 p-6 md:p-8">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center mr-4">
                      <Calendar className="mr-1 h-4 w-4" /> {/* Adjusted size */}
                      {formatDate(featuredArticle.updatedAt)}
                    </span>
                    <span className="inline-flex items-center mr-4">
                      <User className="mr-1 h-4 w-4" /> {/* Adjusted size */}
                      {featuredArticle.authorName}
                    </span>
                    <span className="inline-flex items-center">
                      <Tag className="mr-1 h-4 w-4" /> {/* Adjusted size */}
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                        {featuredArticle.category}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    <Link href={`/blog/${featuredArticle.id}`} className="hover:text-primary/80 transition-colors">
                      {featuredArticle.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{featuredArticle.summary}</p>
                  <Link href={`/blog/${featuredArticle.id}`} 
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    閱讀更多
                  </Link>
                </div>
                <div className="md:w-1/3 relative h-64 md:h-auto"> {/* Ensure parent has dimensions */}
                  {/* Image for Featured Article */}
                  <Image 
                    src="/img/blog-image.png" 
                    alt={`精選文章圖片：${featuredArticle.title}`} 
                    fill
                    className="object-cover" 
                  />
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Regular Articles */}
        <section className="mb-16 md:mx-8 lg:mx-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-2 h-8 bg-accent mr-3 rounded"></span>
            最新文章
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <div key={article.id} className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-48 relative"> {/* Ensure parent has dimensions */}
                  {/* Image for Regular Article */}
                  <Image 
                    src="/img/blog-image.png" 
                    alt={`文章圖片：${article.title}`} 
                    fill
                    className="object-cover" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center mr-3">
                      <Calendar className="mr-1 h-3 w-3" /> {/* Adjusted size */}
                      {formatDate(article.updatedAt)}
                    </span>
                    <span className="inline-flex items-center">
                      <Tag className="mr-1 h-3 w-3" /> {/* Adjusted size */}
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                        {article.category}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">
                    <Link href={`/blog/${article.id}`} className="hover:text-primary/80 transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <User className="mr-1 h-3 w-3" /> {/* Adjusted size */}
                      {article.authorName}
                    </span>
                    <Link href={`/blog/${article.id}`}
                      className="text-primary hover:text-primary/80 flex items-center text-sm font-medium transition-colors">
                      閱讀全文
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="mt-16 bg-gradient-to-r from-primary/95 to-primary/90 text-white p-4 sm:p-6 md:p-8 rounded-xl mx-2 sm:mx-4 md:mx-8 lg:mx-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-2/3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">訂閱我們的法律科技電子報</h3>
              <p className="text-white/80 text-sm sm:text-base">定期獲取最新法律科技資訊、優惠訊息、產品功能介紹</p>
              <p className="text-yellow-300 text-sm sm:text-base mt-2">電子報功能開發中，敬請期待！</p> {/* Added development notice */}
            </div>
            <div className="w-full md:w-1/3">
              <form className="flex flex-col sm:flex-row w-full">
                <input
                  type="email"
                  placeholder="您的電子郵件"
                  className="w-full px-4 py-2 rounded-l sm:rounded-l rounded-r-none text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 bg-accent text-accent-foreground px-4 py-2 rounded-r sm:rounded-r rounded-l sm:rounded-l-none font-medium hover:bg-accent/90 transition-colors"
                >
                  訂閱
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
