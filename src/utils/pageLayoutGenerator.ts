import {
  ImageAnalysisResult,
  DetectedElement,
  PageSection,
} from "./imageAnalysis";
import { generateChakraV3Code } from "./chakraV3Generator";

export interface GeneratedPage {
  fullPageCode: string;
  componentCode: string;
  imports: string;
  sections: {
    [key: string]: {
      code: string;
      elements: DetectedElement[];
    };
  };
}

export function generatePageLayout(
  analysis: ImageAnalysisResult
): GeneratedPage {
  const { colors, elements, pageLayout, patterns } = analysis;

  if (!pageLayout || pageLayout.sections.length === 0) {
    // Fallback to component-only generation
    return generateFallbackComponent(analysis);
  }

  // Generate imports for page layout
  const imports = generatePageImports(elements, pageLayout.structure);

  // Generate individual sections
  const sections: any = {};
  pageLayout.sections.forEach((section) => {
    const sectionElements = section.elements
      .map((index) => elements[index])
      .filter(Boolean);
    sections[section.name] = {
      code: generateSectionCode(section, sectionElements, colors),
      elements: sectionElements,
    };
  });

  // Generate full page layout
  const fullPageCode = generateFullPageCode(pageLayout, sections, colors);

  // Generate component version (for the existing tab) using v3 patterns
  const componentCode = generateComponentVersionV3(analysis);

  return {
    fullPageCode,
    componentCode,
    imports,
    sections,
  };
}

function generatePageImports(
  elements: DetectedElement[],
  structure: string
): string {
  const baseImports = new Set([
    "Box",
    "Flex",
    "Text",
    "Container",
    "VStack",
    "HStack",
    "Spacer",
  ]);

  // Add structure-specific imports
  if (structure.includes("sidebar")) {
    baseImports.add("Drawer");
    baseImports.add("DrawerContent");
    baseImports.add("DrawerBody");
  }

  // Add element-specific imports
  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        baseImports.add("Button");
        break;
      case "input":
        baseImports.add("Input");
        baseImports.add("InputGroup");
        break;
      case "text":
        baseImports.add("Heading");
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
    .join(
      ", "
    )} } from '@chakra-ui/react';\nimport { ReactNode } from 'react';\n\n`;
}

function generateSectionCode(
  section: PageSection,
  elements: DetectedElement[],
  colors: any
): string {
  const sectionName =
    section.name.charAt(0).toUpperCase() + section.name.slice(1);
  let sectionCode = `const ${sectionName}Section = () => {\n  return (\n`;

  // Choose appropriate container based on section type
  switch (section.name) {
    case "header":
    case "navigation":
      sectionCode += `    <Flex\n      as="header"\n      align="center"\n      justify="space-between"\n      wrap="wrap"\n      w="100%"\n      p={4}\n      bg="${colors.background}"\n      borderBottom="1px"\n      borderColor="gray.200"\n      shadow="sm"\n    >\n`;
      break;

    case "hero":
      sectionCode += `    <Box\n      bg="${colors.background}"\n      py={20}\n      px={8}\n      textAlign="center"\n      bgGradient="linear(to-r, ${colors.accent}, ${colors.dominant})"\n    >\n      <Container maxW="4xl">\n`;
      break;

    case "sidebar":
      sectionCode += `    <Box\n      as="nav"\n      w="250px"\n      h="100vh"\n      bg="${colors.background}"\n      borderRight="1px"\n      borderColor="gray.200"\n      p={4}\n      position="fixed"\n      left="0"\n      top="0"\n      overflowY="auto"\n    >\n`;
      break;

    case "footer":
      sectionCode += `    <Box\n      as="footer"\n      w="100%"\n      bg="${colors.background}"\n      borderTop="1px"\n      borderColor="gray.200"\n      py={8}\n      px={4}\n      mt="auto"\n    >\n      <Container maxW="6xl">\n`;
      break;

    default:
      sectionCode += `    <Box w="100%" p={6}>\n      <Container maxW="4xl">\n`;
  }

  // Add elements
  if (elements.length > 0) {
    sectionCode += generateSectionElements(elements, colors, section.name);
  } else {
    sectionCode += `        <Text>// ${sectionName} content goes here</Text>\n`;
  }

  // Close containers
  if (
    section.name === "hero" ||
    section.name === "footer" ||
    section.name === "content"
  ) {
    sectionCode += `      </Container>\n`;
  }
  sectionCode += `    </${getContainerComponent(section.name)}>\n`;
  sectionCode += `  );\n};\n\n`;

  return sectionCode;
}

function generateSectionElements(
  elements: DetectedElement[],
  colors: any,
  sectionType: string
): string {
  let elementsCode = "";
  const indent =
    sectionType === "hero" || sectionType === "footer"
      ? "        "
      : "        ";

  if (sectionType === "header" || sectionType === "navigation") {
    // For headers, arrange elements horizontally
    elementsCode += `${indent}<Flex align="center" gap={4}>\n`;
    elements.forEach((element, index) => {
      elementsCode += generateSmartElement(
        element,
        colors,
        index,
        indent + "  "
      );
    });
    elementsCode += `${indent}  <Spacer />\n${indent}</Flex>\n`;
  } else {
    // For other sections, use vertical layout
    elementsCode += `${indent}<VStack spacing={6} align="stretch">\n`;
    elements.forEach((element, index) => {
      elementsCode += generateSmartElement(
        element,
        colors,
        index,
        indent + "  "
      );
    });
    elementsCode += `${indent}</VStack>\n`;
  }

  return elementsCode;
}

