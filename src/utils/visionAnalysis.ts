import OpenAI from "openai";
import {
  ImageAnalysisResult,
  DetectedElement,
  LayoutAnalysis,
  ColorPalette,
} from "./imageAnalysis";

export interface VisionAnalysisConfig {
  apiKey?: string;
  enableVision: boolean;
  fallbackToCanvas: boolean;
}

export class VisionAnalyzer {
  private openai: OpenAI | null = null;
  private config: VisionAnalysisConfig;

  constructor(config: VisionAnalysisConfig) {
    this.config = config;

    if (config.enableVision && config.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, use a server-side proxy
      });
    }
  }

  async analyzeWithVision(
    imageUrl: string
  ): Promise<ImageAnalysisResult | null> {
    if (!this.openai) {
      console.warn("Vision API not configured");
      return null;
    }

    try {
      const prompt = this.buildAnalysisPrompt();

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1, // Low temperature for consistent analysis
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error("No response from Vision API");
      }

      return this.parseVisionResponse(analysisText);
    } catch (error) {
      console.error("Vision analysis failed:", error);
      return null;
    }
  }

  private buildAnalysisPrompt(): string {
    return `Analyze this UI design image and provide a detailed JSON response with the following structure:

{
  "colors": {
    "dominant": "#hex",
    "background": "#hex",
    "text": "#hex", 
    "accent": "#hex",
    "palette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]
  },
  "layout": {
    "type": "flex|grid|absolute",
    "direction": "row|column", 
    "alignment": "start|center|end|space-between|space-around",
    "gap": number,
    "padding": number
  },
  "elements": [
    {
      "type": "button|text|heading|input|textarea|select|checkbox|radio|switch|card|image|container|navigation|form|badge|alert|tooltip|modal|divider|breadcrumb|stepper|tabs|accordion|menu|avatar|icon|link|list|table|progress|spinner",
      "bounds": {"x": number, "y": number, "width": number, "height": number},
      "colors": {
        "background": "#hex",
        "text": "#hex", 
        "border": "#hex",
        "hover": "#hex",
        "focus": "#hex",
        "gradient": {"from": "#hex", "to": "#hex"}
      },
      "content": "actual text content if visible",
      "confidence": 0.0-1.0,
      "styling": {
        "fontSize": "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl",
        "fontWeight": "thin|light|normal|medium|semibold|bold|extrabold|black",
        "borderRadius": "none|sm|md|lg|xl|2xl|3xl|full",
        "shadow": "none|xs|sm|md|lg|xl|2xl|inner",
        "borderWidth": "0|1|2|4|8",
        "padding": {"top": number, "right": number, "bottom": number, "left": number},
        "margin": {"top": number, "right": number, "bottom": number, "left": number},
        "opacity": 0.0-1.0,
        "zIndex": number
      },
      "variant": "solid|outline|ghost|link|subtle|surface",
      "size": "xs|sm|md|lg|xl",
      "state": "default|hover|focus|active|disabled|loading",
      "formProperties": {
        "placeholder": "text",
        "required": boolean,
        "disabled": boolean,
        "type": "text|email|password|number|tel|url|search|date|time",
        "validation": "error|warning|success"
      },
      "accessibility": {
        "ariaLabel": "text",
        "role": "button|textbox|checkbox|radio|menu|etc"
      }
    }
  ],
  "dimensions": {"width": number, "height": number},
  "patterns": {
    "isForm": boolean,
    "isNavigation": boolean,
    "isCard": boolean,
    "isList": boolean,
    "isModal": boolean,
    "isHeader": boolean,
    "isFooter": boolean,
    "isSidebar": boolean,
    "isLandingPage": boolean,
    "isDashboard": boolean,
    "isBlogPost": boolean,
    "isProfilePage": boolean
  },
  "pageLayout": {
    "type": "landing|dashboard|blog|profile|form|ecommerce|documentation",
    "structure": "header-main-footer|sidebar-main|header-sidebar-main-footer|fullscreen",
    "sections": [
      {
        "name": "header|navigation|hero|content|sidebar|footer|cta",
        "bounds": {"x": number, "y": number, "width": number, "height": number},
        "elements": ["element_indices_in_this_section"]
      }
    ]
  }
}

Instructions:
1. Identify ALL UI elements with precise classification: buttons, headings, text, inputs, textareas, selects, checkboxes, radios, switches, cards, images, badges, alerts, links, lists, tables, avatars, icons, dividers, breadcrumbs, steppers, tabs, accordions, menus, modals, tooltips, progress bars, spinners
2. For BUTTONS: detect exact variant (solid/outline/ghost/link), size (xs/sm/md/lg/xl), border radius, shadow depth, hover/focus states, icon placement
3. For TEXT & HEADINGS: precise font size (xs to 6xl), font weight (thin to black), line height, letter spacing, text decoration, color, alignment
4. For FORM ELEMENTS: 
   - Inputs: type (text/email/password/etc), placeholder text, validation states, icons, helper text
   - Selects: options, placeholder, multi-select, styling
   - Checkboxes/Radios: checked state, label position, custom styling
   - Textareas: rows, resize behavior, placeholder
5. For LAYOUT: precise gap measurements, padding values, margin, alignment, responsive behavior
6. For VISUAL STYLING: exact border radius values, shadow types and depths, border widths, opacity levels, z-index stacking
7. For COLORS: extract gradients (linear/radial), hover states, focus states, disabled states, theme variations
8. For SPACING: measure exact pixel values for padding, margins, gaps between elements
9. For CONTAINERS: detect card styling, background overlays, backdrop blur, border styles
10. For ADVANCED ELEMENTS: badges with variants, alerts with icons, tooltips, modals with backdrops, progress indicators, loading states
11. For FORMS: group related form elements, detect validation styling, error states, success states
12. For NAVIGATION: detect menu types, breadcrumbs, tabs, steppers, active states
13. Be extremely precise with measurements - provide exact pixel values for all spacing, sizing, and positioning
14. Detect subtle visual details like inner shadows, border effects, gradient overlays, and transparency
15. Include hover/focus/active state styling when visible or implied by design context

Respond ONLY with valid JSON, no additional text.`;
  }

  private parseVisionResponse(response: string): ImageAnalysisResult | null {
    try {
      // Clean the response - sometimes GPT includes markdown code blocks
      const jsonStr = response.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(jsonStr);

      // Validate and transform the response to match our interface
      const result: ImageAnalysisResult = {
        colors: this.validateColors(parsed.colors),
        elements: this.validateElements(parsed.elements || []),
        layout: this.validateLayout(parsed.layout),
        dimensions: parsed.dimensions || { width: 800, height: 600 },
      };

      return result;
    } catch (error) {
      console.error("Failed to parse Vision response:", error);
      console.log("Raw response:", response);
      return null;
    }
  }

  private validateColors(colors: any): ColorPalette {
    return {
      dominant: colors?.dominant || "#ffffff",
      background: colors?.background || "#ffffff",
      text: colors?.text || "#000000",
      accent: colors?.accent || "#3b82f6",
      palette: Array.isArray(colors?.palette)
        ? colors.palette.slice(0, 5)
        : ["#ffffff", "#000000", "#3b82f6"],
    };
  }

  private validateElements(elements: any[]): DetectedElement[] {
    return elements
      .map((el) => ({
        type: this.validateElementType(el.type),
        bounds: {
          x: Number(el.bounds?.x) || 0,
          y: Number(el.bounds?.y) || 0,
          width: Number(el.bounds?.width) || 100,
          height: Number(el.bounds?.height) || 40,
        },
        colors: {
          background: el.colors?.background,
          text: el.colors?.text,
          border: el.colors?.border,
          hover: el.colors?.hover,
          focus: el.colors?.focus,
          gradient: el.colors?.gradient
            ? {
                from: el.colors.gradient.from,
                to: el.colors.gradient.to,
              }
            : undefined,
        },
        content: el.content || "",
        confidence: Number(el.confidence) || 0.8,
        styling: el.styling
          ? {
              fontSize: el.styling.fontSize,
              fontWeight: el.styling.fontWeight,
              borderRadius: el.styling.borderRadius,
              shadow: el.styling.shadow,
              borderWidth: el.styling.borderWidth,
              padding: el.styling.padding,
              margin: el.styling.margin,
              opacity: el.styling.opacity,
              zIndex: el.styling.zIndex,
            }
          : undefined,
        variant: el.variant,
        size: el.size,
        state: el.state,
        formProperties: el.formProperties,
        accessibility: el.accessibility,
      }))
      .filter((el) => el.bounds.width > 10 && el.bounds.height > 10); // Filter out tiny elements
  }

  private validateElementType(type: string): DetectedElement["type"] {
    const validTypes: DetectedElement["type"][] = [
      "button",
      "text",
      "heading",
      "input",
      "textarea",
      "select",
      "checkbox",
      "radio",
      "switch",
      "card",
      "image",
      "container",
      "navigation",
      "form",
      "badge",
      "alert",
      "tooltip",
      "modal",
      "divider",
      "breadcrumb",
      "stepper",
      "tabs",
      "accordion",
      "menu",
      "avatar",
      "icon",
      "link",
      "list",
      "table",
      "progress",
      "spinner",
    ];
    return validTypes.includes(type as any)
      ? (type as DetectedElement["type"])
      : "container";
  }

  private validateLayout(layout: any): LayoutAnalysis {
    const validTypes = ["flex", "grid", "absolute"];
    const validDirections = ["row", "column"];
    const validAlignments = [
      "start",
      "center",
      "end",
      "space-between",
      "space-around",
    ];

    return {
      type: validTypes.includes(layout?.type) ? layout.type : "absolute",
      direction: validDirections.includes(layout?.direction)
        ? layout.direction
        : undefined,
      alignment: validAlignments.includes(layout?.alignment)
        ? layout.alignment
        : undefined,
      gap: Number(layout?.gap) || undefined,
      padding: Number(layout?.padding) || undefined,
    };
  }
}

