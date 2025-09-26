import {
  DetectedElement,
  ColorPalette,
  ImageAnalysisResult,
} from "./imageAnalysis";
import { CHAKRA_V3_COMPOSITION_PATTERNS } from "./chakraV3Reference";

export function generateDetailedChakraCode(
  analysis: ImageAnalysisResult
): string {
  const { colors, elements, layout } = analysis;

  // Generate comprehensive imports
  const imports = generateComprehensiveImports(elements);

  // Generate component with precise styling
  let component = `export const GeneratedComponent = () => {\n`;
  component += `  return (\n`;

  // Container based on layout with precise styling
  component += generatePreciseContainer(layout, colors, elements);

  return imports + component;
}

function generateComprehensiveImports(elements: DetectedElement[]): string {
  const imports = new Set([
    "Box",
    "Flex",
    "VStack",
    "HStack",
    "Text",
    "Heading",
    "SimpleGrid",
  ]);

  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        imports.add("Button");
        imports.add("IconButton");
        break;
      case "input":
        imports.add("Input");
        imports.add("Field");
        break;
      case "textarea":
        imports.add("Textarea");
        imports.add("FormControl");
        imports.add("FormLabel");
        break;
      case "select":
        imports.add("Select");
        imports.add("FormControl");
        imports.add("FormLabel");
        break;
      case "checkbox":
        imports.add("Checkbox");
        imports.add("CheckboxGroup");
        break;
      case "radio":
        imports.add("Radio");
        imports.add("RadioGroup");
        imports.add("Stack");
        break;
      case "switch":
        imports.add("Switch");
        imports.add("FormControl");
        imports.add("FormLabel");
        break;
      case "card":
        imports.add("Card");
        break;
      case "image":
        imports.add("Image");
        imports.add("AspectRatio");
        break;
      case "badge":
        imports.add("Badge");
        break;
      case "alert":
        imports.add("Alert");
        imports.add("AlertIcon");
        imports.add("AlertTitle");
        imports.add("AlertDescription");
        break;
      case "avatar":
        imports.add("Avatar");
        imports.add("AvatarBadge");
        imports.add("AvatarGroup");
        break;
      case "divider":
        imports.add("Divider");
        break;
      case "breadcrumb":
        imports.add("Breadcrumb");
        imports.add("BreadcrumbItem");
        imports.add("BreadcrumbLink");
        imports.add("BreadcrumbSeparator");
        break;
      case "tabs":
        imports.add("Tabs");
        imports.add("TabList");
        imports.add("TabPanels");
        imports.add("Tab");
        imports.add("TabPanel");
        break;
      case "accordion":
        imports.add("Accordion");
        imports.add("AccordionItem");
        imports.add("AccordionButton");
        imports.add("AccordionPanel");
        imports.add("AccordionIcon");
        break;
      case "menu":
        imports.add("Menu");
        imports.add("MenuButton");
        imports.add("MenuList");
        imports.add("MenuItem");
        break;
      case "progress":
        imports.add("Progress");
        imports.add("CircularProgress");
        break;
      case "spinner":
        imports.add("Spinner");
        break;
      case "table":
        imports.add("Table");
        imports.add("Thead");
        imports.add("Tbody");
        imports.add("Tr");
        imports.add("Th");
        imports.add("Td");
        imports.add("TableContainer");
        break;
      case "list":
        imports.add("List");
        imports.add("ListItem");
        imports.add("ListIcon");
        imports.add("OrderedList");
        imports.add("UnorderedList");
        break;
    }
  });

  return `import {\n  ${Array.from(imports)
    .sort()
    .join(",\n  ")}\n} from '@chakra-ui/react';\n\n`;
}

function generatePreciseContainer(
  layout: any,
  colors: ColorPalette,
  elements: DetectedElement[]
): string {
  const gap = layout.gap ? Math.round(layout.gap / 4) : 4;
  const padding = layout.padding ? Math.round(layout.padding / 4) : 6;

  let container = "";
  let closingTag = "";

  const baseProps = [
    `bg="${colors.background}"`,
    `p={${padding}}`,
    `borderRadius="lg"`,
    `shadow="md"`,
    `maxW="2xl"`,
    `mx="auto"`,
  ];

  switch (layout.type) {
    case "flex":
      if (layout.direction === "row") {
        container += `    <HStack spacing={${gap}} ${baseProps.join(
          " "
        )} align="start">\n`;
        closingTag = `    </HStack>\n`;
      } else {
        container += `    <VStack spacing={${gap}} ${baseProps.join(
          " "
        )} align="stretch">\n`;
        closingTag = `    </VStack>\n`;
      }
      break;
    case "grid":
      const cols = estimateGridColumns(elements);
      container += `    <Box ${baseProps.join(
        " "
      )}>\n      <SimpleGrid columns={${cols}} spacing={${gap}}>\n`;
      closingTag = `      </SimpleGrid>\n    </Box>\n`;
      break;
    default:
      container += `    <Box ${baseProps.join(
        " "
      )}>\n      <VStack spacing={${gap}} align="stretch">\n`;
      closingTag = `      </VStack>\n    </Box>\n`;
  }

  // Generate elements with precise styling
  container += generatePreciseElements(elements, colors, layout);
  container += closingTag;
  container += `  );\n};`;

  return container;
}

