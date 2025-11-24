"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { CaseResponse } from "@/types/project";

interface CreateProjectProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onProjectCreated?: (project: CaseResponse) => void; // <-- add callback prop
}

export function CreateProject({ open, setOpen, onProjectCreated }: CreateProjectProps) {
  const { createCase } = useProject();
  const [newCase, setNewCase] = useState({
    title: "",
    case_facts: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCase = async () => {
    if (!newCase.title) return;
    try {
      setIsCreating(true);
      const newCaseResponse: CaseResponse = await createCase({
        title: newCase.title,
        case_facts: newCase.case_facts
      });
      setNewCase({ title: "", case_facts: ""});
      setOpen(false);
      onProjectCreated?.(newCaseResponse);
    } catch (error) {
      // 可加上錯誤提示
      console.error('建立案件失敗:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">建立新案件</DialogTitle>
          <DialogDescription>
            輸入案件背景資訊
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">案件標題 *</Label>
            <Input
              id="title"
              value={newCase.title}
              onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例：我的專案"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="case_facts" className="text-lg">案件事實</Label>
            <Textarea
              id="case_facts"
              value={newCase.case_facts}
              onChange={(e) => setNewCase(prev => ({ ...prev, case_facts: e.target.value }))}
              placeholder="請詳細描述案件事實..."
              rows={4}
              className="text-base md:text-base"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleCreateCase}
            disabled={!newCase.title || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                建立中...
              </>
            ) : (
              '建立案件'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