// Enhanced code generation that uses Vision AI insights
export function generateEnhancedChakraCode(
  analysis: ImageAnalysisResult
): string {
  const { colors, elements, layout, dimensions } = analysis;

  // Determine imports based on detected elements
  const imports = generateSmartImports(elements);

  let component = `export const GeneratedComponent = () => {\n`;
  component += `  return (\n`;

  // Generate container with smart layout detection
  component += generateSmartContainer(layout, colors, elements);

  return imports + component;
}

function generateSmartImports(elements: DetectedElement[]): string {
  const baseImports = new Set(["Box", "Text"]);

  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        baseImports.add("Button");
        break;
      case "input":
        baseImports.add("Input");
        if (element.content?.toLowerCase().includes("email")) {
          baseImports.add("InputGroup");
          baseImports.add("InputLeftElement");
        }
        break;
      case "text":
        if (
          element.properties?.fontSize === "xl" ||
          element.properties?.fontWeight === "bold"
        ) {
          baseImports.add("Heading");
        }
        break;
      case "card":
        baseImports.add("Card");
        baseImports.add("CardBody");
        baseImports.add("CardHeader");
        break;
      case "image":
        baseImports.add("Image");
        break;
    }
  });

  return `import { ${Array.from(baseImports)
    .sort()
    .join(", ")} } from '@chakra-ui/react';\n\n`;
}

