"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react"; // Using AlertTriangle for warning
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface RateLimitBannerProps {
  title: string;
  description?: string;
  limitTypeHit?: "monthly" | string | null; // To provide more specific info if needed
  limitValue?: number | null;
  userPlan?: string | null;
  onClose: () => void;
  onUpgrade?: () => void; // Optional, if not provided, button can link to /billing
}

export const RateLimitBanner: React.FC<RateLimitBannerProps> = ({
  title,
  description,
  onClose,
  onUpgrade,
}) => {
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push("/billing"); // Default upgrade action
    }
  };

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-10 bg-yellow-500 border-b border-yellow-600 text-yellow-900 p-3 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3 text-yellow-700" />
          <div>
            <p className="font-semibold text-sm sm:text-base">{title}</p>
            <p className="text-xs sm:text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpgradeClick}
            className="bg-yellow-50 border-yellow-600 hover:bg-yellow-100 text-yellow-800 hover:text-yellow-900 text-xs sm:text-sm px-2 py-1 h-auto sm:px-3"
          >
            升級方案
          </Button>
          <Button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-yellow-600/20 focus:outline-none focus:ring-2 focus:ring-yellow-700"
            aria-label="關閉通知"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
