// Complete Chakra UI v3 component reference from documentation
export const CHAKRA_V3_COMPONENTS = {
  layout: {
    AbsoluteCenter: {
      purpose:
        "Centers a child horizontally/vertically in a relatively positioned parent",
      props: ["axis"],
      usage: "Centering overlays or floating elements",
    },
    AspectRatio: {
      purpose: "Maintains a given ratio (e.g., 16:9) for responsive embeds",
      props: ["ratio"],
      usage: "Videos, images, responsive media",
    },
    Box: {
      purpose:
        "Low-level component that renders a <div> and exposes style props",
      props: ["all style props"],
      usage: "Foundation for all other components",
    },
    Center: {
      purpose: "Centers its children using flexbox",
      props: ["standard layout props"],
      usage: "Centering content without position relative",
    },
    Container: {
      purpose: "Constrains content to a max-width that adapts to breakpoints",
      props: ["maxW", "centerContent"],
      usage: "Site layouts, content sections",
    },
    Flex: {
      purpose: "Implements CSS flexbox",
      props: ["direction", "align", "justify", "gap"],
      usage: "Flexible layouts, navigation bars",
    },
    Grid: {
      purpose: "Provides CSS grid layout with full control",
      props: ["templateColumns", "templateRows", "gap"],
      usage: "Complex grid layouts",
    },
    SimpleGrid: {
      purpose: "Accepts columns or minChildWidth for responsive layouts",
      props: ["columns", "minChildWidth", "spacing"],
      usage: "Responsive card grids, feature lists",
    },
    Stack: {
      purpose: "Stacks children with consistent spacing",
      props: ["direction", "spacing"],
      usage: "Vertical/horizontal lists, form layouts",
    },
  },

  typography: {
    Heading: {
      purpose: "Renders <h1>…<h6> headings with sizes from xs to 6xl",
      props: ["size", "as"],
      sizes: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
      usage: "Page titles, section headers",
    },
    Text: {
      purpose: "General purpose text component",
      props: ["fontSize", "fontWeight", "color", "truncate"],
      usage: "Body text, descriptions, labels",
    },
    Link: {
      purpose: "Accessible navigation links",
      props: ["href", "isExternal", "variant"],
      usage: "Navigation, text links",
    },
    Code: {
      purpose: "Display inline code",
      props: ["variant", "colorPalette"],
      usage: "Inline code snippets",
    },
    List: {
      purpose: "Creates ordered or unordered lists",
      props: ["spacing", "icon"],
      usage: "Feature lists, navigation menus",
    },
  },

  buttons: {
    Button: {
      purpose: "Standard button that triggers actions",
      props: ["variant", "size", "colorPalette", "loading", "loadingText"],
      variants: ["solid", "outline", "ghost", "subtle", "surface"],
      sizes: ["xs", "sm", "md", "lg", "xl"],
      usage: "Primary actions, form submissions",
    },
    IconButton: {
      purpose: "Button containing only an icon",
      props: ["aria-label", "variant", "size", "colorPalette"],
      required: ["aria-label"],
      usage: "Close buttons, action icons",
    },
    ButtonGroup: {
      purpose: "Groups several buttons together",
      props: ["spacing", "orientation", "attached"],
      usage: "Toolbars, action groups",
    },
  },

  forms: {
    Field: {
      purpose:
        "Provide form control structure: label, help text and error message",
      components: [
        "Field.Root",
        "Field.Label",
        "Field.HelpText",
        "Field.ErrorText",
      ],
      usage: "Wrapping form inputs for proper accessibility",
    },
    Input: {
      purpose: "Standard text input",
      props: ["size", "variant", "placeholder", "type"],
      variants: ["outline", "filled", "flushed", "unstyled"],
      usage: "Text input, email, password fields",
    },
    Textarea: {
      purpose: "Multiline text input for longer messages",
      props: ["rows", "resize", "placeholder"],
      usage: "Comments, messages, descriptions",
    },
    Select: {
      purpose: "Custom select widget with composition pattern",
      components: [
        "Select.Root",
        "Select.Trigger",
        "Select.ValueText",
        "Select.Content",
        "Select.Item",
      ],
      props: ["multiple", "clearable", "size"],
      usage: "Dropdowns, option selection",
    },
    Checkbox: {
      purpose: "Allows selection of multiple values",
      components: [
        "Checkbox.Root",
        "Checkbox.Control",
        "Checkbox.Label",
        "Checkbox.Indicator",
      ],
      props: ["variant", "colorPalette", "size", "checked", "indeterminate"],
      variants: ["outline", "subtle", "solid"],
      usage: "Multi-select options, agreement checkboxes",
    },
    Radio: {
      purpose: "Allow a single selection from a set",
      components: ["Radio.Root", "Radio.Control", "Radio.Label"],
      props: ["colorPalette", "size"],
      usage: "Single-select options",
    },
    Switch: {
      purpose: "Binary toggle similar to a checkbox but styled as a switch",
      props: ["size", "colorPalette", "checked"],
      usage: "Settings toggles, on/off states",
    },
  },

  dataDisplay: {
    Avatar: {
      purpose: "Shows a user's photo or initials",
      components: [
        "Avatar.Root",
        "Avatar.Image",
        "Avatar.Fallback",
        "Avatar.Group",
      ],
      props: ["size", "variant", "shape", "colorPalette"],
      usage: "User profiles, team members",
    },
    Badge: {
      purpose: "Highlights an item's status or metadata",
      props: ["variant", "colorPalette", "size"],
      variants: ["solid", "subtle", "outline", "surface"],
      usage: "Status indicators, labels",
    },
    Card: {
      purpose: "Presents related content in a container",
      components: ["Card.Root", "Card.Header", "Card.Body", "Card.Footer"],
      props: ["variant", "size"],
      usage: "Content containers, feature cards",
    },
    Table: {
      purpose: "Presents data in rows and columns",
      components: [
        "Table.Root",
        "Table.Header",
        "Table.Body",
        "Table.Row",
        "Table.Cell",
      ],
      props: ["size", "variant", "striped"],
      usage: "Data tables, listings",
    },
  },

  feedback: {
    Alert: {
      purpose: "Communicates statuses such as error, warning, success or info",
      components: [
        "Alert.Root",
        "Alert.Indicator",
        "Alert.Title",
        "Alert.Description",
      ],
      props: ["status", "variant", "colorPalette", "size"],
      statuses: ["error", "warning", "success", "info"],
      variants: ["subtle", "solid", "outline"],
      usage: "Error messages, notifications",
    },
    Progress: {
      purpose: "Indicate completion of an operation",
      props: ["value", "max", "isIndeterminate", "colorPalette", "size"],
      usage: "Loading bars, completion indicators",
    },
    Spinner: {
      purpose: "Loading spinner that indicates processing",
      props: ["thickness", "speed", "emptyColor", "colorPalette"],
      usage: "Loading states, async operations",
    },
    Toast: {
      purpose: "Programmatically triggered transient message overlay",
      hook: "useToast",
      props: ["title", "description", "status", "duration"],
      usage: "Success messages, error notifications",
    },
  },

  overlay: {
    Dialog: {
      purpose: "Displays a modal dialog with backdrop",
      components: [
        "Dialog.Root",
        "Dialog.Trigger",
        "Dialog.Content",
        "Dialog.Header",
        "Dialog.Body",
        "Dialog.Footer",
      ],
      props: ["open", "onOpenChange"],
      usage: "Modals, confirmations",
    },
    Drawer: {
      purpose: "Slides in from the side of the screen",
      components: ["Drawer.Root", "Drawer.Trigger", "Drawer.Content"],
      props: ["placement", "size", "open", "onOpenChange"],
      placements: ["left", "right", "top", "bottom"],
      usage: "Side panels, mobile navigation",
    },
    Menu: {
      purpose: "Accessible dropdown menu",
      components: ["Menu.Root", "Menu.Trigger", "Menu.Content", "Menu.Item"],
      props: ["placement"],
      usage: "Context menus, dropdown actions",
    },
    Popover: {
      purpose: "Can contain any content, triggered by interaction",
      components: ["Popover.Root", "Popover.Trigger", "Popover.Content"],
      props: ["placement", "trigger"],
      usage: "Help text, additional info",
    },
    Tooltip: {
      purpose: "Displays a small label on hover/focus",
      props: ["label", "placement", "openDelay", "closeDelay"],
      usage: "Help text, icon explanations",
    },
  },
};