function generateSmartContainer(
  layout: LayoutAnalysis,
  colors: ColorPalette,
  elements: DetectedElement[]
): string {
  let container = "";
  let closingTag = "";

  const baseProps = [
    `bg="${colors.background}"`,
    `p={${layout.padding ? Math.max(4, Math.min(layout.padding / 4, 12)) : 6}}`,
    `borderRadius="lg"`,
    `shadow="md"`,
    `maxW="2xl"`,
  ];

  // Generate elements with actual content and smart styling
  let elementsCode = "";

  elements.forEach((element, index) => {
    elementsCode += generateSmartElement(element, colors, index);
  });

  switch (layout.type) {
    case "grid":
      const cols = estimateGridCols(elements);
      container += `    <Grid templateColumns="repeat(${cols}, 1fr)" gap={${
        layout.gap || 4
      }} ${baseProps.join(" ")}>\n`;
      closingTag = `    </Grid>\n`;
      break;

    case "flex":
      if (layout.direction === "row") {
        container += `    <HStack spacing={${layout.gap || 4}} ${baseProps.join(
          " "
        )}>\n`;
        closingTag = `    </HStack>\n`;
      } else {
        container += `    <VStack spacing={${
          layout.gap || 4
        }} align="stretch" ${baseProps.join(" ")}>\n`;
        closingTag = `    </VStack>\n`;
      }
      break;

    default:
      container += `    <Box ${baseProps.join(" ")}>\n`;
      closingTag = `    </Box>\n`;
  }

  container += elementsCode;
  container += closingTag;
  container += `  );\n};`;

  return container;
}

