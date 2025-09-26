import {
  ImageAnalysisResult,
  DetectedElement,
  ColorPalette,
} from "./imageAnalysis";

export function generateChakraV3Code(analysis: ImageAnalysisResult): string {
  const { colors, elements, layout } = analysis;

  // Generate proper v3 imports
  const imports = generateV3Imports(elements);

  // Generate v3 component structure
  let component = `export const GeneratedComponent = () => {\n`;
  component += `  return (\n`;

  // Use proper v3 layout components
  component += generateV3Layout(layout, colors, elements);

  return imports + component;
}

function generateV3Imports(elements: DetectedElement[]): string {
  const imports = new Set(["Box", "Stack"]);

  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        imports.add("Button");
        break;
      case "input":
        imports.add("Field");
        imports.add("Input");
        break;
      case "textarea":
        imports.add("Field");
        imports.add("Textarea");
        break;
      case "select":
        imports.add("Select");
        break;
      case "checkbox":
        imports.add("Checkbox");
        break;
      case "radio":
        imports.add("Radio");
        break;
      case "switch":
        imports.add("Switch");
        break;
      case "card":
        imports.add("Card");
        break;
      case "heading":
        imports.add("Heading");
        break;
      case "text":
        imports.add("Text");
        break;
      case "image":
        imports.add("Image");
        break;
      case "container":
        imports.add("Container");
        break;
      case "badge":
        imports.add("Badge");
        break;
      case "alert":
        imports.add("Alert");
        break;
      case "avatar":
        imports.add("Avatar");
        break;
      case "progress":
        imports.add("Progress");
        break;
      case "spinner":
        imports.add("Spinner");
        break;
    }
  });

  return `import {\n  ${Array.from(imports)
    .sort()
    .join(",\n  ")}\n} from '@chakra-ui/react';\n\n`;
}

function generateV3Layout(
  layout: any,
  colors: ColorPalette,
  elements: DetectedElement[]
): string {
  const spacing = layout.gap ? Math.round(layout.gap / 4) : 4;
  const padding = layout.padding ? Math.round(layout.padding / 4) : 6;

  let layoutCode = "";
  let closingTag = "";

  // Use Stack (the v3 way) instead of VStack/HStack
  if (layout.type === "flex") {
    layoutCode += `    <Stack\n`;
    layoutCode += `      direction="${layout.direction || "column"}"\n`;
    layoutCode += `      spacing={${spacing}}\n`;
    layoutCode += `      p={${padding}}\n`;
    layoutCode += `      bg="${colors.background}"\n`;
    layoutCode += `      borderRadius="lg"\n`;
    layoutCode += `      shadow="md"\n`;
    layoutCode += `      maxW="2xl"\n`;
    layoutCode += `      mx="auto"\n`;
    if (layout.alignment && layout.alignment !== "start") {
      layoutCode += `      align="${layout.alignment}"\n`;
    }
    layoutCode += `    >\n`;
    closingTag = `    </Stack>\n`;
  } else if (layout.type === "grid") {
    const cols = estimateColumns(elements);
    layoutCode += `    <Box p={${padding}} bg="${colors.background}" borderRadius="lg" shadow="md" maxW="2xl" mx="auto">\n`;
    layoutCode += `      <SimpleGrid columns={${cols}} spacing={${spacing}}>\n`;
    closingTag = `      </SimpleGrid>\n    </Box>\n`;
  } else {
    layoutCode += `    <Box p={${padding}} bg="${colors.background}" borderRadius="lg" shadow="md" maxW="2xl" mx="auto">\n`;
    layoutCode += `      <Stack spacing={${spacing}}>\n`;
    closingTag = `      </Stack>\n    </Box>\n`;
  }

  // Generate v3 elements
  elements.forEach((element, index) => {
    layoutCode += generateV3Element(element, colors, index);
  });

  layoutCode += closingTag;
  layoutCode += `  );\n};`;

  return layoutCode;
}

