import { DetectedElement } from "./imageAnalysis";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100
}

export interface CodeQualityMetrics {
  hasProperImports: boolean;
  usesChakraProps: boolean;
  hasResponsiveDesign: boolean;
  includesAccessibility: boolean;
  hasProperSpacing: boolean;
  usesSemanticElements: boolean;
}

export class ChakraCodeValidator {
  private validChakraComponents = [
    "Box",
    "Flex",
    "VStack",
    "HStack",
    "SimpleGrid",
    "Grid",
    "GridItem",
    "Text",
    "Heading",
    "Button",
    "Input",
    "Textarea",
    "Select",
    "FormControl",
    "FormLabel",
    "FormHelperText",
    "FormErrorMessage",
    "Card",
    "CardBody",
    "CardHeader",
    "CardFooter",
    "Image",
    "Badge",
    "Alert",
    "Avatar",
    "Divider",
    "Checkbox",
    "Radio",
    "Switch",
    "Progress",
    "Spinner",
    "Menu",
    "Tabs",
  ];

  private validChakraProps = [
    "bg",
    "color",
    "p",
    "pt",
    "pr",
    "pb",
    "pl",
    "m",
    "mt",
    "mr",
    "mb",
    "ml",
    "w",
    "h",
    "minW",
    "minH",
    "maxW",
    "maxH",
    "fontSize",
    "fontWeight",
    "borderRadius",
    "shadow",
    "borderWidth",
    "borderColor",
    "spacing",
    "align",
    "justify",
    "direction",
    "wrap",
    "size",
    "variant",
    "colorScheme",
  ];

  validateGeneratedCode(
    code: string,
    elements: DetectedElement[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check basic structure
    if (!code.includes("import")) {
      errors.push("Missing import statement");
    }

    if (!code.includes("from '@chakra-ui/react'")) {
      errors.push("Missing ChakraUI import");
    }

    // Check component usage
    const usedComponents = this.extractUsedComponents(code);
    const invalidComponents = usedComponents.filter(
      (comp) => !this.validChakraComponents.includes(comp)
    );

    if (invalidComponents.length > 0) {
      errors.push(`Invalid components used: ${invalidComponents.join(", ")}`);
    }

    // Check prop usage
    const metrics = this.analyzeCodeQuality(code);

    if (!metrics.hasProperSpacing) {
      warnings.push(
        'Consider using Chakra spacing units (p={4} instead of padding="16px")'
      );
    }

    if (!metrics.usesSemanticElements) {
      suggestions.push(
        'Use semantic HTML elements (as="main", as="nav", etc.)'
      );
    }

    if (!metrics.includesAccessibility) {
      suggestions.push("Add accessibility props (aria-label, alt text, etc.)");
    }

    // Check if all detected elements are represented
    const elementsInCode = this.countElementsInCode(code);
    if (elementsInCode < elements.length) {
      warnings.push(
        `Only ${elementsInCode}/${elements.length} elements were generated`
      );
    }

    // Calculate quality score
    const score = this.calculateQualityScore(metrics, errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score,
    };
  }

  private extractUsedComponents(code: string): string[] {
    const componentRegex = /<(\w+)[\s>]/g;
    const matches = [];
    let match;

    while ((match = componentRegex.exec(code)) !== null) {
      matches.push(match[1]);
    }

    return [...new Set(matches)];
  }

  private analyzeCodeQuality(code: string): CodeQualityMetrics {
    return {
      hasProperImports: code.includes("from '@chakra-ui/react'"),
      usesChakraProps: this.validChakraProps.some((prop) =>
        code.includes(prop + "=")
      ),
      hasResponsiveDesign:
        code.includes("base:") || code.includes("md:") || code.includes("lg:"),
      includesAccessibility:
        code.includes("aria-") || code.includes("alt=") || code.includes("as="),
      hasProperSpacing: /[pm][trbl]?=\{\d+\}/.test(code), // p={4}, mt={2}, etc.
      usesSemanticElements: code.includes('as="'),
    };
  }

  private countElementsInCode(code: string): number {
    // Count major UI elements (excluding containers)
    const elementTypes = [
      "Button",
      "Input",
      "Text",
      "Heading",
      "Image",
      "Card",
      "Badge",
      "Alert",
    ];
    let count = 0;

    elementTypes.forEach((type) => {
      const regex = new RegExp(`<${type}[\\s>]`, "g");
      const matches = code.match(regex);
      if (matches) count += matches.length;
    });

    return count;
  }

  private calculateQualityScore(
    metrics: CodeQualityMetrics,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 100;

    // Deduct for errors (major issues)
    score -= errors.length * 20;

    // Deduct for warnings (minor issues)
    score -= warnings.length * 5;

    // Bonus for quality metrics
    if (metrics.hasProperImports) score += 0;
    if (metrics.usesChakraProps) score += 10;
    if (metrics.hasResponsiveDesign) score += 15;
    if (metrics.includesAccessibility) score += 10;
    if (metrics.hasProperSpacing) score += 10;
    if (metrics.usesSemanticElements) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  // Suggest improvements for better code quality
  suggestImprovements(code: string, elements: DetectedElement[]): string[] {
    const suggestions: string[] = [];

    // Check for missing responsive design
    if (!code.includes("maxW") && !code.includes("w={")) {
      suggestions.push(
        'Add responsive width: maxW="md" or w={{ base: "100%", md: "400px" }}'
      );
    }

    // Check for missing hover states on buttons
    if (code.includes("<Button") && !code.includes("_hover")) {
      suggestions.push(
        'Add hover effects: _hover={{ transform: "translateY(-2px)" }}'
      );
    }

    // Check for missing focus states on inputs
    if (code.includes("<Input") && !code.includes("_focus")) {
      suggestions.push(
        'Add focus effects: _focus={{ borderColor: "blue.500" }}'
      );
    }

    // Check for proper form structure
    if (code.includes("<Input") && !code.includes("FormControl")) {
      suggestions.push("Wrap inputs in FormControl for better accessibility");
    }

    // Check for semantic HTML
    if (code.includes("navigation") && !code.includes('as="nav"')) {
      suggestions.push('Add semantic HTML: as="nav" for navigation elements');
    }

    return suggestions;
  }
}
