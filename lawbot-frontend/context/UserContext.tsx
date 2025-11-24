'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { ServiceTypeFirestore } from '@/config/rateLimitConfig';

export interface UserData {
  displayName: string;
  email: string;
  photoURL?: string;
  hasTried: boolean;
  periodSubscription?: 'active' | 'cancelled' | 'failed' | null;
  currentSubscription: {
    status: 'active' | 'inactive' | 'cancelled';
    plan: 'free' | 'lite' | 'pro';
    startDate: Timestamp;
    endDate?: Timestamp | null;
    nextPaymentDate?: Timestamp;
    transactionId?: string;
  } | null;
  extraQuota?: {
    [serviceKey in ServiceTypeFirestore]?: number;
  };
  monthlyUsage?: {
    [cycleKey: string]: {
      [serviceKey in ServiceTypeFirestore]?: number;
    };
  };
  specialOffer?: number[];
  plan?: string;
}

interface UserContextValue {
  userData: UserData | null;
  plan: 'free' | 'lite' | 'pro';
  hasTried: boolean;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  setUserData: (data: UserData | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// 統一處理訂閱到期改回 free 的邏輯
const checkAndNormalizeSubscription = async (
  rawData: any,
  userDocRef: ReturnType<typeof doc> | null
) => {
  let currentSubscription = rawData.currentSubscription || null;
  let plan = "free";

  if (currentSubscription && currentSubscription.plan) {
    plan = currentSubscription.plan;

    const endDate = currentSubscription.endDate;
    let isExpired = false;
    
    if (endDate) {
      let endDateDt: Date | null = null;

      if (endDate instanceof Timestamp) {
        endDateDt = endDate.toDate();
      } else if (endDate instanceof Date) {
        endDateDt = endDate;
      } else if (
        typeof endDate === 'object' && 
        endDate !== null && 
        'seconds' in endDate && 
        'nanoseconds' in endDate
      ) {
        try {
          endDateDt = new Timestamp(
            (endDate as any).seconds,
            (endDate as any).nanoseconds
          ).toDate();
        } catch (e) {
          endDateDt = null;
        }
      }

      if (endDateDt) {
        const nowUtc = new Date(Date.now());
        if (nowUtc > endDateDt) {
          isExpired = true;
        }
      }
    }

    if (isExpired) {
      plan = "free";
      
      currentSubscription = {
        ...currentSubscription,
        plan: 'free',
        endDate: null
      };

      if (userDocRef) {
        try {
          await updateDoc(userDocRef, {
            plan: "free",
            "currentSubscription.plan": "free",
            "currentSubscription.endDate": null
          });
        } catch (e) {
          // 更新失敗可忽略
        }
      }
    }
  } else {
    plan = rawData.plan || "free";
  }

  return {
    ...rawData,
    plan,
    currentSubscription,
    monthlyUsage: rawData.monthlyUsage || {},
    extraQuota: rawData.extraQuota || {},
  };
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'lite' | 'pro'>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasTried = userData?.hasTried ?? false;

  const refreshUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const rawData = userDocSnap.data();
        const normalizedRaw = await checkAndNormalizeSubscription(
          rawData,
          userDocRef
        );

        const normalizedData: UserData = {
          displayName: normalizedRaw.displayName || user.displayName || '使用者',
          email: normalizedRaw.email || user.email || '',
          photoURL: normalizedRaw.photoURL || user.photoURL || '',
          hasTried: normalizedRaw.hasTried ?? false,
          periodSubscription: normalizedRaw.periodSubscription || null,
          currentSubscription: normalizedRaw.currentSubscription || null,
          extraQuota: normalizedRaw.extraQuota || {},
          monthlyUsage: normalizedRaw.monthlyUsage || {},
          specialOffer: normalizedRaw.specialOffer || [],
        };

        setUserData(normalizedData);
        setCurrentPlan(normalizedRaw.plan as 'free' | 'lite' | 'pro');
      }
    } catch (err) {
      console.error('Error refreshing user document:', err);
      setError('Failed to refresh user data');
    }
  };

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);

          if (unsubscribeUserDoc) {
            unsubscribeUserDoc();
          }

          unsubscribeUserDoc = onSnapshot(
            userDocRef,
            async (userDocSnap) => {
              if (userDocSnap.exists()) {
                const rawData = userDocSnap.data();
                const normalizedRaw = await checkAndNormalizeSubscription(
                  rawData,
                  userDocRef
                );

                const normalizedData: UserData = {
                  displayName: normalizedRaw.displayName || user.displayName || '使用者',
                  email: normalizedRaw.email || user.email || '',
                  photoURL: normalizedRaw.photoURL || user.photoURL || '',
                  hasTried: normalizedRaw.hasTried ?? false,
                  periodSubscription: normalizedRaw.periodSubscription || null,
                  currentSubscription: normalizedRaw.currentSubscription || null,
                  extraQuota: normalizedRaw.extraQuota || {},
                  monthlyUsage: normalizedRaw.monthlyUsage || {},
                  specialOffer: normalizedRaw.specialOffer || [],
                };

                setUserData(normalizedData);
                setCurrentPlan(normalizedRaw.plan as 'free' | 'lite' | 'pro');
                setError(null);
              } else {
                setUserData({
                  displayName: user.displayName || '使用者',
                  email: user.email || '',
                  photoURL: user.photoURL || '',
                  hasTried: false,
                  periodSubscription: null,
                  currentSubscription: null,
                  extraQuota: {},
                  monthlyUsage: {},
                  specialOffer: [],
                });
                setCurrentPlan('free');
                setError(null);
              }
              setLoading(false);
            },
            (err) => {
              console.error('Error fetching user document:', err);
              setError('Failed to fetch user data');
              setUserData(null);
              setCurrentPlan('free');
              setLoading(false);
            }
          );
        } catch (err) {
          console.error('Error setting up user document listener:', err);
          setError('Failed to fetch user data');
          setUserData(null);
          setLoading(false);
        }
      } else {
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
        setUserData(null);
        setCurrentPlan('free');
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
      unsubscribeAuth();
    };
  }, []);

  const value: UserContextValue = {
    userData,
    plan: currentPlan,
    hasTried,
    loading,
    error,
    refreshUserData,
    setUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook 供其他組件使用
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}