function generatePreciseElements(
  elements: DetectedElement[],
  colors: ColorPalette,
  layout: any
): string {
  let elementsCode = "";

  elements.forEach((element, index) => {
    elementsCode += generateDetailedElement(element, colors, index);
  });

  return elementsCode;
}

function generateDetailedElement(
  element: DetectedElement,
  colors: ColorPalette,
  index: number
): string {
  const indent = "      ";
  let elementCode = "";

  // Extract precise styling properties
  const fontSize = element.styling?.fontSize || "md";
  const fontWeight = element.styling?.fontWeight || "normal";
  const borderRadius = element.styling?.borderRadius || "md";
  const shadow = element.styling?.shadow || "none";
  const borderWidth = element.styling?.borderWidth || "0";
  const opacity = element.styling?.opacity || 1;

  // Extract colors with fallbacks
  const bgColor = element.colors.background || colors.accent;
  const textColor = element.colors.text || colors.text;
  const borderColor = element.colors.border || "gray.200";
  const hoverColor = element.colors.hover;
  const focusColor = element.colors.focus;

  // Build precise spacing
  const padding = element.styling?.padding;
  const margin = element.styling?.margin;

  const paddingProps = padding
    ? `pt={${Math.round(padding.top / 4)}} pr={${Math.round(
        padding.right / 4
      )}} pb={${Math.round(padding.bottom / 4)}} pl={${Math.round(
        padding.left / 4
      )}}`
    : "p={4}";

  const marginProps = margin
    ? `mt={${Math.round(margin.top / 4)}} mr={${Math.round(
        margin.right / 4
      )}} mb={${Math.round(margin.bottom / 4)}} ml={${Math.round(
        margin.left / 4
      )}}`
    : "";

  switch (element.type) {
    case "button":
      const variant = element.variant || "solid";
      const size = element.size || "md";
      const isDisabled = element.state === "disabled";
      const isLoading = element.state === "loading";

      elementCode = `${indent}<Button\n`;
      elementCode += `${indent}  variant="${variant}"\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  bg="${bgColor}"\n`;
      elementCode += `${indent}  color="${textColor}"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (shadow !== "none") elementCode += `${indent}  shadow="${shadow}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}  borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (opacity < 1) elementCode += `${indent}  opacity={${opacity}}\n`;
      if (hoverColor)
        elementCode += `${indent}  _hover={{ bg: "${hoverColor}" }}\n`;
      if (focusColor)
        elementCode += `${indent}  _focus={{ boxShadow: "0 0 0 3px ${focusColor}" }}\n`;
      if (isDisabled) elementCode += `${indent}  isDisabled\n`;
      if (isLoading) elementCode += `${indent}  isLoading\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${element.content || `Button ${index + 1}`}\n`;
      elementCode += `${indent}</Button>\n`;
      break;

    case "heading":
      elementCode = `${indent}<Heading\n`;
      elementCode += `${indent}  size="${fontSize}"\n`;
      elementCode += `${indent}  fontWeight="${fontWeight}"\n`;
      elementCode += `${indent}  color="${textColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      if (opacity < 1) elementCode += `${indent}  opacity={${opacity}}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${
        element.content || `Heading ${index + 1}`
      }\n`;
      elementCode += `${indent}</Heading>\n`;
      break;

    case "text":
      elementCode = `${indent}<Text\n`;
      elementCode += `${indent}  fontSize="${fontSize}"\n`;
      elementCode += `${indent}  fontWeight="${fontWeight}"\n`;
      elementCode += `${indent}  color="${textColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      if (opacity < 1) elementCode += `${indent}  opacity={${opacity}}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${
        element.content || `Text content ${index + 1}`
      }\n`;
      elementCode += `${indent}</Text>\n`;
      break;

    case "input":
      const placeholder =
        element.formProperties?.placeholder ||
        element.content ||
        `Input ${index + 1}`;
      const inputType = element.formProperties?.type || "text";
      const isRequired = element.formProperties?.required;
      const isInputDisabled = element.formProperties?.disabled;
      const validation = element.formProperties?.validation;

      elementCode = `${indent}<Field.Root`;
      if (isRequired) elementCode += ` required`;
      if (validation === "error") elementCode += ` invalid`;
      elementCode += `>\n`;

      if (element.accessibility?.ariaLabel) {
        elementCode += `${indent}  <Field.Label>${element.accessibility.ariaLabel}</Field.Label>\n`;
      } else {
        elementCode += `${indent}  <Field.Label>Input Label</Field.Label>\n`;
      }

      elementCode += `${indent}  <Input\n`;
      elementCode += `${indent}    type="${inputType}"\n`;
      elementCode += `${indent}    placeholder="${placeholder}"\n`;
      elementCode += `${indent}    size="${element.size || "md"}"\n`;
      elementCode += `${indent}    bg="${bgColor}"\n`;
      elementCode += `${indent}    borderRadius="${borderRadius}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}    borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (focusColor)
        elementCode += `${indent}    _focus={{ borderColor: "${focusColor}", boxShadow: "0 0 0 1px ${focusColor}" }}\n`;
      if (isInputDisabled) elementCode += `${indent}    disabled\n`;
      if (marginProps) elementCode += `${indent}    ${marginProps}\n`;
      elementCode += `${indent}  />\n`;

      elementCode += `${indent}  <Field.HelpText>Helper text for this field</Field.HelpText>\n`;

      if (validation === "error") {
        elementCode += `${indent}  <Field.ErrorText>This field is required</Field.ErrorText>\n`;
      }
      elementCode += `${indent}</Field.Root>\n`;
      break;

    case "textarea":
      elementCode = `${indent}<FormControl>\n`;
      if (element.accessibility?.ariaLabel) {
        elementCode += `${indent}  <FormLabel>${element.accessibility.ariaLabel}</FormLabel>\n`;
      }
      elementCode += `${indent}  <Textarea\n`;
      elementCode += `${indent}    placeholder="${
        element.formProperties?.placeholder || "Enter text..."
      }"\n`;
      elementCode += `${indent}    size="${element.size || "md"}"\n`;
      elementCode += `${indent}    bg="${bgColor}"\n`;
      elementCode += `${indent}    borderRadius="${borderRadius}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}    borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (focusColor)
        elementCode += `${indent}    _focus={{ borderColor: "${focusColor}" }}\n`;
      elementCode += `${indent}  />\n`;
      elementCode += `${indent}</FormControl>\n`;
      break;

    case "select":
      elementCode = `${indent}<FormControl>\n`;
      if (element.accessibility?.ariaLabel) {
        elementCode += `${indent}  <FormLabel>${element.accessibility.ariaLabel}</FormLabel>\n`;
      }
      elementCode += `${indent}  <Select\n`;
      elementCode += `${indent}    placeholder="${
        element.formProperties?.placeholder || "Select option"
      }"\n`;
      elementCode += `${indent}    size="${element.size || "md"}"\n`;
      elementCode += `${indent}    bg="${bgColor}"\n`;
      elementCode += `${indent}    borderRadius="${borderRadius}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}    borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      elementCode += `${indent}  >\n`;
      elementCode += `${indent}    <option value="option1">Option 1</option>\n`;
      elementCode += `${indent}    <option value="option2">Option 2</option>\n`;
      elementCode += `${indent}  </Select>\n`;
      elementCode += `${indent}</FormControl>\n`;
      break;

    case "checkbox":
      elementCode = `${indent}<Checkbox\n`;
      elementCode += `${indent}  size="${element.size || "md"}"\n`;
      elementCode += `${indent}  colorScheme="blue"\n`;
      if (element.state === "disabled")
        elementCode += `${indent}  isDisabled\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${
        element.content || `Checkbox ${index + 1}`
      }\n`;
      elementCode += `${indent}</Checkbox>\n`;
      break;

    case "radio":
      elementCode = `${indent}<RadioGroup>\n`;
      elementCode += `${indent}  <Stack direction="column" spacing={2}>\n`;
      elementCode += `${indent}    <Radio value="1" size="${
        element.size || "md"
      }">\n`;
      elementCode += `${indent}      ${
        element.content || `Radio Option ${index + 1}`
      }\n`;
      elementCode += `${indent}    </Radio>\n`;
      elementCode += `${indent}  </Stack>\n`;
      elementCode += `${indent}</RadioGroup>\n`;
      break;

    case "switch":
      elementCode = `${indent}<FormControl display="flex" alignItems="center">\n`;
      elementCode += `${indent}  <FormLabel mb="0">\n`;
      elementCode += `${indent}    ${
        element.content || `Switch ${index + 1}`
      }\n`;
      elementCode += `${indent}  </FormLabel>\n`;
      elementCode += `${indent}  <Switch size="${
        element.size || "md"
      }" colorScheme="blue" />\n`;
      elementCode += `${indent}</FormControl>\n`;
      break;

    case "card":
      elementCode = `${indent}<Card.Root\n`;
      elementCode += `${indent}  bg="${bgColor}"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (shadow !== "none") elementCode += `${indent}  shadow="${shadow}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}  borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  <Card.Body>\n`;
      elementCode += `${indent}    <Text color="${textColor}">${
        element.content || `Card content ${index + 1}`
      }</Text>\n`;
      elementCode += `${indent}  </Card.Body>\n`;
      elementCode += `${indent}</Card.Root>\n`;
      break;

    case "badge":
      elementCode = `${indent}<Badge\n`;
      elementCode += `${indent}  variant="${element.variant || "solid"}"\n`;
      elementCode += `${indent}  size="${element.size || "md"}"\n`;
      elementCode += `${indent}  colorScheme="blue"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${element.content || `Badge ${index + 1}`}\n`;
      elementCode += `${indent}</Badge>\n`;
      break;

    case "alert":
      elementCode = `${indent}<Alert\n`;
      elementCode += `${indent}  status="${
        element.formProperties?.validation || "info"
      }"\n`;
      elementCode += `${indent}  variant="${element.variant || "solid"}"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  <AlertIcon />\n`;
      elementCode += `${indent}  <AlertTitle>${
        element.content || `Alert ${index + 1}`
      }</AlertTitle>\n`;
      elementCode += `${indent}</Alert>\n`;
      break;

    case "avatar":
      elementCode = `${indent}<Avatar\n`;
      elementCode += `${indent}  size="${element.size || "md"}"\n`;
      elementCode += `${indent}  name="${
        element.content || `User ${index + 1}`
      }"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent} />\n`;
      break;

    case "divider":
      elementCode = `${indent}<Divider\n`;
      elementCode += `${indent}  borderColor="${borderColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent} />\n`;
      break;

    case "progress":
      elementCode = `${indent}<Progress\n`;
      elementCode += `${indent}  value={65}\n`;
      elementCode += `${indent}  size="${element.size || "md"}"\n`;
      elementCode += `${indent}  colorScheme="blue"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent} />\n`;
      break;

    case "spinner":
      elementCode = `${indent}<Spinner\n`;
      elementCode += `${indent}  size="${element.size || "md"}"\n`;
      elementCode += `${indent}  color="${textColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent} />\n`;
      break;

    case "image":
      const imgWidth = Math.round(element.bounds.width / 4);
      const imgHeight = Math.round(element.bounds.height / 4);

      elementCode = `${indent}<Image\n`;
      elementCode += `${indent}  src="/placeholder.jpg"\n`;
      elementCode += `${indent}  alt="${
        element.accessibility?.ariaLabel || `Image ${index + 1}`
      }"\n`;
      elementCode += `${indent}  w="${imgWidth}px"\n`;
      elementCode += `${indent}  h="${imgHeight}px"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (shadow !== "none") elementCode += `${indent}  shadow="${shadow}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}  borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent} />\n`;
      break;

    default:
      // For any other element types
      elementCode = `${indent}<Box\n`;
      elementCode += `${indent}  ${paddingProps}\n`;
      elementCode += `${indent}  bg="${bgColor}"\n`;
      elementCode += `${indent}  borderRadius="${borderRadius}"\n`;
      if (shadow !== "none") elementCode += `${indent}  shadow="${shadow}"\n`;
      if (borderWidth !== "0")
        elementCode += `${indent}  borderWidth="${borderWidth}" borderColor="${borderColor}"\n`;
      if (opacity < 1) elementCode += `${indent}  opacity={${opacity}}\n`;
      if (marginProps) elementCode += `${indent}  ${marginProps}\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  <Text color="${textColor}">${
        element.content || `${element.type} ${index + 1}`
      }</Text>\n`;
      elementCode += `${indent}</Box>\n`;
  }

  return elementCode;
}

function estimateGridColumns(elements: DetectedElement[]): number {
  if (elements.length < 2) return 1;
  if (elements.length < 4) return 2;
  if (elements.length < 9) return 3;
  return 4;
}
