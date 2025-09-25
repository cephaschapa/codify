"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Download, Play, Code } from "lucide-react";
import copy from "copy-to-clipboard";

interface CodeOutputProps {
  code: string;
  isProcessing: boolean;
}

export default function CodeOutput({ code, isProcessing }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.tsx";
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

  if (!code) {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              component.tsx
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
          >
            {copied ? (
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
            onClick={handleDownload}
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
      </div>

      {/* Code Content */}
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
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
