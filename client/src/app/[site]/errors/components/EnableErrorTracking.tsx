"use client";

import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { updateSiteConfig } from "../../../../api/admin/endpoints";
import { useGetSite } from "../../../../api/admin/hooks/useSites";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import { Button } from "../../../../components/ui/button";

export function EnableErrorTracking() {
  const params = useParams();
  const siteId = Number(params.site);
  const { data: siteMetadata, refetch } = useGetSite(siteId);

  if (siteMetadata?.trackErrors) return null;

  return (
    <Alert className="p-4 bg-neutral-50/50 border-neutral-200/50 dark:bg-neutral-800/25 dark:border-amber-600/80">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-neutral-100" />
        <div className="flex-1">
          <AlertTitle className="text-base font-semibold mb-1 text-neutral-700/90 dark:text-neutral-100">
            {/* Error Tracking is Disabled */}
            错误追踪功能尚未启动
          </AlertTitle>
          <AlertDescription className="text-sm text-neutral-700/80 dark:text-neutral-300/80">
            <div className="mb-2">
              {/* Error tracking captures JavaScript errors and exceptions from your application. <b>Note:</b> Enabling
              error tracking will increase your event usage. */}
              错误追踪功能会追踪您的页面上发生的JavaScript错误 <b>注意:</b> 开启错误追踪功能会增加您收到的事件数量
            </div>
            <Button
              size="sm"
              variant="success"
              onClick={async () => {
                await updateSiteConfig(siteId, { trackErrors: true });
                // toast.success("Error tracking enabled");
                toast.success("错误追踪功能已启动");
                refetch();
              }}
            >
              {/* Enable */}
              启动
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
