"use client";

import { useState, useEffect } from "react";
import { Eye, AlertTriangle, Check } from "lucide-react";

export default function VisionStatus() {
  const [apiKeyStatus, setApiKeyStatus] = useState<
    "checking" | "found" | "missing"
  >("checking");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith("sk-")) {
      setApiKeyStatus("found");
    } else {
      setApiKeyStatus("missing");
    }
  }, []);

  if (apiKeyStatus === "checking") {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      {apiKeyStatus === "found" ? (
        <div className="flex items-center gap-2 bg-green-100 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm">
          <Eye className="w-4 h-4" />
          Vision AI Ready
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm max-w-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-medium">Vision AI Disabled</div>
            <div className="text-xs opacity-75">
              Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
