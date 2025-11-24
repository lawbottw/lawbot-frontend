// Frontend configuration for plan limits and service types

// Credits cost for each service type
export const SERVICE_CREDITS_COST = {
  flash: 1,
  think: 2,
  deepresearch: 20,
  agent: 15,
  semantic_search: 0, // semantic_search 仍使用獨立計數
} as const;

export const PLAN_LIMITS_CONFIG = {
  free: {
    credits: { monthly: 20 },
    semantic_search: { monthly: 20 },
  },
  lite: {
    credits: { monthly: 1000 },
    semantic_search: { monthly: 90000 },
  },
  pro: {
    credits: { monthly: 3000 },
    semantic_search: { monthly: 90000 },
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS_CONFIG;

// Service types as defined in the backend/config and used as keys in PLAN_LIMITS_CONFIG.
// These are the keys used in Firestore for tracking usage.
export const SERVICE_TYPES_FIRESTORE = ["flash", "deepresearch", "semantic_search", "think", "credits", "agent"] as const;
export type ServiceTypeFirestore = typeof SERVICE_TYPES_FIRESTORE[number];

// Helper to map frontend actions (SubmitMode or search page mode) to ServiceTypeFirestore
export function mapFrontendActionToServiceType(
  mode: "flash" | "deepresearch" | "semanticSearch" | "think" | "credits" | "agent"
): ServiceTypeFirestore {
  console.log(`[mapFrontendActionToServiceType] Received mode: '${mode}', type: ${typeof mode}`);
  switch (mode) {
    case "deepresearch":
      return "deepresearch";
    case "flash":
      return "flash";
    case "think":
      return "think";
    case "agent":
      return "agent";
    case "semanticSearch":
      console.log("[mapFrontendActionToServiceType] Matched 'semanticSearch'");
      return "semantic_search";
    default:
      console.warn(`[mapFrontendActionToServiceType] WARNING: Mode '${mode}' did not match any case. Defaulting to flash.`);
      return "flash";
  }
}

// Helper to check if a service uses credits system
export function isCreditsBasedService(serviceType: ServiceTypeFirestore): boolean {
  return serviceType in SERVICE_CREDITS_COST && SERVICE_CREDITS_COST[serviceType as keyof typeof SERVICE_CREDITS_COST] > 0;
}

// Helper to get credits cost for a service
export function getServiceCreditsCost(serviceType: ServiceTypeFirestore): number {
  if (serviceType in SERVICE_CREDITS_COST) {
    return SERVICE_CREDITS_COST[serviceType as keyof typeof SERVICE_CREDITS_COST];
  }
  return 0;
}

// Structure for the user's subscription data stored in Firestore (e.g., under /users/{uid})
export interface UserSubscriptionFs {
  plan: PlanName;
  status?: 'active' | 'canceled' | 'expired' | 'trialing'; // Subscription status
  startDate?: any; // Firestore Timestamp - when subscription started
  endDate?: any; // Firestore Timestamp or null
  subscriptionStartDate?: any; // Firestore Timestamp (legacy field, use startDate instead)
  // Other fields like stripeSubscriptionId might exist
}

// Structure for the user document in Firestore, focusing on parts relevant to rate limiting
export interface UserDocumentFs {
  currentSubscription?: UserSubscriptionFs;
  monthlyUsage?: {
    [cycleKey: string]: { // Cycle key determined by backend (e.g., YYYY-MM)
      [serviceKey in ServiceTypeFirestore]?: number;
    };
  };
  extraQuota?: {
    [serviceKey in ServiceTypeFirestore]?: number;
  };
  // other user fields
}


// Expected response structure from our frontend rate limit check function
export interface RateLimitCheckResult {
  allowed: boolean;
  reason: string; // e.g., "已達每日使用限制"
  plan: PlanName | null; // Current plan of the user
  limitTypeHit?: "monthly" | null;
  limitValue?: number | null;
  serviceChecked: ServiceTypeFirestore; // The specific service type that was checked
  nextResetDate?: string; // Optional: When the limit (monthly) is expected to reset
  usageCycleKey?: string | null; // The cycle key used for the monthly check
  creditsRequired?: number; // Required credits for the service
  creditsRemaining?: number; // Remaining credits in current cycle
}

// Helper to get current date string in YYYY-MM-DD format for Taipei (UTC+8)
export const getTodayDateString = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' locale gives YYYY-MM-DD
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date()); // Format current date in Taipei timezone
};
