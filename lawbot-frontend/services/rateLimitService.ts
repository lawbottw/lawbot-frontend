import { Timestamp } from "firebase/firestore";
import {
  PLAN_LIMITS_CONFIG,
  PlanName,
  ServiceTypeFirestore,
  RateLimitCheckResult,
  getTodayDateString,
  mapFrontendActionToServiceType,
  UserSubscriptionFs,
  isCreditsBasedService,
  getServiceCreditsCost
} from "@/config/rateLimitConfig";

// Helper to format a JS Date to 'YYYY-MM-DD' in Taipei time (UTC+8)
const formatDateToYYYYMMDD_Taipei = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' locale gives YYYY-MM-DD
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
};

const getActiveUsageCycleKey = (
  subscriptionData?: UserSubscriptionFs | null,
  nowOverride?: Date // For testing
): string => {
  const now = nowOverride || new Date(); // Current time in local timezone
  
  // Convert to Taipei timezone
  const nowInTaipei = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  
  // Default to calendar month (YYYY-MM)
  const calendarMonthKey = formatDateToYYYYMMDD_Taipei(now).substring(0, 7); // Get YYYY-MM

  // Check if user has an active subscription with startDate
  if (!subscriptionData || subscriptionData.status !== 'active') {
    return calendarMonthKey;
  }

  const startDateTimestamp = subscriptionData.startDate; // Changed from subscriptionStartDate
  if (!startDateTimestamp) {
    return calendarMonthKey;
  }

  // Convert Firestore Timestamp to Date
  let subStartDate: Date;
  if (startDateTimestamp instanceof Timestamp) {
    subStartDate = startDateTimestamp.toDate();
  } else if (startDateTimestamp instanceof Date) {
    subStartDate = startDateTimestamp;
  } else if (typeof startDateTimestamp === 'object' && startDateTimestamp !== null && 'seconds' in startDateTimestamp && 'nanoseconds' in startDateTimestamp) {
    try {
      subStartDate = new Timestamp(startDateTimestamp.seconds, startDateTimestamp.nanoseconds).toDate();
    } catch (e) {
      console.warn('Unable to convert startDate to Date:', e);
      return calendarMonthKey;
    }
  } else {
    console.warn('startDate is not a recognized Timestamp or Date object');
    return calendarMonthKey;
  }

  // Convert subscription start date to Taipei timezone
  const subStartDateTaipei = new Date(subStartDate.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  const cycleDay = subStartDateTaipei.getDate();
  
  let currentCycleYear = nowInTaipei.getFullYear();
  let currentCycleMonth = nowInTaipei.getMonth() + 1; // JavaScript months are 0-indexed

  // If current day is before the subscription's start day,
  // we are still in the cycle that started in the previous month
  if (nowInTaipei.getDate() < cycleDay) {
    currentCycleMonth -= 1;
    if (currentCycleMonth === 0) {
      currentCycleMonth = 12;
      currentCycleYear -= 1;
    }
  }

  // Return the cycle key in YYYY-MM-DD format
  const subscriptionCycleKey = `${currentCycleYear}-${currentCycleMonth.toString().padStart(2, '0')}-${cycleDay.toString().padStart(2, '0')}`;
  return subscriptionCycleKey;
};

/**
 * Checks if the user is allowed to perform an action based on their subscription plan and usage.
 * Pure logic function - receives user data from UserContext.
 *
 * @param userData The user data from UserContext (including monthlyUsage, extraQuota, currentSubscription).
 * @param frontendMode The mode of the frontend action ('chat', 'deepResearch', 'semanticSearch', or 'agent').
 * @returns RateLimitCheckResult
 */
export const checkUserUsageAndSubscription = (
  userData: {
    currentSubscription?: {
      status?: string;
      plan?: PlanName;
      startDate?: any;
      endDate?: any;
    } | null;
    monthlyUsage?: {
      [cycleKey: string]: {
        [serviceKey in ServiceTypeFirestore]?: number;
      };
    };
    extraQuota?: {
      [serviceKey in ServiceTypeFirestore]?: number;
    };
  } | null,
  frontendMode: "flash" | "think" | "deepresearch" | "semanticSearch" | "agent"
): RateLimitCheckResult => {
  if (!userData) {
    return {
      allowed: false,
      reason: "用戶未登入",
      plan: null,
      serviceChecked: mapFrontendActionToServiceType(frontendMode),
    };
  }

  const serviceType = mapFrontendActionToServiceType(frontendMode);
  const todayString = getTodayDateString();
  let userPlan: PlanName = "free";

  if (userData?.currentSubscription?.plan) {
    userPlan = userData.currentSubscription.plan;

    // Check if endDate has passed (consistency with backend)
    const subscriptionData = userData.currentSubscription;
    const endDateTimestamp = subscriptionData?.endDate;

    if (endDateTimestamp) {
      let endDateDt: Date | null = null;

      if (endDateTimestamp instanceof Timestamp) {
        endDateDt = endDateTimestamp.toDate();
      } else if (endDateTimestamp instanceof Date) {
        endDateDt = endDateTimestamp;
      } else if (typeof endDateTimestamp === 'object' && endDateTimestamp !== null && 'seconds' in endDateTimestamp && 'nanoseconds' in endDateTimestamp) {
        try {
          endDateDt = new Timestamp(endDateTimestamp.seconds, endDateTimestamp.nanoseconds).toDate();
        } catch (e) {
          console.warn(`Warning: endDate could not be converted to Date:`, e);
        }
      } else {
        console.warn(`Warning: endDate type ${typeof endDateTimestamp} is not a recognized Timestamp or Date object.`);
      }

      if (endDateDt) {
        // Convert to Taipei timezone for comparison
        const nowInTaipei = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
        const endDateInTaipei = new Date(endDateDt.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
        
        if (nowInTaipei > endDateInTaipei) {
          userPlan = "free";
        }
      }
    }
  }

  // Get active usage cycle - simplified to match backend logic
  const activeCycleKey = getActiveUsageCycleKey(userData?.currentSubscription as UserSubscriptionFs);

  // Check if this service uses credits system
  if (isCreditsBasedService(serviceType)) {
    // Credits-based service checking
    const planConfig = PLAN_LIMITS_CONFIG[userPlan];
    const creditsLimit = planConfig?.credits;
    
    if (!creditsLimit) {
      return {
        allowed: true,
        reason: "系統錯誤:未配置credits限制",
        plan: userPlan,
        serviceChecked: serviceType,
      };
    }

    // Get credits used from the active cycle (default to 0 if cycle doesn't exist yet)
    const creditsUsed = userData?.monthlyUsage?.[activeCycleKey]?.credits ?? 0;
    
    const extraCredits = userData?.extraQuota?.credits ?? 0;
    const creditsRequired = getServiceCreditsCost(serviceType);
    const monthlyRemaining = creditsLimit.monthly - creditsUsed;
    const creditsRemaining = Math.max(monthlyRemaining, 0) + extraCredits;

    if (creditsRemaining < creditsRequired) {
      const serviceNameMap = {
        flash: "快速對話",
        think: "推理",
        deepresearch: "深度研究",
        agent: "AI代理"
      };
      const serviceName = serviceNameMap[serviceType as keyof typeof serviceNameMap] || serviceType;
      
      return {
        allowed: false,
        reason: `您的點數不足以使用${serviceName}功能（需要${creditsRequired}點，剩餘${creditsRemaining}點）`,
        plan: userPlan,
        limitTypeHit: "monthly",
        limitValue: creditsLimit.monthly,
        serviceChecked: serviceType,
        usageCycleKey: activeCycleKey,
        creditsRequired,
        creditsRemaining,
      };
    }

    return {
      allowed: true,
      reason: "允許使用",
      plan: userPlan,
      serviceChecked: serviceType,
      usageCycleKey: activeCycleKey,
      creditsRequired,
      creditsRemaining,
    };
  } else {
    // Non-credits service (semantic_search) - use existing logic
    const planConfig = PLAN_LIMITS_CONFIG[userPlan];
    const limits = planConfig?.semantic_search;

    if (!limits) {
      return {
        allowed: true,
        reason: "系統錯誤:未配置使用限制",
        plan: userPlan,
        serviceChecked: serviceType,
      };
    }

    // Get usage from the active cycle (default to 0 if cycle doesn't exist yet)
    const monthlyUsageCount = userData?.monthlyUsage?.[activeCycleKey]?.[serviceType] ?? 0;
    const extraQuotaCount = userData?.extraQuota?.[serviceType] ?? 0;

    if (limits.monthly !== null && monthlyUsageCount >= limits.monthly) {
      if (extraQuotaCount > 0) {
        return {
          allowed: true,
          reason: "已超過月額上限，使用加購額度",
          plan: userPlan,
          serviceChecked: serviceType,
          usageCycleKey: activeCycleKey
        };
      }

      return {
        allowed: false,
        reason: "已達每月使用上限",
        plan: userPlan,
        limitTypeHit: "monthly",
        limitValue: limits.monthly,
        serviceChecked: serviceType,
        usageCycleKey: activeCycleKey,
      };
    }

    return {
      allowed: true,
      reason: "允許使用",
      plan: userPlan,
      serviceChecked: serviceType,
      usageCycleKey: activeCycleKey,
    };
  }
};
