import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// 加入 metadata export 取代 Head 標籤
export const metadata = {
  title: '隱私權政策',
  description: 'Lawbot隱私權保護政策',
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex-1">
      <Header />

      <div className="max-w-4xl mx-12 lg:mx-auto mt-32 mb-6">
        <h1 >隱私權政策</h1>
        <p className='mt-6'>
            非常歡迎您光臨「法律機器人 （Lawbot AI）」（以下簡稱本網站），此網站係由遠律科技有限公司（統編: 93691731）提供，為了讓您能夠安心使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益，請您詳閱下列內容：
        </p>

        <section className="my-6">
          <h2>一、隱私權政策的適用範圍</h2>
          <p>
            本隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。 本隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。
          </p>
        </section>

        <section className="mb-6">
          <h2 >二、個人資料的蒐集、處理及利用方式</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>
              當您造訪本網站或使用本網站所提供之功能服務時，我們可能會請您提供必要的個人資料（如姓名、電子郵件地址、聯絡方式等），並僅在特定目的範圍內處理及利用您的個人資料。非經您書面同意，本網站不會將您的個人資料用於其他用途。
            </li>
            <li>
              本網站在您使用互動性功能（如客服信箱或問卷調查）時，會保留您所提供的資料，包括姓名、電子郵件地址、聯絡方式及使用時間等。
            </li>
            <li>
              本網站伺服器會自行紀錄您的使用行為（如 IP 位址、瀏覽器類型、瀏覽時間等），僅用於改善服務品質，此紀錄僅供內部應用，絕不對外公開。
            </li>
            <li>
              為提供精確服務，我們可能對收集的數據進行統計分析，並將結果用於內部研究或公開統計資訊，但不涉及特定個人資料。
            </li>
            <li>
              您可隨時請求更正或刪除您在本網站的個人資料，聯繫方式請見最下方「聯繫管道」。
            </li>
          </ol>
        </section>

        {/* Continue with remaining sections similarly */}
        <section className="mb-6">
          <h2 >三、資料之保護</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>
              本網站建置完善的資訊安全防護機制，運用加密技術、存取控制及監控系統等多重安全措施，全力保障您個人資料的安全性。
            </li>
            <li>
              僅有經授權的人員可接觸您的個人資料，並要求相關處理人員簽署保密合約，違者將依法處罰。
            </li>
            <li>
              如因業務需要委託第三方提供服務，我們將要求其遵守保密義務，並採取必要的監督措施。
            </li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >四、網站對外的相關連結</h2>
          <p >
            本網站的頁面可能提供其他網站的連結，但該網站的隱私權政策不適用於本網站，您需參考該連結網站的隱私權保護政策。
          </p>
        </section>

        <section className="mb-6">
          <h2 >五、與第三人共用個人資料之政策</h2>
          <p >
            本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體或機構，但以下情形不在此限：
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>經由您的書面同意。</li>
            <li>法律明文規定。</li>
            <li>為免除您生命、身體、自由或財產上之危險。</li>
            <li>與公務機關或學術研究機構合作，基於公共利益為統計或學術研究所需，且資料經處理後無法識別特定個人。</li>
            <li>當您在網站上的行為違反服務條款，或可能損害本網站與其他使用者權益時，為辨識、聯絡或採取法律行動所必要。</li>
            <li>本網站委託廠商協助處理您的個人資料時，將對委外廠商進行監督與管理。</li>
          </ol>
        </section>

        {/* Continue with remaining sections */}
        <section className="mb-6">
          <h2 >六、AI 模型與第三方服務</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg text-foreground">
            <li>
              為提升我們的服務與用戶體驗，本網站可能使用您提供的資料進行 AI 模型的訓練，這些資料將經過去識別化處理，並僅用於優化服務，不會用於其他商業用途，如交換、出售或出租。
            </li>
            <li>
              本網站可能使用由 Google 提供的 Gemini API、DeepInfra 及 OpenAI 等 AI 服務供應商，以及自有 AI 模型作為 AI 支援服務的一部分。您在使用服務時輸入的問題或資料可能會傳輸至該第三方服務供應商，且可能在去識別化後被第三方進行訓練使用。使用本服務即表示您了解並同意此資料傳輸與可能的使用。
            </li>
            <li>
              我們將定期檢視第三方服務供應商的隱私保護政策，確保其符合我們的資料保護標準。然而，基於技術特性，我們無法完全掌控第三方處理過程，敬請用戶理解。
            </li>
            <li>
              您的資料僅會在去識別化後用於程式除錯、模型訓練與服務優化，且絕不會用於廣告、營利或其他商業用途。您有權要求我們停止將您的資料用於 AI 模型訓練。
            </li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 >七、Cookie 的使用</h2>
          <p >
            為了提供您最佳服務體驗，本網站可能會在您的設備中放置並取用 Cookie。您可自行調整瀏覽器設定以拒絕 Cookie，但這可能導致部分功能無法正常運作。
          </p>
        </section>

        <section className="mb-6">
          <h2 >八、隱私權政策之修正</h2>
          <p >
            本網站隱私權保護政策將因應需求隨時修正，修正後的條款將公布於網站上，恕不另行通知。
          </p>
        </section>

        <section className="mb-6">
          <h2 >九、聯繫管道</h2>
          <p >
            若您對本隱私權政策有任何疑問，或希望行使您的資料權利（如更正或刪除），請聯繫我們：
          </p>
          <div className="pl-4">
            <p><strong>公司名稱：</strong> 遠律科技有限公司</p>
            <p><strong>Email：</strong> lawbottw@gmail.com</p>
          </div>
        </section>

        <div className="text-sm text-primary mt-8">
          最後更新時間：2025年3月7日
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default PrivacyPolicy;