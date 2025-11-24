import GoogleSignIn from "./GoogleSignin";
import Link from "next/link";

export interface AuthComponentProps {
  redirectPath: string;
  onNewUser?: () => void;
  onOldUser?: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ redirectPath, onNewUser, onOldUser }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-center text-gray-800">歡迎使用法律智能助手</h2>
      <p className="text-gray-500 mb-8 text-center">登入您的帳戶以開始使用全方位法律諮詢服務</p>
      
      {/* Google Sign In */}
      <div className="flex-1 flex w-full mb-6 mx-auto items-center justify-center"> 
        <GoogleSignIn 
          redirectPath={redirectPath}
          onNewUser={onNewUser}    // 傳遞 onNewUser 回調
          onOldUser={onOldUser}    // 傳遞 onOldUser 回調
        />
      </div>
      
      <div className="relative w-full my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-white text-gray-500">更多服務</span>
        </div>
      </div>
      
      <div className="mt-4 w-full">
        <Link href="https://page.line.me/081ddxee" target='_blank' className="w-full block text-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
          聯絡我們諮詢
        </Link>
      </div>

      <p className="text-xs mt-8 text-center text-gray-500">
        登入/註冊帳號即表示同意<Link href='/terms' className="underline text-blue-600">服務條款</Link>、<Link href='/privacy' className="underline text-blue-600">隱私權政策</Link>
      </p>
    </div>
  );
};

export default AuthComponent;