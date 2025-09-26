import { ImageAnalysisResult, DetectedElement } from "./imageAnalysis";
import { ChakraCodeValidator, ValidationResult } from "./codeValidator";

export class CodeRefinementEngine {
  private validator = new ChakraCodeValidator();

  async refineGeneratedCode(
    initialCode: string,
    analysis: ImageAnalysisResult,
    maxIterations: number = 3
  ): Promise<{
    finalCode: string;
    iterations: Array<{
      code: string;
      validation: ValidationResult;
      improvements: string[];
    }>;
    qualityScore: number;
  }> {
    let currentCode = initialCode;
    const iterations: any[] = [];

    for (let i = 0; i < maxIterations; i++) {
      // Validate current code
      const validation = this.validator.validateGeneratedCode(
        currentCode,
        analysis.elements
      );
      const improvements = this.validator.suggestImprovements(
        currentCode,
        analysis.elements
      );

      iterations.push({
        code: currentCode,
        validation,
        improvements,
      });

      // If code is already high quality, stop
      if (validation.score >= 85 && validation.errors.length === 0) {
        break;
      }

      // Apply automatic improvements
      currentCode = this.applyAutomaticImprovements(
        currentCode,
        validation,
        improvements,
        analysis
      );
    }

    const finalValidation = this.validator.validateGeneratedCode(
      currentCode,
      analysis.elements
    );

    return {
      finalCode: currentCode,
      iterations,
      qualityScore: finalValidation.score,
    };
  }

  private applyAutomaticImprovements(
    code: string,
    validation: ValidationResult,
    improvements: string[],
    analysis: ImageAnalysisResult
  ): string {
    let improvedCode = code;

    // Fix missing imports
    if (validation.errors.some((e) => e.includes("Missing ChakraUI import"))) {
      improvedCode = this.fixImports(improvedCode);
    }

    // Add missing hover states
    if (improvements.some((s) => s.includes("hover effects"))) {
      improvedCode = this.addHoverStates(improvedCode);
    }

    // Add missing focus states
    if (improvements.some((s) => s.includes("focus effects"))) {
      improvedCode = this.addFocusStates(improvedCode);
    }

    // Wrap inputs in FormControl
    if (improvements.some((s) => s.includes("FormControl"))) {
      improvedCode = this.wrapInputsInFormControl(improvedCode);
    }

    // Add responsive design
    if (improvements.some((s) => s.includes("responsive"))) {
      improvedCode = this.addResponsiveDesign(improvedCode);
    }

    // Improve spacing consistency
    improvedCode = this.normalizeSpacing(improvedCode);

    return improvedCode;
  }

  private fixImports(code: string): string {
    // Extract used components
    const usedComponents = new Set<string>();
    const componentRegex = /<(\w+)[\s>]/g;
    let match;

    while ((match = componentRegex.exec(code)) !== null) {
      usedComponents.add(match[1]);
    }

    // Generate proper import
    const chakraComponents = Array.from(usedComponents).filter((comp) =>
      this.validator["validChakraComponents"].includes(comp)
    );

    const newImport = `import {\n  ${chakraComponents
      .sort()
      .join(",\n  ")}\n} from '@chakra-ui/react';\n\n`;

    // Replace existing import or add new one
    if (code.includes("import {")) {
      return code.replace(
        /import\s*{[^}]*}\s*from\s*['"]@chakra-ui\/react['"];?\n*/g,
        newImport
      );
    } else {
      return newImport + code;
    }
  }

  private addHoverStates(code: string): string {
    // Add hover effects to buttons that don't have them
    return code.replace(/<Button([^>]*?)>/g, (match, props) => {
      if (props.includes("_hover")) return match;
      return `<Button${props} _hover={{ transform: "translateY(-2px)", shadow: "md" }}>`;
    });
  }