function generateSmartElement(
  element: DetectedElement,
  colors: any,
  index: number,
  indent: string
): string {
  const content = element.content || "";

  switch (element.type) {
    case "button":
      const variant = element.properties?.variant || "solid";
      const size =
        element.bounds.height > 50
          ? "lg"
          : element.bounds.height > 35
          ? "md"
          : "sm";
      return `${indent}<Button variant="${variant}" size="${size}" colorScheme="blue">\n${indent}  ${
        content || `Button ${index + 1}`
      }\n${indent}</Button>\n`;

    case "text":
      const isHeading =
        element.properties?.fontWeight === "bold" || element.bounds.height > 30;
      if (isHeading) {
        const headingSize =
          element.bounds.height > 60
            ? "xl"
            : element.bounds.height > 40
            ? "lg"
            : "md";
        return `${indent}<Heading size="${headingSize}" color="${
          colors.text
        }">\n${indent}  ${
          content || `Heading ${index + 1}`
        }\n${indent}</Heading>\n`;
      } else {
        return `${indent}<Text color="${colors.text}">\n${indent}  ${
          content || `Text content ${index + 1}`
        }\n${indent}</Text>\n`;
      }

    case "input":
      const placeholder = content || `Input field ${index + 1}`;
      return `${indent}<Input placeholder="${placeholder}" size="md" />\n`;

    case "card":
      return `${indent}<Card>\n${indent}  <CardBody>\n${indent}    <Text>${
        content || `Card content ${index + 1}`
      }</Text>\n${indent}  </CardBody>\n${indent}</Card>\n`;

    case "image":
      return `${indent}<Image src="/placeholder.jpg" alt="Image ${
        index + 1
      }" borderRadius="md" />\n`;

    default:
      return `${indent}<Box p={4} bg="${
        colors.accent
      }" borderRadius="md">\n${indent}  <Text>${
        content || `Element ${index + 1}`
      }</Text>\n${indent}</Box>\n`;
  }
}

function generateFullPageCode(
  pageLayout: any,
  sections: any,
  colors: any
): string {
  let pageCode = `export const GeneratedPage = () => {\n  return (\n`;

  switch (pageLayout.structure) {
    case "header-main-footer":
      pageCode += `    <Flex direction="column" minH="100vh">\n`;
      if (sections.header) pageCode += `      <HeaderSection />\n`;
      pageCode += `      <Box flex="1" bg="${colors.background}">\n`;
      if (sections.hero) pageCode += `        <HeroSection />\n`;
      if (sections.content) pageCode += `        <ContentSection />\n`;
      pageCode += `      </Box>\n`;
      if (sections.footer) pageCode += `      <FooterSection />\n`;
      pageCode += `    </Flex>\n`;
      break;

    case "sidebar-main":
      pageCode += `    <Flex>\n`;
      if (sections.sidebar) pageCode += `      <SidebarSection />\n`;
      pageCode += `      <Box flex="1" ml={sections.sidebar ? "250px" : "0"}>\n`;
      if (sections.content) pageCode += `        <ContentSection />\n`;
      pageCode += `      </Box>\n`;
      pageCode += `    </Flex>\n`;
      break;

    case "header-sidebar-main-footer":
      pageCode += `    <Flex direction="column" minH="100vh">\n`;
      if (sections.header) pageCode += `      <HeaderSection />\n`;
      pageCode += `      <Flex flex="1">\n`;
      if (sections.sidebar) pageCode += `        <SidebarSection />\n`;
      pageCode += `        <Box flex="1">\n`;
      if (sections.content) pageCode += `          <ContentSection />\n`;
      pageCode += `        </Box>\n`;
      pageCode += `      </Flex>\n`;
      if (sections.footer) pageCode += `      <FooterSection />\n`;
      pageCode += `    </Flex>\n`;
      break;

    default:
      pageCode += `    <Box minH="100vh" bg="${colors.background}">\n`;
      Object.keys(sections).forEach((sectionName) => {
        const componentName =
          sectionName.charAt(0).toUpperCase() +
          sectionName.slice(1) +
          "Section";
        pageCode += `      <${componentName} />\n`;
      });
      pageCode += `    </Box>\n`;
  }

  pageCode += `  );\n};\n\n`;

  // Add all section components
  Object.keys(sections).forEach((sectionName) => {
    pageCode += sections[sectionName].code;
  });

  return pageCode;
}

function generateComponentVersionV3(analysis: ImageAnalysisResult): string {
  // Use the proper v3 generator instead of old v2 patterns
  return generateChakraV3Code(analysis);
}

function generateComponentVersion(analysis: ImageAnalysisResult): string {
  // This is the existing component generation for the "Component" tab
  const { colors, elements, layout } = analysis;

  let imports = `import { Box, Text, VStack, HStack`;
  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        if (!imports.includes("Button")) imports += ", Button";
        break;
      case "input":
        if (!imports.includes("Input")) imports += ", Input";
        break;
    }
  });
  imports += ` } from '@chakra-ui/react';\n\n`;

  let component = `export const GeneratedComponent = () => {\n  return (\n`;
  component += `    <VStack spacing={4} p={6} bg="${colors.background}" borderRadius="lg" maxW="md">\n`;

  elements.forEach((element, index) => {
    component += generateSmartElement(element, colors, index, "      ");
  });

  component += `    </VStack>\n  );\n};`;

  return imports + component;
}

function generateFallbackComponent(
  analysis: ImageAnalysisResult
): GeneratedPage {
  const componentCode = generateChakraV3Code(analysis);
  return {
    fullPageCode: componentCode,
    componentCode,
    imports: `import { Box, Text, Stack } from '@chakra-ui/react';\n\n`,
    sections: {},
  };
}

function getContainerComponent(sectionName: string): string {
  switch (sectionName) {
    case "header":
    case "navigation":
      return "Flex";
    default:
      return "Box";
  }
}
