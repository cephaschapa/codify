import OpenAI from "openai";
import {
  ImageAnalysisResult,
  DetectedElement,
  LayoutAnalysis,
  ColorPalette,
} from "./imageAnalysis";
import {
  CHAKRA_EXAMPLES,
  DESIGN_TO_CODE_EXAMPLES,
  CHAKRA_PROPS_REFERENCE,
} from "./codeExamples";
import {
  COMPONENT_DETECTION_PATTERNS,
  LAYOUT_DETECTION_PATTERNS,
  COLOR_ANALYSIS_PATTERNS,
  FORM_PATTERNS,
  CHAKRA_BEST_PRACTICES,
  enhanceComponentDetection,
} from "./advancedPatterns";
import {
  CHAKRA_V3_COMPONENTS,
  CHAKRA_V3_COMPOSITION_PATTERNS,
  CHAKRA_V3_BEST_PRACTICES,
} from "./chakraV3Reference";

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
    return `You are an expert ChakraUI v3 developer. Analyze this UI design image and extract components using EXACT ChakraUI v3 patterns.

## OFFICIAL CHAKRA UI V3 DOCUMENTATION REFERENCE:

### LAYOUT COMPONENTS:
- **Box**: Low-level div with style props (foundation for all components)
- **Container**: Constrains content to max-width that adapts to breakpoints
- **Flex**: CSS flexbox with direction, align, justify, gap props  
- **Stack**: Stacks children with consistent spacing (direction, spacing props)
- **SimpleGrid**: Responsive grids (columns, minChildWidth, spacing props)
- **Grid**: Full grid control (templateColumns, templateRows, gap)
- **Center**: Centers children using flexbox
- **AspectRatio**: Maintains ratio for media (ratio prop)

### BUTTON COMPONENTS:
- **Button**: Standard button (variant, size, colorPalette, loading props)
  - Variants: solid, outline, ghost, subtle, surface
  - Sizes: xs, sm, md, lg, xl
  - Props: colorPalette (NOT colorScheme), loading, loadingText
- **IconButton**: Icon-only button (REQUIRES aria-label)
- **ButtonGroup**: Groups buttons (spacing, orientation, attached props)

### FORM COMPONENTS (CRITICAL - USE V3 PATTERNS):
- **Field**: Form control structure with Field.Root, Field.Label, Field.HelpText, Field.ErrorText
- **Input**: Standard text input (size, variant, placeholder, type props)
- **Textarea**: Multiline input (rows, resize, placeholder props)
- **Select**: Custom select with Select.Root > Select.Trigger > Select.Content > Select.Item
- **Checkbox**: Multi-select with Checkbox.Root > Checkbox.Control > Checkbox.Label
- **Radio**: Single select with Radio.Root > Radio.Control > Radio.Label  
- **Switch**: Toggle with size, colorPalette, checked props

### DATA DISPLAY COMPONENTS:
- **Card**: Content container with Card.Root > Card.Header > Card.Body > Card.Footer
- **Avatar**: User photo/initials with Avatar.Root > Avatar.Image > Avatar.Fallback
- **Badge**: Status indicators (variant, colorPalette, size props)
- **Table**: Data tables with Table.Root > Table.Header > Table.Body structure

### FEEDBACK COMPONENTS:
- **Alert**: Status messages with Alert.Root > Alert.Indicator > Alert.Title > Alert.Description
- **Progress**: Completion indicators (value, max, colorPalette props)
- **Spinner**: Loading indicator (thickness, speed, colorPalette props)

### TYPOGRAPHY:
- **Heading**: Semantic headings (size: xs to 6xl, as prop for h1-h6)
- **Text**: General text (fontSize, fontWeight, color, truncate props)
- **Link**: Navigation links (href, isExternal, variant props)

## MANDATORY V3 COMPOSITION PATTERNS:

### FORM FIELD (ALWAYS USE THIS FOR INPUTS):
\`\`\`jsx
<Field.Root required={isRequired}>
  <Field.Label>Label Text</Field.Label>
  <Input type="email" placeholder="Enter email" size="md" />
  <Field.HelpText>Helper text</Field.HelpText>
  <Field.ErrorText>Error message</Field.ErrorText>
</Field.Root>
\`\`\`

### CARD STRUCTURE:
\`\`\`jsx
<Card.Root>
  <Card.Header>
    <Heading size="md">Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card.Root>
\`\`\`

### ALERT PATTERN:
\`\`\`jsx
<Alert.Root status="info">
  <Alert.Indicator />
  <Alert.Title>Title</Alert.Title>
  <Alert.Description>Description</Alert.Description>
</Alert.Root>
\`\`\`

## CRITICAL DIFFERENCES FROM V2:
1. **colorPalette** instead of colorScheme
2. **Compound components** (.Root, .Label, .Content patterns)
3. **Field.Root** instead of FormControl
4. **Card.Root/Card.Body** instead of Card/CardBody
5. **Alert.Root/Alert.Title** instead of Alert/AlertTitle

## REQUIRED JSON STRUCTURE:

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

## PRECISION REQUIREMENTS:

1. **EXACT COMPONENT MATCHING**: Use the EXACT ChakraUI component names and props shown in the examples above
2. **PRECISE MEASUREMENTS**: Convert pixel measurements to Chakra spacing units (8px = 2, 16px = 4, 24px = 6, 32px = 8)
3. **ACCURATE COLOR EXTRACTION**: Use actual hex colors from the design, not approximations
4. **PROPER PROP SYNTAX**: Follow Chakra v3 prop patterns exactly as shown in examples

## DETAILED ANALYSIS INSTRUCTIONS:

### BUTTONS (Follow examples above exactly):
- Detect variant: solid, outline, ghost, link
- Measure size: xs (24px), sm (32px), md (40px), lg (48px), xl (56px)
- Extract exact colors: bg, text, border, hover states
- Detect border radius: none, sm, md, lg, xl, full
- Measure shadows: none, xs, sm, md, lg, xl, 2xl
- Include hover/focus effects

### FORM ELEMENTS (Use FormControl pattern):
- Wrap inputs in FormControl with proper labels
- Detect input types: text, email, password, number, tel, url
- Extract placeholder text exactly as shown
- Include validation states: isRequired, isInvalid
- Add proper focus styles with borderColor and boxShadow
- Include FormHelperText and FormErrorMessage when appropriate

### LAYOUT (Use proper containers):
- VStack for vertical layouts with exact spacing
- HStack for horizontal layouts with proper alignment
- SimpleGrid for grid layouts with responsive columns
- Measure gaps in Chakra units (gap in pixels ÷ 4)
- Include alignment props: align, justify, wrap

### CARDS (Follow card structure):
- Use Card, CardBody, CardHeader, CardFooter components
- Include proper padding (p={4}, p={5}, p={6})
- Add shadows and border radius
- Include overflow="hidden" for images

### TYPOGRAPHY (Precise sizing):
- Heading: size="xs|sm|md|lg|xl|2xl|3xl|4xl"
- Text: fontSize="xs|sm|md|lg|xl|2xl|3xl|4xl"
- FontWeight: thin|light|normal|medium|semibold|bold|extrabold|black
- Include proper spacing with mb, mt props

### COLORS (Exact extraction):
- Extract EXACT hex colors from design
- Use proper Chakra color props: bg, color, borderColor
- Include hover states: _hover={{ bg: "color" }}
- Include focus states: _focus={{ borderColor: "color", boxShadow: "0 0 0 1px color" }}

### SPACING (Chakra units):
- Convert pixels to Chakra spacing: 4px=1, 8px=2, 12px=3, 16px=4, 20px=5, 24px=6, 32px=8
- Use proper spacing props: p, pt, pr, pb, pl, m, mt, mr, mb, ml
- Include gaps: spacing for stacks, gap for grids

CRITICAL: Output should be PRODUCTION-READY ChakraUI v3 code that can be copy-pasted and used immediately.

## REQUIRED RESPONSE FORMAT:
- Respond with ONLY a valid JSON object
- Start immediately with { and end with }
- NO explanations, markdown, or text outside JSON
- Return exact structure shown above
- If cannot analyze: {"error": "Analysis failed"}

TASK: Return ONLY valid JSON matching the structure exactly.`;
  }

  private parseVisionResponse(response: string): ImageAnalysisResult | null {
    try {
      console.log(
        "🔍 Parsing Vision AI response:",
        response.substring(0, 200) + "..."
      );

      // Check if response indicates failure
      if (response.includes("I'm unable") || response.includes("unable to")) {
        console.error("❌ Vision AI cannot analyze image");
        return null;
      }

      // Extract JSON from multiple possible formats
      const jsonStr = this.extractJsonFromResponse(response);
      if (!jsonStr) {
        console.error("❌ No valid JSON found in Vision AI response");
        return null;
      }

      const parsed = JSON.parse(jsonStr);
      console.log(
        "✅ Successfully parsed JSON with",
        Object.keys(parsed).length,
        "top-level keys"
      );

      // Validate and transform the response to match our interface
      let elements = this.validateElements(parsed.elements || []);

      // Apply advanced pattern enhancement
      elements = enhanceComponentDetection(elements);

      const result: ImageAnalysisResult = {
        colors: this.validateColors(parsed.colors),
        elements,
        layout: this.validateLayout(parsed.layout),
        dimensions: parsed.dimensions || { width: 800, height: 600 },
        pageLayout: parsed.pageLayout,
        patterns: parsed.patterns,
      };

      return result;
    } catch (error) {
      console.error("Failed to parse Vision response:", error);
      console.log("Raw response:", response);

      // Try to create a fallback analysis instead of returning null
      console.log("🆘 Attempting fallback analysis");
      return this.createFallbackAnalysis();
    }
  }

  private extractJsonFromResponse(response: string): string | null {
    // Remove markdown code blocks if present
    let cleaned = response.replace(/```json\n?|\n?```/g, "").trim();

    // Look for JSON object/array pattern
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    // If it's not valid JSON, try to find JSON boundaries by looking for { and }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // Validate it's valid JSON
    try {
      JSON.parse(cleaned);
      return cleaned;
    } catch {
      console.warn(
        "⚠️ Response not valid JSON, trying to fix:",
        cleaned.substring(0, 100)
      );
      return null;
    }
  }

  private createFallbackAnalysis(): ImageAnalysisResult {
    console.log("🆘 Creating fallback analysis structure");
    return {
      colors: {
        dominant: "#3B82F6",
        background: "#FFFFFF",
        text: "#1F2937",
        accent: "#10B981",
        palette: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      },
      elements: [],
      layout: {
        type: "absolute" as const,
        direction: "column" as const,
        alignment: "start" as const,
        gap: 16,
        padding: 24,
      },
      dimensions: { width: 800, height: 600 },
      pageLayout: undefined,
      patterns: {
        isForm: false,
        isNavigation: false,
        isCard: false,
        isList: false,
        isModal: false,
        isHeader: false,
        isFooter: false,
        isSidebar: false,
        isLandingPage: false,
        isDashboard: false,
        isBlogPost: false,
        isProfilePage: false,
      },
    };
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
          element.styling?.fontSize === "xl" ||
          element.styling?.fontWeight === "bold"
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

      elementCode = `${indent}<Button\n${indent}  variant="${variant}"\n${indent}  size="${size}"\n${indent}  colorPalette="blue"\n${indent}>\n${indent}  ${buttonContent}\n${indent}</Button>\n`;
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