  private addFocusStates(code: string): string {
    // Add focus effects to inputs that don't have them
    return code.replace(/<Input([^>]*?)\/>/g, (match, props) => {
      if (props.includes("_focus")) return match;
      const hasColorScheme = props.includes("colorScheme");
      const focusColor = hasColorScheme ? "blue.500" : "blue.500";
      return `<Input${props} _focus={{ borderColor: "${focusColor}", boxShadow: "0 0 0 1px ${focusColor}" }} />`;
    });
  }

  private wrapInputsInFormControl(code: string): string {
    // Wrap standalone inputs in FormControl
    return code.replace(/(\s*)<Input([^>]*?)\/>/g, (match, indent, props) => {
      if (
        code.includes("<FormControl") &&
        code.indexOf("<FormControl") < code.indexOf(match)
      ) {
        return match; // Already wrapped
      }

      return `${indent}<FormControl>
${indent}  <FormLabel>Label</FormLabel>
${indent}  <Input${props} />
${indent}</FormControl>`;
    });
  }

  private addResponsiveDesign(code: string): string {
    // Add responsive maxWidth to main containers
    return code.replace(
      /<(VStack|HStack|Box|Card)([^>]*?)>/g,
      (match, component, props) => {
        if (props.includes("maxW") || props.includes("w=")) return match;
        return `<${component}${props} maxW={{ base: "100%", md: "md", lg: "lg" }}>`;
      }
    );
  }

  private normalizeSpacing(code: string): string {
    // Convert inconsistent spacing to Chakra units
    let normalizedCode = code;

    // Convert pixel values to Chakra spacing
    const spacingMap: { [key: string]: string } = {
      '"4px"': "{1}",
      '"8px"': "{2}",
      '"12px"': "{3}",
      '"16px"': "{4}",
      '"20px"': "{5}",
      '"24px"': "{6}",
      '"32px"': "{8}",
      '"40px"': "{10}",
      '"48px"': "{12}",
    };

    Object.entries(spacingMap).forEach(([px, unit]) => {
      normalizedCode = normalizedCode.replace(new RegExp(px, "g"), unit);
    });

    return normalizedCode;
  }

  // Real-time code quality checker
  getCodeQuality(code: string): CodeQualityMetrics {
    return {
      hasProperImports: code.includes("from '@chakra-ui/react'"),
      usesChakraProps: this.validChakraProps.some((prop) =>
        new RegExp(`${prop}=`).test(code)
      ),
      hasResponsiveDesign: /\{\s*base:/.test(code) || code.includes("maxW"),
      includesAccessibility: /aria-|alt=|as=/.test(code),
      hasProperSpacing: /[pm][trbl]?=\{\d+\}/.test(code),
      usesSemanticElements: code.includes('as="'),
    };
  }

  // Generate improvement suggestions
  generateImprovementPrompt(
    code: string,
    validation: ValidationResult
  ): string {
    const issues = [...validation.errors, ...validation.warnings];

    return `
IMPROVE THIS CHAKRA UI CODE:

Current code:
\`\`\`tsx
${code}
\`\`\`

Issues found:
${issues.map((issue) => `- ${issue}`).join("\n")}

Improvements needed:
${validation.suggestions.map((suggestion) => `- ${suggestion}`).join("\n")}

Please provide the IMPROVED code that:
1. Fixes all errors and warnings
2. Uses proper ChakraUI v3 patterns
3. Includes responsive design
4. Has proper accessibility
5. Uses Chakra spacing units
6. Includes hover/focus states

Return ONLY the improved code, no explanations.
`;
  }

  private calculateQualityScore(
    metrics: CodeQualityMetrics,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 100;

    // Major deductions for errors
    score -= errors.length * 25;

    // Minor deductions for warnings
    score -= warnings.length * 10;

    // Bonus points for quality metrics
    if (metrics.hasProperImports) score += 0; // Expected
    if (metrics.usesChakraProps) score += 10;
    if (metrics.hasResponsiveDesign) score += 15;
    if (metrics.includesAccessibility) score += 15;
    if (metrics.hasProperSpacing) score += 10;
    if (metrics.usesSemanticElements) score += 5;

    return Math.max(0, Math.min(100, score));
  }
}
