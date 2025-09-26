"use client";

import { ImageAnalysisResult } from "@/utils/imageAnalysis";
import { GeneratedPage } from "@/utils/pageLayoutGenerator";
import { Code, Eye, Layers, Palette, Zap } from "lucide-react";

interface AnalysisFlowProps {
  analysis: ImageAnalysisResult | null;
  generatedPage: GeneratedPage | null;
  analysisMethod: "vision" | "canvas" | "failed";
  codeQuality: number;
}

export default function AnalysisFlow({
  analysis,
  generatedPage,
  analysisMethod,
  codeQuality,
}: AnalysisFlowProps) {
  if (!analysis) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Analysis Flow Debug
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Method Used */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Eye className="w-3 h-3 text-blue-600" />
            <span className="font-medium text-blue-700">Analysis Method</span>
          </div>
          <div className="space-y-1">
            <div
              className={`px-2 py-1 rounded text-xs ${
                analysisMethod === "vision"
                  ? "bg-green-100 text-green-700"
                  : analysisMethod === "canvas"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {analysisMethod === "vision"
                ? "🤖 GPT Vision AI"
                : analysisMethod === "canvas"
                ? "🖼️ Canvas Analysis"
                : "❌ Failed"}
            </div>
            {codeQuality > 0 && (
              <div
                className={`px-2 py-1 rounded text-xs ${
                  codeQuality >= 85
                    ? "bg-green-100 text-green-700"
                    : codeQuality >= 70
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {codeQuality}% Quality
              </div>
            )}
          </div>
        </div>

        {/* Components Detected */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Layers className="w-3 h-3 text-purple-600" />
            <span className="font-medium text-blue-700">Components</span>
          </div>
          <div className="space-y-1">
            <div>Total: {analysis.elements.length}</div>
            {analysis.elements.slice(0, 4).map((element, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded"></div>
                <span className="capitalize">{element.type}</span>
                <span className="text-gray-500">
                  ({Math.round(element.confidence * 100)}%)
                </span>
              </div>
            ))}
            {analysis.elements.length > 4 && (
              <div className="text-gray-500">
                +{analysis.elements.length - 4} more...
              </div>
            )}
          </div>
        </div>

        {/* Layout Analysis */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Code className="w-3 h-3 text-green-600" />
            <span className="font-medium text-blue-700">Layout</span>
          </div>
          <div className="space-y-1">
            <div>
              Type:{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                {analysis.layout.type}
              </span>
            </div>
            {analysis.layout.direction && (
              <div>
                Direction:{" "}
                <span className="font-mono bg-gray-100 px-1 rounded">
                  {analysis.layout.direction}
                </span>
              </div>
            )}
            {analysis.layout.gap && <div>Gap: {analysis.layout.gap}px</div>}
            {analysis.pageLayout && (
              <div>
                Page:{" "}
                <span className="font-mono bg-gray-100 px-1 rounded">
                  {analysis.pageLayout.type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Palette className="w-3 h-3 text-pink-600" />
            <span className="font-medium text-blue-700">Colors</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.dominant }}
              />
              <span className="font-mono text-xs">
                {analysis.colors.dominant}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.background }}
              />
              <span className="font-mono text-xs">
                {analysis.colors.background}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.accent }}
              />
              <span className="font-mono text-xs">
                {analysis.colors.accent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Generation Status */}
      <div className="mt-4 pt-3 border-t border-blue-200">
        <div className="text-xs text-blue-700 space-y-1">
          <div>
            📏 Dimensions: {analysis.dimensions.width}×
            {analysis.dimensions.height}
          </div>
          {generatedPage && (
            <div>
              📄 Generated: {Object.keys(generatedPage.sections).length}{" "}
              sections
            </div>
          )}
          <div>
            🔧 Generator:{" "}
            {analysisMethod === "vision"
              ? "ChakraV3Generator"
              : "CanvasGenerator"}
          </div>
        </div>
      </div>
    </div>
  );
}