export const CHAKRA_V3_COMPOSITION_PATTERNS = {
  // Compound component patterns that must be used correctly
  accordion: `<Accordion.Root>
  <Accordion.Item>
    <Accordion.ItemTrigger>
      Panel Title
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        Panel content goes here
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>`,

  alert: `<Alert.Root status="info">
  <Alert.Indicator />
  <Alert.Title>Alert Title</Alert.Title>
  <Alert.Description>
    Alert description with helpful information
  </Alert.Description>
</Alert.Root>`,

  avatar: `<Avatar.Root size="md">
  <Avatar.Image src="/user.jpg" alt="User Name" />
  <Avatar.Fallback>UN</Avatar.Fallback>
</Avatar.Root>`,

  card: `<Card.Root>
  <Card.Header>
    <Heading size="md">Card Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Card content goes here</Text>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card.Root>`,

  checkbox: `<Checkbox.Root>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Checkbox Label</Checkbox.Label>
</Checkbox.Root>`,

  dialog: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Dialog Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Text>Dialog content</Text>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.CloseTrigger asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.CloseTrigger>
        <Button>Confirm</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>`,

  field: `<Field.Root>
  <Field.Label>Field Label</Field.Label>
  <Input placeholder="Enter value" />
  <Field.HelpText>Helper text for the field</Field.HelpText>
  <Field.ErrorText>Error message if invalid</Field.ErrorText>
</Field.Root>`,

  menu: `<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="item1">Menu Item 1</Menu.Item>
      <Menu.Item value="item2">Menu Item 2</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>`,

  radio: `<Radio.Root>
  <Radio.HiddenInput />
  <Radio.Control>
    <Radio.Indicator />
  </Radio.Control>
  <Radio.Label>Radio Label</Radio.Label>
</Radio.Root>`,

  select: `<Select.Root>
  <Select.Label>Select Label</Select.Label>
  <Select.Control>
    <Select.Trigger>
      <Select.ValueText placeholder="Select option" />
      <Select.Indicator />
    </Select.Trigger>
  </Select.Control>
  <Select.Positioner>
    <Select.Content>
      <Select.Item value="option1">
        <Select.ItemText>Option 1</Select.ItemText>
        <Select.ItemIndicator />
      </Select.Item>
      <Select.Item value="option2">
        <Select.ItemText>Option 2</Select.ItemText>
        <Select.ItemIndicator />
      </Select.Item>
    </Select.Content>
  </Select.Positioner>
</Select.Root>`,

  tabs: `<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="tab1">
    <Text>Tab 1 content</Text>
  </Tabs.Content>
  <Tabs.Content value="tab2">
    <Text>Tab 2 content</Text>
  </Tabs.Content>
</Tabs.Root>`,
};

export const CHAKRA_V3_BEST_PRACTICES = {
  componentComposition: {
    rule: "Use proper compound component patterns",
    critical: "Many components require specific nested structure",
    examples: [
      "Accordion.Root > Accordion.Item > Accordion.ItemTrigger",
      "Card.Root > Card.Header + Card.Body + Card.Footer",
      "Field.Root > Field.Label + Input + Field.HelpText",
    ],
  },

  propsUsage: {
    variant: ["solid", "outline", "ghost", "subtle", "surface"],
    size: ["xs", "sm", "md", "lg", "xl", "2xl"],
    colorPalette: [
      "gray",
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue",
      "cyan",
      "purple",
      "pink",
    ],
    status: ["error", "warning", "success", "info"],
  },

  stateManagement: {
    controlled: "Use open/onOpenChange for overlays",
    forms: "Use value/onValueChange for form inputs",
    hooks: ["useDisclosure", "useToast"],
    examples: [
      "const { open, onOpen, onClose } = useDisclosure()",
      "const toast = useToast()",
    ],
  },

  accessibility: {
    required: [
      "aria-label for IconButton",
      "alt text for images",
      "proper heading hierarchy",
      "form labels and descriptions",
    ],
    semantic: [
      "as='main' for main content",
      "as='nav' for navigation",
      "as='header' for page headers",
    ],
  },
};

export const CHAKRA_V3_GENERATION_RULES = {
  // Critical rules for accurate code generation
  mustUse: {
    imports:
      "Import components with proper names (e.g., Button, not ChakraButton)",
    composition: "Use compound patterns for complex components",
    props: "Use exact prop names from documentation",
    values: "Use valid prop values (variants, sizes, colors)",
  },

  commonMistakes: {
    avoid: [
      "Using deprecated prop names",
      "Missing required nested components",
      "Incorrect variant/size combinations",
      "Missing accessibility props",
    ],
  },

  template: {
    basic: `import { Button, Input, VStack } from '@chakra-ui/react';

export const Component = () => {
  return (
    <VStack spacing={4}>
      <Input placeholder="Email" />
      <Button colorScheme="blue">Submit</Button>
    </VStack>
  );
};`,

    withComposition: `import { 
  Card, 
  Field, 
  Input, 
  Button 
} from '@chakra-ui/react';

export const Component = () => {
  return (
    <Card.Root>
      <Card.Body>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input placeholder="Enter email" />
          <Field.HelpText>We'll never share your email</Field.HelpText>
        </Field.Root>
        <Button colorScheme="blue" mt={4}>
          Submit
        </Button>
      </Card.Body>
    </Card.Root>
  );
};`,
  },
};
