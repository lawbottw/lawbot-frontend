"use client"
import { CheckCircle, Edit3, Sparkles, FileText, Eye } from "lucide-react"

export default function DocumentEditor() {

  const mockContent = [
    { type: "title", text: "民事起訴狀" },
    { type: "section", text: "當事人：" },
    { type: "content", text: "原告：張三，男，民國75年1月1日生，身分證字號：A123456789，住台北市中正區..." },
    { type: "section", text: "訴訟標的：" },
    { type: "content", text: "請求被告返還借款新台幣100萬元及自民國112年1月1日起至清償日止..." }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            法律文本編輯助理，隨時修訂、快速成文
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            可與AI協作編輯內容，即時重構句子、優化用詞，讓法律書件更具說服力。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側功能介紹 */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">智能書狀生成</h3>
                <p className="text-muted-foreground">
                  根據案件類型自動生成標準格式，大幅縮短文件準備時間
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">AI 協作編輯</h3>
                <p className="text-muted-foreground">
                  即時語法檢查、用詞優化建議，確保每個段落都符合法律文件標準格式
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">品質驗證</h3>
                <p className="text-muted-foreground">
                  自動檢查法條引用、格式規範，確保文件完整性與專業度
                </p>
              </div>
            </div>
          </div>

          {/* 右側 Canvas 示意圖 */}
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* 模擬編輯器頂部工具列 */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">民事起訴狀.docx</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-3 py-1 text-xs rounded bg-primary text-primary-foreground`}
                  >
                    編輯
                  </button>
                </div>
              </div>
            </div>

            {/* 模擬編輯器內容 */}
            <div className="p-6 h-96 overflow-y-auto">
              <div className="space-y-4">
                {mockContent.map((item, index) => (
                  <div key={index} className="group relative">
                    {item.type === "title" && (
                      <h3 className="text-xl font-bold text-center text-foreground mb-6">
                        {item.text}
                      </h3>
                    )}
                    {item.type === "section" && (
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {item.text}
                      </h4>
                    )}
                    {item.type === "content" && (
                      <div className="relative">
                        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded border-l-4 border-primary/30">
                          {item.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 底部狀態列 */}
            <div className="bg-muted/30 px-6 py-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>字數: 1,247</span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>引用資料驗證</span>
                  </span>
                </div>
                <span>儲存於 2 分鐘前</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
