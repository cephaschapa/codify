"use client";

import { useState } from "react";
import { Code, Layout, Eye, Copy, Download, Play } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import copy from "copy-to-clipboard";
import { ImageAnalysisResult } from "@/utils/imageAnalysis";
import { GeneratedPage } from "@/utils/pageLayoutGenerator";

interface TabbedOutputProps {
  generatedPage: GeneratedPage;
  analysis: ImageAnalysisResult | null;
  isProcessing: boolean;
}

export default function TabbedOutput({
  generatedPage,
  analysis,
  isProcessing,
}: TabbedOutputProps) {
  const [activeTab, setActiveTab] = useState<"component" | "page" | "preview">(
    "component"
  );
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (content: string, type: string) => {
    copy(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                Analyzing your design
              </p>
              <p className="text-gray-600">Generating ChakraUI components...</p>
              <div className="flex items-center justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedPage.componentCode && !generatedPage.fullPageCode) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Code className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Generated code will appear here
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Upload a design to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "component",
      label: "Component",
      icon: Code,
      content: generatedPage.componentCode,
    },
    {
      id: "page",
      label: "Page Layout",
      icon: Layout,
      content: generatedPage.fullPageCode,
      available: generatedPage.fullPageCode !== generatedPage.componentCode,
    },
    {
      id: "preview",
      label: "Live Preview",
      icon: Eye,
      content: null,
    },
  ];

  const currentContent =
    activeTab === "component"
      ? generatedPage.componentCode
      : activeTab === "page"
      ? generatedPage.fullPageCode
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Tab Headers */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAvailable = tab.available !== false;

            return (
              <button
                key={tab.id}
                onClick={() => isAvailable && setActiveTab(tab.id as any)}
                disabled={!isAvailable}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : isAvailable
                      ? "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      : "text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === "page" && !isAvailable && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-1 rounded">
                    Single Component
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        {activeTab !== "preview" && currentContent && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleCopy(currentContent, activeTab)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleDownload(
                  currentContent,
                  activeTab === "page" ? "page.tsx" : "component.tsx"
                )
              }
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow">
              <Play className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === "preview" ? (
          <LivePreview generatedPage={generatedPage} analysis={analysis} />
        ) : (
          <div className="max-h-96 overflow-auto">
            <SyntaxHighlighter
              language="tsx"
              style={oneLight}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                background: "transparent",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
              showLineNumbers
              lineNumberStyle={{
                color: "#9CA3AF",
                fontSize: "12px",
                paddingRight: "1rem",
              }}
            >
              {currentContent || "// No code generated"}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}

// Live Preview Component
function LivePreview({
  generatedPage,
  analysis,
}: {
  generatedPage: GeneratedPage;
  analysis: ImageAnalysisResult | null;
}) {
  if (!analysis) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No preview available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-96">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Live Component Preview
        </h3>
        <div className="text-xs text-gray-500">
          {analysis.elements.length} elements •{" "}
          {analysis.pageLayout?.type || "component"} layout
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <iframe
          srcDoc={generatePreviewHTML(generatedPage, analysis)}
          className="w-full h-96 border-0 rounded"
          title="Component Preview"
        />
      </div>

      {analysis.pageLayout && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Page Layout Detected
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>Type: {analysis.pageLayout.type}</div>
            <div>Structure: {analysis.pageLayout.structure}</div>
            <div>
              Sections:{" "}
              {analysis.pageLayout.sections.map((s) => s.name).join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generatePreviewHTML(
  generatedPage: GeneratedPage,
  analysis: ImageAnalysisResult
): string {
  // This would generate a complete HTML preview with Chakra UI
  // For now, we'll show a simplified preview
  const { colors, elements } = analysis;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Component Preview</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: ${colors.background};
          color: ${colors.text};
        }
        .component { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          max-width: 400px;
          margin: 0 auto;
        }
        .button { 
          padding: 12px 24px; 
          background: ${colors.accent}; 
          color: white; 
          border: none; 
          border-radius: 8px; 
          cursor: pointer;
          font-weight: 500;
        }
        .text { 
          color: ${colors.text}; 
          line-height: 1.5; 
        }
        .heading { 
          font-size: 24px; 
          font-weight: bold; 
          margin: 0; 
        }
        .input { 
          padding: 12px; 
          border: 1px solid #e2e8f0; 
          border-radius: 6px; 
          width: 100%;
          box-sizing: border-box;
        }
        .card { 
          padding: 20px; 
          background: white; 
          border-radius: 12px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
      </style>
    </head>
    <body>
      <div class="component">
  `;

  elements.forEach((element, index) => {
    const content = element.content || `${element.type} ${index + 1}`;

    switch (element.type) {
      case "button":
        html += `<button class="button">${content}</button>\n`;
        break;
      case "text":
        const isHeading =
          element.properties?.fontWeight === "bold" ||
          element.bounds.height > 30;
        if (isHeading) {
          html += `<h2 class="heading">${content}</h2>\n`;
        } else {
          html += `<p class="text">${content}</p>\n`;
        }
        break;
      case "input":
        html += `<input class="input" placeholder="${content}" />\n`;
        break;
      case "card":
        html += `<div class="card"><p class="text">${content}</p></div>\n`;
        break;
      default:
        html += `<div class="text">${content}</div>\n`;
    }
  });

  html += `
      </div>
    </body>
    </html>
  `;

  return html;
}

// Missing import for Check icon
import { Check } from "lucide-react";
