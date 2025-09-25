"use client";

import { ImageAnalysisResult } from "@/utils/imageAnalysis";
import { Palette, Layout, Eye } from "lucide-react";

interface AnalysisDebugProps {
  analysis: ImageAnalysisResult | null;
}

export default function AnalysisDebug({ analysis }: AnalysisDebugProps) {
  if (!analysis) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Analysis Debug Info
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Colors */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Palette className="w-3 h-3 text-blue-600" />
            <span className="font-medium text-gray-700">Colors</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.dominant }}
              />
              <span>Dominant: {analysis.colors.dominant}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.background }}
              />
              <span>Background: {analysis.colors.background}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: analysis.colors.accent }}
              />
              <span>Accent: {analysis.colors.accent}</span>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Layout className="w-3 h-3 text-green-600" />
            <span className="font-medium text-gray-700">Layout</span>
          </div>
          <div className="space-y-1">
            <div>Type: {analysis.layout.type}</div>
            {analysis.layout.direction && (
              <div>Direction: {analysis.layout.direction}</div>
            )}
            {analysis.layout.alignment && (
              <div>Align: {analysis.layout.alignment}</div>
            )}
            {analysis.layout.gap && <div>Gap: {analysis.layout.gap}px</div>}
            {analysis.layout.padding && (
              <div>Padding: {analysis.layout.padding}px</div>
            )}
          </div>
        </div>

        {/* Elements */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-purple-600 rounded" />
            <span className="font-medium text-gray-700">Elements</span>
          </div>
          <div className="space-y-1">
            <div>Count: {analysis.elements.length}</div>
            <div>
              Size: {analysis.dimensions.width}×{analysis.dimensions.height}
            </div>
            {analysis.elements.slice(0, 3).map((element, index) => (
              <div key={index} className="truncate">
                {element.type} ({Math.round(element.confidence * 100)}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
