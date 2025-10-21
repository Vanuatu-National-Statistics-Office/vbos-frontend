import { useEffect } from "react";
import { useAreaStore } from "@/store/area-store";
import { useLayerStore } from "@/store/layer-store";

export const useUrlSync = () => {
  const { syncFromUrl: syncAreaFromUrl } = useAreaStore();
  const { syncFromUrl: syncLayersFromUrl } = useLayerStore();

  useEffect(() => {
    // Sync from URL on mount
    syncAreaFromUrl();
    syncLayersFromUrl();

    // Listen for URL changes (browser back/forward)
    const handlePopState = () => {
      syncAreaFromUrl();
      syncLayersFromUrl();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncAreaFromUrl, syncLayersFromUrl]);
};