function generateSmartElement(
  element: DetectedElement,
  colors: ColorPalette,
  index: number
): string {
  const indent = "      ";
  let elementCode = "";

  switch (element.type) {
    case "button":
      const variant = element.variant || "solid";
      const size =
        element.size ||
        (element.bounds.height > 50
          ? "lg"
          : element.bounds.height > 35
          ? "md"
          : "sm");
      const buttonContent = element.content || `Button ${index + 1}`;

      elementCode = `${indent}<Button\n${indent}  variant="${variant}"\n${indent}  size="${size}"\n${indent}  colorScheme="blue"\n${indent}>\n${indent}  ${buttonContent}\n${indent}</Button>\n`;
      break;

    case "text":
    case "heading":
      const textContent = element.content || `Sample text ${index + 1}`;
      const isHeading =
        element.type === "heading" ||
        element.styling?.fontWeight === "bold" ||
        element.styling?.fontSize === "xl";

      if (isHeading || element.type === "heading") {
        elementCode = `${indent}<Heading size="${
          element.styling?.fontSize || "md"
        }" color="${
          colors.text
        }">\n${indent}  ${textContent}\n${indent}</Heading>\n`;
      } else {
        elementCode = `${indent}<Text fontSize="${
          element.styling?.fontSize || "md"
        }" color="${
          colors.text
        }">\n${indent}  ${textContent}\n${indent}</Text>\n`;
      }
      break;

    case "input":
      const placeholder = element.content || `Input field ${index + 1}`;
      const inputSize =
        element.bounds.height > 50
          ? "lg"
          : element.bounds.height > 35
          ? "md"
          : "sm";

      elementCode = `${indent}<Input\n${indent}  placeholder="${placeholder}"\n${indent}  size="${inputSize}"\n${indent}  borderRadius="md"\n${indent}/>\n`;
      break;

    case "card":
      elementCode = `${indent}<Card>\n${indent}  <CardBody>\n${indent}    <Text>${
        element.content || `Card content ${index + 1}`
      }</Text>\n${indent}  </CardBody>\n${indent}</Card>\n`;
      break;

    default:
      elementCode = `${indent}<Box p={4} bg="${
        element.colors.background || colors.accent
      }" borderRadius="md">\n${indent}  <Text>${
        element.content || `Element ${index + 1}`
      }</Text>\n${indent}</Box>\n`;
  }

  return elementCode;
}

function estimateGridCols(elements: DetectedElement[]): number {
  if (elements.length < 2) return 1;
  if (elements.length < 4) return 2;

  // Group by Y position to estimate columns
  const tolerance = 50;
  const rows = new Map<number, number>();

  elements.forEach((element) => {
    const rowKey = Math.round(element.bounds.y / tolerance) * tolerance;
    rows.set(rowKey, (rows.get(rowKey) || 0) + 1);
  });

  return Math.min(Math.max(...rows.values()), 4);
}
