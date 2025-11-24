import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';

// Article interface definition
interface Article {
  id: string;
  title: string; // SEO Title
  h1: string;    // Content H1
  summary: string;
  content: string;
  category: string;
  updatedAt: string; // ISO string format
  authorName: string;
}

// Fetch single article data
async function getArticle(id: string): Promise<Article | null> {
  try {
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "無標題", // SEO Title
        h1: data.h1 || data.title || "無標題", // Content H1, fallback to title if h1 doesn't exist
        summary: data.summary || "",
        content: data.content || "無內容",
        category: data.category || "未分類",
        updatedAt: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
        authorName: data.authorName || "Lawbot AI 團隊"
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }>; }): Promise<Metadata> {
  const {id} = await params;
  if (!id) {
    return {
      title: '文章未找到',
      description: '無效的文章ID。',
    };
  }

  const article = await getArticle(id); 

  if (!article) {
    return {
      title: '文章未找到',
      description: '您所尋找的文章不存在或已被移除。',
    };
  }

  const pageUrl = `https://www.lawbot.tw/blog/${article.id}`; // Construct the canonical URL
  const imageUrl = 'https://www.lawbot.tw/img/blog-image.png'; // Use the specified image URL

  return {
    title: `${article.title}`,
    description: article.summary || 'Lawbot AI 部落格文章，深入探討法律科技的最新發展與應用。',
    keywords: ['法律科技', article.category, article.title].filter(Boolean), // Add article title and category to keywords
    openGraph: {
      title: `${article.title}`,
      description: article.summary || 'Lawbot AI 部落格文章，深入探討法律科技的最新發展與應用。',
      url: pageUrl,
      type: 'article', // Set type to 'article' for blog posts
      images: [
        {
          url: imageUrl,
          width: 1200, // Standard OG image width
          height: 630, // Standard OG image height
          alt: article.title,
        },
      ],
      siteName: 'Lawbot AI',
      // Optional: Add article-specific OG tags if available
      // publishedTime: article.publishedAt, // Requires publishedAt field
      // modifiedTime: article.updatedAt,
      // authors: [article.authorName],
      // section: article.category,
      // tags: article.tags, // Requires tags field
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | Lawbot AI 部落格`,
      description: article.summary || 'Lawbot AI 部落格文章，深入探討法律科技的最新發展與應用。',
      images: [imageUrl],
      // Optional: Add Twitter-specific tags if needed
      // creator: '@YourTwitterHandle', // If you have a Twitter handle
    },
  };
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Article Page Component
export default async function ArticlePage({ params }: { params: Promise<{ id: string }>; }) {
  const {id} = await params; 
  if (!id) {
    notFound();
  }
  
  const article = await getArticle(id);

  if (!article) {
    notFound(); // Trigger 404 page if article not found
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 mt-24 md:mt-32">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-4 md:mb-6 mt-2 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            返回部落格列表
          </Link>

          {/* Article Header */}
          <article className="overflow-hidden px-2 sm:px-6 md:px-10">
            <div className="mb-4">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full inline-flex items-center">
                <Tag className="mr-1.5 h-4 w-4" />
                {article.category}
              </span>
            </div>
            {/* Use article.h1 for the visible heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">{article.h1}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 md:mb-8 space-x-4">
              <span className="inline-flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" />
                {formatDate(article.updatedAt)}
              </span>
              <span className="inline-flex items-center">
                <User className="mr-1.5 h-4 w-4" />
                {article.authorName}
              </span>
            </div>


            {/* <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src="/img/blog-image.png" // Using placeholder, replace with dynamic image if available
                alt={`文章圖片：${article.title}`}
                fill
                className="object-cover"
                priority // Prioritize loading the main image
              />
            </div> */}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none pb-12 md:pb-20">
              {/* Use prose classes for basic markdown styling, customize further with components prop */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, children, ...props }) => <h1 className="text-3xl font-semibold text-foreground/95 mt-12 mb-6 border-b pb-2" {...props}>{children}</h1>,
                  h2: ({ node, children, ...props }) => <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground/90 mt-10 mb-4 border-l-4 border-primary pl-4" {...props}>{children}</h2>,
                  h3: ({ node, children, ...props }) => <h3 className="text-xl font-semibold text-foreground/90 mt-8 mb-3" {...props}>{children}</h3>,
                  p: ({ node, children, ...props }) => <p className="leading-relaxed mb-5 text-base md:text-lg" {...props}>{children}</p>,
                  ol: ({ node, children, ...props }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-base md:text-lg" {...props}>{children}</ol>,
                  ul: ({ node, children, ...props }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-base md:text-lg" {...props}>{children}</ul>,
                  li: ({ node, children, ...props }) => <li className="mb-2" {...props}>{children}</li>,
                  strong: ({ node, children, ...props }) => <strong className="font-semibold" {...props}>{children}</strong>,
                  a: ({ node, children, ...props }) => <a className="text-primary hover:underline" {...props}>{children}</a>,
                  // Wrap table in a div with overflow-x-auto for horizontal scrolling
                  table: ({ node, children, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="border-collapse border border-border w-full" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ node, children, ...props }) => {
                    return <thead className="bg-muted" {...props}>{children}</thead>;
                  },
                  tbody: ({ node, children, ...props }) => {
                    return <tbody {...props}>{children}</tbody>;
                  },
                  tr: ({ node, children, ...props }) => {
                    return <tr className="border-b border-border" {...props}>{children}</tr>;
                  },
                  th: ({ node, children, ...props }) => {
                    return <th className="border border-border px-4 py-2 text-left font-medium" {...props}>{children}</th>;
                  },
                  td: ({ node, children, ...props }) => {
                    return <td className="border border-border px-4 py-2 text-base" {...props}>{children}</td>;
                  },
                  img: ({ node, src, alt, ...props }) => {
                    // Ensure width and height are numbers for Next/Image
                    const imgWidth = typeof props.width === 'string' ? parseInt(props.width, 10) : typeof props.width === 'number' ? props.width : 800;
                    const imgHeight = typeof props.height === 'string' ? parseInt(props.height, 10) : typeof props.height === 'number' ? props.height : 450;

                    return (
                      <span className="block my-6"> {/* Add margin around images */}
                        <Image
                          src={typeof src === "string" ? src : "/img/blog-image.png"} // Provide a fallback image and ensure src is a string
                          alt={alt || "文章圖片"}
                          width={isNaN(imgWidth) ? 800 : imgWidth} // Fallback if parsing fails
                          height={isNaN(imgHeight) ? 450 : imgHeight} // Fallback if parsing fails
                          className="rounded-md shadow-md mx-auto" // Center images and add styling
                          // {...props} // Avoid spreading potentially incompatible props
                        />
                      </span>
                    );
                  },
                  blockquote: ({ node, children, ...props }) => <blockquote className="border-l-4 border-muted-foreground/50 pl-4 italic text-muted-foreground my-6" {...props}>{children}</blockquote>,
                  // Correctly handle the 'inline' prop provided by react-markdown
                  code: ({ node, className, children, style, ...props }) => {
                    // Access the inline prop passed by react-markdown
                    const inline = (props as any).inline;
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto my-6" style={style}>
                        <code className={className} {...props}>
                          {String(children).replace(/\n$/, '')}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
