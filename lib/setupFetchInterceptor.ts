"use client";

import { showGlobalSnackbar } from "@/utils/globalSnackbar";

export function setupFetchInterceptor() {
  if (typeof window === "undefined") return;
  if ((window as any)._fetchPatched) return;
  (window as any)._fetchPatched = true;

  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [input, options] = args;

    try {
      const res = await originalFetch(input, options);

      const contentType = res.headers.get("content-type");
      let data: any = null;
      if (contentType?.includes("application/json")) {
        data = await res
          .clone()
          .json()
          .catch(() => null);
      }

      if (res.status === 401) {
        showGlobalSnackbar(data.error || data.message, "error");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return res;
      }

      // ✅ Success message
      if (res.ok && data?.message) {
        showGlobalSnackbar(data.message, "success");
      }

      // ❌ Error message
      if (!res.ok && (data?.error || data?.message)) {
        showGlobalSnackbar(data.error || data.message, "error");
      }

      return res;
    } catch (err) {
      showGlobalSnackbar("Network error. Please try again.", "error");
      throw err;
    }
  };
}
