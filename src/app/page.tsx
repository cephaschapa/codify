"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import CodeOutput from "@/components/CodeOutput";
import AnalysisDebug from "@/components/AnalysisDebug";
import VisionStatus from "@/components/VisionStatus";
import TabbedOutput from "@/components/TabbedOutput";
import AnalysisFlow from "@/components/AnalysisFlow";
import { Upload, Code, Eye } from "lucide-react";
import { ImageAnalyzer, ImageAnalysisResult } from "@/utils/imageAnalysis";
import {
  VisionAnalyzer,
  generateEnhancedChakraCode,
} from "@/utils/visionAnalysis";
import { generatePageLayout, GeneratedPage } from "@/utils/pageLayoutGenerator";
import { generateDetailedChakraCode } from "@/utils/detailedCodeGenerator";
import { CodeRefinementEngine } from "@/utils/codeRefinement";
import { generateChakraV3Code } from "@/utils/chakraV3Generator";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<ImageAnalysisResult | null>(null);
  const [analysisMethod, setAnalysisMethod] = useState<
    "vision" | "canvas" | "failed"
  >("canvas");
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(
    null
  );
  const [codeQuality, setCodeQuality] = useState<number>(0);

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsProcessing(true);

    try {
      let analysis: ImageAnalysisResult | null = null;
      let method: "vision" | "canvas" | "failed" = "failed";

      // Try Vision AI first (if API key is available)
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      console.log(
        "🔑 API Key status:",
        apiKey ? `Found (${apiKey.substring(0, 7)}...)` : "Not found"
      );

      if (apiKey && apiKey.startsWith("sk-")) {
        console.log("🔍 Attempting Vision AI analysis...");
        try {
          const visionAnalyzer = new VisionAnalyzer({
            apiKey,
            enableVision: true,
            fallbackToCanvas: true,
          });

          analysis = await visionAnalyzer.analyzeWithVision(imageUrl);
          if (analysis) {
            method = "vision";
            console.log("✅ Vision AI analysis successful!", analysis);
          } else {
            console.log("❌ Vision AI returned null result");
          }
        } catch (visionError) {
          console.error("❌ Vision AI failed:", visionError);
        }
      } else {
        console.log(
          "⚠️ No valid OpenAI API key found. Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local"
        );
      }

      // Fallback to Canvas analysis if Vision fails or unavailable
      if (!analysis) {
        console.log("🖼️ Falling back to Canvas analysis...");
        const canvasAnalyzer = new ImageAnalyzer();
        analysis = await canvasAnalyzer.analyzeImage(imageUrl);
        if (analysis) {
          method = "canvas";
          console.log("✅ Canvas analysis completed");
        }
      }

      if (analysis) {
        setAnalysisResult(analysis);
        setAnalysisMethod(method);

        // Generate page layouts (which will handle component generation with v3 patterns)
        const pageLayout = generatePageLayout(analysis);
        setGeneratedPage(pageLayout);

        // Generate initial code using pure v3 patterns - must match generatedPage for consistency
        let generatedCode =
          method === "vision"
            ? generateChakraV3Code(analysis)
            : generateChakraCode(analysis);

        console.log(
          "🔧 Generated code method:",
          method === "vision" ? "generateChakraV3Code" : "generateChakraCode"
        );

        // Refine the code for maximum accuracy
        if (method === "vision") {
          console.log("🔄 Refining code for maximum accuracy...");
          const refinementEngine = new CodeRefinementEngine();
          const refinedResult = await refinementEngine.refineGeneratedCode(
            generatedCode,
            analysis
          );

          generatedCode = refinedResult.finalCode;
          setCodeQuality(refinedResult.qualityScore);

          console.log(
            `✨ Code quality improved to ${refinedResult.qualityScore}%`
          );
          console.log(
            "Refinement iterations:",
            refinedResult.iterations.length
          );
        }

        setGeneratedCode(generatedCode);
      } else {
        throw new Error("Both Vision and Canvas analysis failed");
      }
    } catch (error) {
      console.error("All analysis methods failed:", error);
      setAnalysisMethod("failed");

      // Fallback to mock code
      const mockCode = generateMockCode();
      setGeneratedCode(mockCode);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateChakraCode = (analysis: ImageAnalysisResult): string => {
    const { colors, elements, layout, dimensions } = analysis;

    // Determine imports based on layout and elements
    const imports = generateImports(layout, elements);

    let component = `export const GeneratedComponent = () => {\n`;
    component += `  return (\n`;

    // Generate container based on sophisticated layout analysis
    const containerCode = generateContainer(layout, colors, elements);
    component += containerCode;

    return imports + component;
  };

  const generateImports = (layout: any, elements: any[]): string => {
    const baseImports = new Set(["Box", "Text"]);

    // Add layout-specific imports
    if (layout.type === "flex") {
      if (layout.direction === "row") {
        baseImports.add("HStack");
      } else {
        baseImports.add("VStack");
      }
    } else if (layout.type === "grid") {
      baseImports.add("Grid");
      baseImports.add("GridItem");
    } else {
      baseImports.add("Flex");
    }

    // Add element-specific imports
    elements.forEach((element) => {
      switch (element.type) {
        case "button":
          baseImports.add("Button");
          break;
        case "input":
          baseImports.add("Input");
          break;
        case "image":
          baseImports.add("Image");
          break;
      }
    });

    return `import { ${Array.from(baseImports)
      .sort()
      .join(", ")} } from '@chakra-ui/react';\n\n`;
  };

  const generateContainer = (
    layout: any,
    colors: any,
    elements: any[]
  ): string => {
    const padding = layout.padding
      ? `{${Math.max(4, Math.min(layout.padding / 4, 12))}`
      : "{6}";
    const gap = layout.gap ? Math.max(2, Math.min(layout.gap / 8, 8)) : 4;

    const baseProps = [
      `bg="${colors.background}"`,
      `p=${padding}`,
      `borderRadius="lg"`,
      `shadow="md"`,
      `maxW="2xl"`,
    ];

    let containerCode = "";
    let closingTag = "";

    switch (layout.type) {
      case "grid":
        const gridCols = estimateGridColumns(elements);
        baseProps.push(`templateColumns="repeat(${gridCols}, 1fr)"`);
        baseProps.push(`gap={${gap}}`);
        containerCode += `    <Grid ${baseProps.join(" ")}>\n`;
        closingTag = `    </Grid>\n`;
        break;

      case "flex":
        const flexProps = [...baseProps];
        if (layout.direction === "row") {
          flexProps.push(`spacing={${gap}}`);
          if (layout.alignment && layout.alignment !== "start") {
            flexProps.push(`justify="${layout.alignment}"`);
          }
          containerCode += `    <HStack ${flexProps.join(" ")}>\n`;
          closingTag = `    </HStack>\n`;
        } else {
          flexProps.push(`spacing={${gap}}`);
          if (layout.alignment && layout.alignment !== "start") {
            flexProps.push(`align="${layout.alignment}"`);
          }
          containerCode += `    <VStack ${flexProps.join(" ")}>\n`;
          closingTag = `    </VStack>\n`;
        }
        break;

      default:
        baseProps.push(`display="flex"`);
        baseProps.push(`flexDirection="column"`);
        baseProps.push(`gap={${gap}}`);
        containerCode += `    <Box ${baseProps.join(" ")}>\n`;
        closingTag = `    </Box>\n`;
    }

    // Generate elements
    containerCode += generateElements(elements, layout, colors);
    containerCode += closingTag;
    containerCode += `  );\n`;
    containerCode += `};`;

    return containerCode;
  };

  const generateElements = (
    elements: any[],
    layout: any,
    colors: any
  ): string => {
    if (elements.length === 0) {
      return `      <Text fontSize="xl" fontWeight="bold" color="${colors.text}">\n        Generated from Design\n      </Text>\n      <Text color="${colors.text}" opacity={0.8}>\n        No elements detected - upload a design with clear UI components\n      </Text>\n`;
    }

    let elementsCode = "";

    elements.forEach((element, index) => {
      const elementBg = element.colors.background || colors.accent;
      const isGridLayout = layout.type === "grid";
      const indent = "      ";

      let elementCode = "";

      switch (element.type) {
        case "text":
          elementCode = `${indent}<Text fontSize="lg" color="${
            colors.text
          }" fontWeight="medium">Sample Text ${index + 1}</Text>\n`;
          break;

        case "button":
          const buttonSize =
            element.bounds.height > 50
              ? "lg"
              : element.bounds.height > 35
              ? "md"
              : "sm";
          elementCode = `${indent}<Button\n${indent}  bg="${elementBg}"\n${indent}  color="${
            colors.text
          }"\n${indent}  size="${buttonSize}"\n${indent}  _hover={{ opacity: 0.8 }}\n${indent}  borderRadius="md"\n${indent}>\n${indent}  Button ${
            index + 1
          }\n${indent}</Button>\n`;
          break;

        case "card":
          elementCode = `${indent}<Box\n${indent}  p={6}\n${indent}  bg="${elementBg}"\n${indent}  borderRadius="lg"\n${indent}  shadow="md"\n${indent}  border="1px"\n${indent}  borderColor="gray.200"\n${indent}>\n${indent}  <Text fontSize="lg" fontWeight="semibold" color="${
            colors.text
          }" mb={2}>\n${indent}    Card Title ${
            index + 1
          }\n${indent}  </Text>\n${indent}  <Text color="${
            colors.text
          }" opacity={0.8}>\n${indent}    Card content and description goes here.\n${indent}  </Text>\n${indent}</Box>\n`;
          break;

        case "input":
          const inputSize =
            element.bounds.height > 50
              ? "lg"
              : element.bounds.height > 35
              ? "md"
              : "sm";
          elementCode = `${indent}<Input\n${indent}  placeholder="Input field ${
            index + 1
          }"\n${indent}  size="${inputSize}"\n${indent}  bg="${elementBg}"\n${indent}  borderRadius="md"\n${indent}  border="1px"\n${indent}  borderColor="gray.300"\n${indent}  _focus={{ borderColor: "${
            colors.accent
          }", boxShadow: "0 0 0 1px ${colors.accent}" }}\n${indent}/>\n`;
          break;

        case "image":
          const imgWidth = Math.min(element.bounds.width / 4, 200);
          const imgHeight = Math.min(element.bounds.height / 4, 150);
          elementCode = `${indent}<Box\n${indent}  w="${imgWidth}px"\n${indent}  h="${imgHeight}px"\n${indent}  bg="${elementBg}"\n${indent}  borderRadius="md"\n${indent}  display="flex"\n${indent}  alignItems="center"\n${indent}  justifyContent="center"\n${indent}  border="2px dashed"\n${indent}  borderColor="gray.300"\n${indent}>\n${indent}  <Text fontSize="sm" color="${
            colors.text
          }" opacity={0.6}>\n${indent}    Image ${
            index + 1
          }\n${indent}  </Text>\n${indent}</Box>\n`;
          break;

        default:
          elementCode = `${indent}<Box\n${indent}  p={4}\n${indent}  bg="${elementBg}"\n${indent}  borderRadius="md"\n${indent}  border="1px"\n${indent}  borderColor="gray.200"\n${indent}>\n${indent}  <Text fontSize="sm" color="${
            colors.text
          }">\n${indent}    Element ${
            index + 1
          }\n${indent}  </Text>\n${indent}</Box>\n`;
      }

      // Wrap in GridItem if it's a grid layout
      if (isGridLayout) {
        elementsCode += `${indent}<GridItem>\n${elementCode.replace(
          /^      /gm,
          "        "
        )}${indent}</GridItem>\n`;
      } else {
        elementsCode += elementCode;
      }
    });

    return elementsCode;
  };

  const estimateGridColumns = (elements: any[]): number => {
    // Simple heuristic to estimate grid columns based on element positions
    if (elements.length < 2) return 1;
    if (elements.length < 4) return 2;

    // Group elements by approximate Y position to find rows
    const tolerance = 50;
    const rows = new Map<number, number>();

    elements.forEach((element) => {
      const rowKey = Math.round(element.bounds.y / tolerance) * tolerance;
      rows.set(rowKey, (rows.get(rowKey) || 0) + 1);
    });

    // Return the maximum number of elements in any row
    return Math.min(Math.max(...rows.values()), 4);
  };

  const generateMockCode = (): string => {
    return `import { Box, Text, Button, VStack, HStack } from '@chakra-ui/react';

export const GeneratedComponent = () => {
  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md" maxW="md">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          Analysis in Progress
        </Text>
        <Text color="gray.600">
          Image analysis is being developed. This is a placeholder component.
        </Text>
        <HStack spacing={3}>
          <Button colorScheme="blue" size="sm">
            Primary Action
          </Button>
          <Button variant="outline" size="sm">
            Secondary
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
      <VisionStatus />
      {/* Header */}
      <header className="flex justify-center bg-white/80 backdrop-blur-sm border-b border-gray-200/50 top-0 z-50 w-full">
        <div className="mx-auto w-[1090px] sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold text-gray-900">
                  Design to Code
                </p>
                <p className="text-xs text-gray-500">ChakraUI Generator</p>
              </div>
            </div>
            <nav className="flex gap-1">
              <button className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200">
                Transform
              </button>
              <button className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200">
                Examples
              </button>
              <button className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200">
                About
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-[1090px] mx-auto h-full w-full">
          {!uploadedImage ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-12 flex flex-col gap-12">
                <div className="relative flex flex-col gap-6 items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
                  <Upload className="relative mx-auto h-16 w-16 text-blue-500" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Transform designs into{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    ChakraUI
                  </span>{" "}
                  components
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Upload a design snapshot or component mockup, and we'll
                  generate clean, production-ready ChakraUI React code for you
                  in seconds.
                </p>
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Upload Design</p>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Code className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Generate Code</p>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Preview & Export</p>
                  </div>
                </div>
              </div>
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Left Panel - Image */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Design Input</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {analysisMethod === "vision" && (
                      <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        <Eye className="w-3 h-3" />
                        Vision AI
                      </div>
                    )}
                    {analysisMethod === "canvas" && (
                      <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        <Code className="w-3 h-3" />
                        Canvas
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setGeneratedCode("");
                        setAnalysisResult(null);
                        setAnalysisMethod("canvas");
                        setGeneratedPage(null);
                        setCodeQuality(0);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      Upload New
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                  <img
                    src={uploadedImage}
                    alt="Uploaded design"
                    className="w-full h-auto rounded-xl shadow-md"
                  />
                  <AnalysisDebug analysis={analysisResult} />
                  <AnalysisFlow
                    analysis={analysisResult}
                    generatedPage={generatedPage}
                    analysisMethod={analysisMethod}
                    codeQuality={codeQuality}
                  />
                </div>
              </div>

              {/* Right Panel - Generated Code */}
              <div className="space-y-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Generated Code</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    {codeQuality > 0 && (
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
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
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        ChakraUI
                      </span>
                    </div>
                  </div>
                </div>
                <TabbedOutput
                  generatedPage={
                    generatedPage || {
                      fullPageCode: generatedCode,
                      componentCode: generatedCode,
                      imports: "",
                      sections: {},
                    }
                  }
                  analysis={analysisResult}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
