import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

// 加入 metadata export 取代 Head 標籤
export const metadata = {
  title: '服務條款',
};

const TermsOfService: React.FC = () => {
  return (
    <div className="flex-1 justify-center items-center">

      <Header />

      <div className="max-w-4xl mx-12 lg:mx-auto mt-32 ">
        <h1>法律機器人（Lawbot AI）服務條款</h1>

        <section className="my-6">
          <h2 >前言</h2>
          <p >
            法律機器人（Lawbot AI），係由遠律科技有限公司（統一編號：93691731）依據本服務條款提供本站各項服務。當您註冊完成或開始使用本服務時，即表示您已閱讀、了解並同意接受本服務條款之所有內容。
          </p>
        </section>

        <section className="mb-6">
          <h2 >服務說明</h2>
          <p >
            本服務為人工智慧（AI）驅動的法學搜尋引擎，提供法律資訊檢索與分析服務。服務內容包括但不限於：
          </p>
          <ul className="list-disc pl-6 space-y-3 text-lg text-foreground">
            <li>AI 驅動的法學資料檢索</li>
            <li>法律條文與判決分析</li>
            <li>法律資訊整合與比對</li>
            <li>其他法律 AI 相關服務</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 >資料來源與免責聲明</h2>
          <p >
            本服務之法律資訊及內容主要取自下列官方資料庫：
          </p>
          <ul className="list-disc pl-6 space-y-3 text-lg text-foreground">
            <li>全國法規資料庫</li>
            <li>立法院法律系統</li>
            <li>司法院法學資料檢索系統</li>
            <li>其他公開法律資料來源</li>
          </ul>

          <h3 className="mt-6 mb-3">免責聲明：</h3>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>本服務提供的搜尋結果僅供參考，不能確保資料的絕對正確性與完整性。</li>
            <li>本服務所呈現的搜尋結果並非專業法律意見，不應視為正式的法律建議。</li>
            <li>對於任何因使用本服務所搜尋、獲取之資訊而產生的法律問題，使用者應自行負責。</li>
            <li>建議使用者遇有複雜或具體法律問題，務必諮詢專業律師。</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >服務範圍</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>本服務提供法學搜尋引擎，旨在協助使用者快速檢索並分析法律資訊。</li>
            <li>本服務可能包含多種法律 AI 功能，包括但不限於資料搜尋、文件分析、法條比對等。</li>
            <li>搜尋結果僅為資訊整合與參考，不產生任何法律約束力。</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >使用限制</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>使用者不得將本服務用於非法或違反倫理的目的。</li>
            <li>不得過度使用或濫用本服務的系統資源，包括但不限於自動化程式大量查詢。</li>
            <li>不得濫用或過度依賴本服務所提供的搜尋結果與資訊分析。</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >智慧財產權</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>本服務之所有內容、介面、搜尋演算法及 AI 技術，均由遠律科技有限公司擁有相關智慧財產權。</li>
            <li>未經授權，不得擅自重製、散布或商業使用本服務的系統、介面或搜尋結果。</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >隱私與資料</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>用戶的搜尋紀錄與查詢內容將被視為機密，並依照<Link href='/privacy' target='_blank' className='underline font-medium underline-offset-2'>隱私權政策</Link>妥善保護。</li>
            <li>本服務可能紀錄使用者的搜尋內容與使用行為，以持續優化 AI 搜尋功能與其他相關服務。</li>
            <li>本服務可能使用匿名化的使用資料進行系統改進與研究分析。</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >連絡方式</h2>
          <div>
            <p><strong>公司名稱：</strong>遠律科技有限公司</p>
            <p><strong>統一編號：</strong>93691731</p>
            <p><strong>電子郵件：</strong>lawbottw@gmail.com</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 >附加條款</h2>
          <p >
            本服務保留隨時修改服務條款的權利。使用者持續使用本服務，即視為同意最新版本之服務條款。
          </p>
        </section>

        <section className="mb-6">
          <h2 >管轄與適用法律</h2>
          <p >
            本服務條款之解釋與適用，均應依中華民國法律，並以台灣新竹地方法院為管轄法院。
          </p>
        </section>

        <div className="text-primary my-8">
          最後更新時間：2025年3月7日
        </div>
        
      </div>
    <Footer />
    </div>
  );
};

export default TermsOfService;