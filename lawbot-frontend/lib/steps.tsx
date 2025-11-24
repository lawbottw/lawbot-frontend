import { Menu, MessageSquare, SlidersHorizontal, Search, Bookmark, PenToolIcon, Folder } from 'lucide-react';

export const steps: any  = [
  {
    tour: "mainTour",
    steps: [
      {
        icon: "👋",
        title: <p className="text-black/95">歡迎來到Lawbot AI</p>,
        content: <p className="text-black/85 text-sm leading-tight">
          這是我們功能側邊欄，您可以在這裡快速切換頁面
        </p>,
        selector: "#step1",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <MessageSquare size={20} />,
        title: <p className="text-black/95">這裡是AI問答</p>,
        content: <p className="text-black/85 text-sm leading-tight">你可以在這裡和AI進行對話，也可以使用「@」來匯入你的書籤</p>,
        selector: "#step2",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 15,
        pointerRadius: 20,
      },
      {
        icon: <SlidersHorizontal size={20} />,
        title: <p className="text-black/95">這是篩選按鈕</p>,
        content: <p className="text-black/85 text-sm leading-tight">你可以篩選你想要的資料、範圍，系統會自行緩存條件</p>,
        selector: "#step3",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 0,
        pointerRadius: 20,
        
      },
      {
        icon: <PenToolIcon size={20} />,
        title: <p className="text-black/95 mb-0 pb-0">這是小工具</p>,
        content: <div className='w-96'>
            <p className="text-black/85 text-sm leading-tight">
            可以在這裡上傳檔案、切換模式
            </p>
            <ul className="pt-2 pl-5 text-black/85 text-sm leading-tight">
              <li ><strong>一般模式</strong>：快速查詢裁判，適合日常檢索</li>
              <li><strong>推理模式</strong>：模型的思考較深，適合複雜案例、文本過長</li>
              <li><strong>深度探索</strong>：大規模資料彙整、專案研究，節省大量人工</li>
            </ul>
          </div>,
        selector: "#step4",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 0,
        pointerRadius: 20,
      },
      {
        icon: <Folder size={20} />,
        title: <p className="text-black/95">這是選取案件</p>,
        content: <p className="text-black/85 text-sm leading-tight">可以在這裡選取你已創建的案件，讓不同對話可以共用背景資訊及相關法律資料。也可在此新增案件</p>,
        selector: "#step5",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 0,
        pointerRadius: 10,
        
      },
      // {
      //   icon: <Search size={20} />,
      //   title: <p className="text-black/95">這裡是精準搜尋</p>,
      //   content: <p className="text-black/85 text-sm leading-tight">當AI問答找到的資料你不滿意時，可以使用精準搜尋來查找資料，輕鬆切換關鍵字搜尋及語意搜尋</p>,
      //   selector: "#step5",
      //   side: "top",
      //   showControls: true,
      //   showSkip: true,
      //   pointerPadding: 10,
      //   pointerRadius: 20,
      //   nextRoute: '/favorites',
      //   prevRoute: '/',
      // },
      // {
      //   icon: <Folder size={20} />,
      //   title: <p className="text-black/95">這頁是案件管理</p>,
      //   content: <p className="text-black/85 text-sm leading-tight">可以在這裡管理你的案件，讓同個案件的不同對話可以擁有共用的背景資訊及相關法律資料。點擊此按鈕即可新增案件</p>,
      //   selector: "#step5",
      //   side: "bottom-right",
      //   showControls: true,
      //   showSkip: true,
      //   pointerPadding: 10,
      //   pointerRadius: 20,
      //   nextRoute: '/favorites',
      //   prevRoute: '/',
      // },
      // {
      //   icon: <Bookmark size={20} />,
      //   title: <p className="text-black/95">這裡是書籤</p>,
      //   content: <p className="text-black/85 text-sm leading-tight">你可以在這裡管理你的書籤，方便在AI中使用準確的裁判範圍</p>,
      //   selector: "#step6",
      //   side: "left",
      //   showControls: true,
      //   showSkip: true,
      //   pointerPadding: 10,
      //   pointerRadius: 10,
      //   prevRoute: '/project',
      // },
    ]
  }
]