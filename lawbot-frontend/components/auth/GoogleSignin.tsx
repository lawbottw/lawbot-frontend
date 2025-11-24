'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import Image from 'next/image';
import { Button } from '../ui/button';

const googleProvider = new GoogleAuthProvider();

interface GoogleSignInProps {
  onClose?: () => void;
  redirectPath?: string;
  onNewUser?: () => void;
  onOldUser?: () => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onClose, redirectPath, onNewUser, onOldUser }) => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
    
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // 新用戶
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: Timestamp.fromDate(new Date(user.metadata.creationTime || Date.now())),
          plan: "free",
          currentSubscription: {
            plan: "free",
            status: "active",
            startDate: Timestamp.fromDate(new Date(user.metadata.creationTime || Date.now())),
            endDate: null,
          },
        });
        
        onNewUser?.();
        onClose?.();
        return;
      }
            
      // 舊有用戶
      onOldUser?.();
      onClose?.();
    } catch (err: any) {
      //console.error(err);
    }
  };

  return (
    <div className="cursor-pointer" onClick={handleGoogleSignIn}>
      <Button
        className="w-56 max-w-xs flex items-center justify-center border rounded-3xl py-2 px-3 bg-white hover:bg-gray-200 shadow-sm text-black cursor-pointer"
      >
        <Image src="/img/google-logo.png" alt="Google Logo" className="w-6 h-6 mr-3 ml-2 p-1" width={24} height={24} />
        <span className="mr-2">以Google帳號繼續</span>
      </Button>
    </div>
  );
};

export default GoogleSignIn;
