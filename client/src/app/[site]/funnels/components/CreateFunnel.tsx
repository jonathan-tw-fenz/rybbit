"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetFunnel, useSaveFunnel } from "../../../../api/analytics/hooks/funnels/useGetFunnel";
import { FunnelStep } from "../../../../api/analytics/endpoints";
import { FunnelForm } from "./FunnelForm";

export function CreateFunnelDialog() {
  const [open, setOpen] = useState(false);

  // Funnel steps state
  const [steps, setSteps] = useState<FunnelStep[]>([
    { type: "page", value: "/", name: "Homepage" },
    { type: "page", value: "", name: "" },
  ]);

  // Funnel name
  // const [name, setName] = useState("New Funnel");
  const [name, setName] = useState("新漏斗");

  // Funnel analysis query
  const {
    data,
    isError,
    error,
    isLoading: isPending,
  } = useGetFunnel(
    steps.some(step => !step.value)
      ? undefined
      : {
          steps,
        },
    true
  );

  // Funnel save mutation
  const { mutate: saveFunnel, isPending: isSaving, error: saveError } = useSaveFunnel();

  // Query funnel without saving
  const handleQueryFunnel = () => {
    // Validate steps have values
    const hasEmptySteps = steps.some(step => !step.value);
    if (hasEmptySteps) {
      // alert("All steps must have values");
      alert("不能有步骤为空");
      return;
    }
  };

  // Save funnel configuration
  const handleSaveFunnel = () => {
    // Validate name
    if (!name.trim()) {
      // alert("Please enter a funnel name");
      alert("请输入漏斗名称");
      return;
    }

    // Validate steps have values
    const hasEmptySteps = steps.some(step => !step.value);
    if (hasEmptySteps) {
      // alert("All steps must have values");
      alert("不能有步骤为空");
      return;
    }

    // Save funnel directly without analyzing
    saveFunnel(
      {
        steps,
        name,
      },
      {
        onSuccess: () => {
          // Close dialog on successful save
          setOpen(false);
          // Optional: Show success message
          // toast?.success("Funnel saved successfully");
          toast?.success("漏斗储存成功");
        },
        onError: error => {
          // Show error but don't close dialog
          // toast?.error(`Failed to save funnel: ${error.message}`);
          toast?.error(`漏斗储存失败: ${error.message}`);
        },
      }
    );
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSteps([
        { type: "page", value: "/", name: "Homepage" },
        { type: "page", value: "", name: "" },
      ]);
      // setName("New Funnel");
      setName("新漏斗");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          {/* <Plus className="w-4 h-4" /> Create Funnel */}
          <Plus className="w-4 h-4" /> 创建漏斗
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>
            {/* Create Funnel */}
            创建漏斗
          </DialogTitle>
        </DialogHeader>

        <FunnelForm
          name={name}
          setName={setName}
          steps={steps}
          setSteps={setSteps}
          onSave={handleSaveFunnel}
          onCancel={() => setOpen(false)}
          onQuery={handleQueryFunnel}
          // saveButtonText="Save Funnel"
          saveButtonText="储存漏斗"
          isSaving={isSaving}
          isError={isError}
          isPending={isPending}
          error={error}
          saveError={saveError}
          funnelData={data}
        />
      </DialogContent>
    </Dialog>
  );
}
