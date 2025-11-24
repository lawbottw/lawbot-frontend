'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { deleteUser, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  logout: () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ 
  children,
  // serverUser = null 
}: { 
  children: React.ReactNode, 
  // serverUser?: any 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // 如果有 serverUser，則不處於加載狀態
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      // await fetch('/api/auth/logout', { method: 'POST' })
      
      // router.push('/login');
    } catch (error) {
      // console.error('Logout Error: ', error)
    }
  };
  
  const deleteAccount = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        toast("成功刪除帳號",{
            description: "帳號已成功刪除",
          })
        
      } catch (error) {
        toast("登入逾時，請重新登入以刪除帳號",{
            description: "請重新登入以刪除帳號",
          })
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);