function generateV3Element(
  element: DetectedElement,
  colors: ColorPalette,
  index: number
): string {
  const indent = "      ";
  let elementCode = "";

  // Extract properties
  const variant = element.variant || "solid";
  const size = element.size || "md";
  const content = element.content || "";

  switch (element.type) {
    case "button":
      elementCode = `${indent}<Button\n`;
      elementCode += `${indent}  variant="${variant}"\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  colorPalette="blue"\n`;
      if (element.state === "loading") elementCode += `${indent}  loading\n`;
      if (element.state === "disabled") elementCode += `${indent}  disabled\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${content || `Button ${index + 1}`}\n`;
      elementCode += `${indent}</Button>\n`;
      break;

    case "input":
      const inputType = element.formProperties?.type || "text";
      const placeholder =
        element.formProperties?.placeholder || content || `Enter ${inputType}`;
      const isRequired = element.formProperties?.required;
      const isInvalid = element.formProperties?.validation === "error";

      elementCode = `${indent}<Field.Root`;
      if (isRequired) elementCode += ` required`;
      if (isInvalid) elementCode += ` invalid`;
      elementCode += `>\n`;
      elementCode += `${indent}  <Field.Label>${
        content || `${inputType} field`
      }</Field.Label>\n`;
      elementCode += `${indent}  <Input\n`;
      elementCode += `${indent}    type="${inputType}"\n`;
      elementCode += `${indent}    placeholder="${placeholder}"\n`;
      elementCode += `${indent}    size="${size}"\n`;
      elementCode += `${indent}  />\n`;
      if (!isInvalid) {
        elementCode += `${indent}  <Field.HelpText>Helper text for this field</Field.HelpText>\n`;
      } else {
        elementCode += `${indent}  <Field.ErrorText>This field is required</Field.ErrorText>\n`;
      }
      elementCode += `${indent}</Field.Root>\n`;
      break;

    case "textarea":
      elementCode = `${indent}<Field.Root>\n`;
      elementCode += `${indent}  <Field.Label>${
        content || "Message"
      }</Field.Label>\n`;
      elementCode += `${indent}  <Textarea\n`;
      elementCode += `${indent}    placeholder="${
        element.formProperties?.placeholder || "Enter your message..."
      }"\n`;
      elementCode += `${indent}    rows={4}\n`;
      elementCode += `${indent}    resize="vertical"\n`;
      elementCode += `${indent}  />\n`;
      elementCode += `${indent}</Field.Root>\n`;
      break;

    case "select":
      elementCode = `${indent}<Select.Root>\n`;
      elementCode += `${indent}  <Select.Label>${
        content || "Select option"
      }</Select.Label>\n`;
      elementCode += `${indent}  <Select.Control>\n`;
      elementCode += `${indent}    <Select.Trigger>\n`;
      elementCode += `${indent}      <Select.ValueText placeholder="Choose option" />\n`;
      elementCode += `${indent}      <Select.Indicator />\n`;
      elementCode += `${indent}    </Select.Trigger>\n`;
      elementCode += `${indent}  </Select.Control>\n`;
      elementCode += `${indent}  <Select.Positioner>\n`;
      elementCode += `${indent}    <Select.Content>\n`;
      elementCode += `${indent}      <Select.Item value="option1">\n`;
      elementCode += `${indent}        <Select.ItemText>Option 1</Select.ItemText>\n`;
      elementCode += `${indent}      </Select.Item>\n`;
      elementCode += `${indent}      <Select.Item value="option2">\n`;
      elementCode += `${indent}        <Select.ItemText>Option 2</Select.ItemText>\n`;
      elementCode += `${indent}      </Select.Item>\n`;
      elementCode += `${indent}    </Select.Content>\n`;
      elementCode += `${indent}  </Select.Positioner>\n`;
      elementCode += `${indent}</Select.Root>\n`;
      break;

    case "checkbox":
      elementCode = `${indent}<Checkbox.Root>\n`;
      elementCode += `${indent}  <Checkbox.HiddenInput />\n`;
      elementCode += `${indent}  <Checkbox.Control>\n`;
      elementCode += `${indent}    <Checkbox.Indicator />\n`;
      elementCode += `${indent}  </Checkbox.Control>\n`;
      elementCode += `${indent}  <Checkbox.Label>${
        content || `Checkbox ${index + 1}`
      }</Checkbox.Label>\n`;
      elementCode += `${indent}</Checkbox.Root>\n`;
      break;

    case "radio":
      elementCode = `${indent}<Radio.Root>\n`;
      elementCode += `${indent}  <Radio.HiddenInput />\n`;
      elementCode += `${indent}  <Radio.Control>\n`;
      elementCode += `${indent}    <Radio.Indicator />\n`;
      elementCode += `${indent}  </Radio.Control>\n`;
      elementCode += `${indent}  <Radio.Label>${
        content || `Radio ${index + 1}`
      }</Radio.Label>\n`;
      elementCode += `${indent}</Radio.Root>\n`;
      break;

    case "switch":
      elementCode = `${indent}<Switch\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  colorPalette="blue"\n`;
      if (element.state === "disabled") elementCode += `${indent}  disabled\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${content || `Switch ${index + 1}`}\n`;
      elementCode += `${indent}</Switch>\n`;
      break;

    case "card":
      elementCode = `${indent}<Card.Root>\n`;
      if (content) {
        elementCode += `${indent}  <Card.Header>\n`;
        elementCode += `${indent}    <Heading size="md">${content}</Heading>\n`;
        elementCode += `${indent}  </Card.Header>\n`;
      }
      elementCode += `${indent}  <Card.Body>\n`;
      elementCode += `${indent}    <Text>Card content goes here</Text>\n`;
      elementCode += `${indent}  </Card.Body>\n`;
      elementCode += `${indent}</Card.Root>\n`;
      break;

    case "alert":
      const status = element.formProperties?.validation || "info";
      elementCode = `${indent}<Alert.Root status="${status}">\n`;
      elementCode += `${indent}  <Alert.Indicator />\n`;
      if (content) {
        elementCode += `${indent}  <Alert.Title>${content}</Alert.Title>\n`;
      }
      elementCode += `${indent}  <Alert.Description>\n`;
      elementCode += `${indent}    Alert description goes here\n`;
      elementCode += `${indent}  </Alert.Description>\n`;
      elementCode += `${indent}</Alert.Root>\n`;
      break;

    case "avatar":
      elementCode = `${indent}<Avatar.Root size="${size}">\n`;
      elementCode += `${indent}  <Avatar.Image src="/user.jpg" alt="${
        content || "User"
      }" />\n`;
      elementCode += `${indent}  <Avatar.Fallback>${(content || "User")
        .substring(0, 2)
        .toUpperCase()}</Avatar.Fallback>\n`;
      elementCode += `${indent}</Avatar.Root>\n`;
      break;

    case "badge":
      elementCode = `${indent}<Badge\n`;
      elementCode += `${indent}  variant="${variant}"\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  colorPalette="blue"\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${content || `Badge ${index + 1}`}\n`;
      elementCode += `${indent}</Badge>\n`;
      break;

    case "heading":
      const headingSize = element.styling?.fontSize || "lg";
      elementCode = `${indent}<Heading\n`;
      elementCode += `${indent}  size="${headingSize}"\n`;
      elementCode += `${indent}  color="${colors.text}"\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${content || `Heading ${index + 1}`}\n`;
      elementCode += `${indent}</Heading>\n`;
      break;

    case "text":
      const fontSize = element.styling?.fontSize || "md";
      const fontWeight = element.styling?.fontWeight || "normal";
      elementCode = `${indent}<Text\n`;
      elementCode += `${indent}  fontSize="${fontSize}"\n`;
      if (fontWeight !== "normal")
        elementCode += `${indent}  fontWeight="${fontWeight}"\n`;
      elementCode += `${indent}  color="${colors.text}"\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  ${content || `Text content ${index + 1}`}\n`;
      elementCode += `${indent}</Text>\n`;
      break;

    case "image":
      const imgWidth = Math.min(element.bounds.width / 4, 200);
      const imgHeight = Math.min(element.bounds.height / 4, 150);
      elementCode = `${indent}<Image\n`;
      elementCode += `${indent}  src="/placeholder.jpg"\n`;
      elementCode += `${indent}  alt="${
        element.accessibility?.ariaLabel || `Image ${index + 1}`
      }"\n`;
      elementCode += `${indent}  w="${imgWidth}px"\n`;
      elementCode += `${indent}  h="${imgHeight}px"\n`;
      elementCode += `${indent}  borderRadius="md"\n`;
      elementCode += `${indent}/>\n`;
      break;

    case "progress":
      elementCode = `${indent}<Progress\n`;
      elementCode += `${indent}  value={65}\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  colorPalette="blue"\n`;
      elementCode += `${indent}/>\n`;
      break;

    case "spinner":
      elementCode = `${indent}<Spinner\n`;
      elementCode += `${indent}  size="${size}"\n`;
      elementCode += `${indent}  colorPalette="blue"\n`;
      elementCode += `${indent}/>\n`;
      break;

    default:
      // Generic container for unknown elements
      elementCode = `${indent}<Box\n`;
      elementCode += `${indent}  p={4}\n`;
      elementCode += `${indent}  bg="${
        element.colors.background || colors.accent
      }"\n`;
      elementCode += `${indent}  borderRadius="md"\n`;
      elementCode += `${indent}>\n`;
      elementCode += `${indent}  <Text>${
        content || `${element.type} ${index + 1}`
      }</Text>\n`;
      elementCode += `${indent}</Box>\n`;
  }

  return elementCode;
}

function estimateColumns(elements: DetectedElement[]): number {
  if (elements.length < 2) return 1;
  if (elements.length < 4) return 2;
  if (elements.length < 9) return 3;
  return 4;
}
