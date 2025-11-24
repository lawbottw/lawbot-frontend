"use client"

import { Button } from "@/components/ui/button";
import { Atom, BrainCircuit, FolderClosed, Globe, Lightbulb, X } from "lucide-react";

interface ActiveFeaturesProps {
  activeFeatures: string[];
  loading?: boolean;
  isDeepResearchLoading?: boolean;
  submitDisabled?: boolean;
  selectedProject?: { title?: string | null } | null;
  onRemove: (feature: string) => void;
}

export function ActiveFeatures({
  activeFeatures,
  loading,
  isDeepResearchLoading,
  submitDisabled,
  selectedProject,
  onRemove,
}: ActiveFeaturesProps) {
  if (activeFeatures.length === 0) return null;

  return (
    <div className="flex items-center sm:gap-1">
      {activeFeatures.map((feature) => (
        <Button
          key={feature}
          variant="ghost"
          size="sm"
          onClick={() => onRemove(feature)}
          disabled={loading || isDeepResearchLoading || submitDisabled}
          className="lg:text-base text-blue-500 hover:text-blue-500 rounded-xl"
        >
          {feature === "思考" && <Lightbulb className="h-3 w-3" />}
          {feature === "研究" && <BrainCircuit className="h-3 w-3" />}
          {feature === "代理" && <Atom className="h-3 w-3" />}
          {feature === "搜尋" && <Globe className="h-3 w-3" />}
          {feature === "專案" && <FolderClosed className="h-3 w-3" />}
          <span className='hidden md:flex'>{feature === "專案" ? selectedProject?.title : feature}</span>
          <X className="hidden sm:flex h-3 w-3" />
        </Button>
      ))}
    </div>
  );
}
