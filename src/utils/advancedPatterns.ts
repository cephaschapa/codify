// Advanced component detection patterns and context
export const COMPONENT_DETECTION_PATTERNS = {
  // Visual patterns that indicate specific components
  button: {
    indicators: [
      "rectangular shape with rounded corners",
      "clickable appearance with shadow",
      "text centered inside rectangle",
      "hover state visible or implied",
      "Call-to-action styling (prominent colors)",
    ],
    measurements: {
      minWidth: 64,
      minHeight: 32,
      maxAspectRatio: 8,
      commonSizes: {
        xs: { width: 64, height: 24 },
        sm: { width: 80, height: 32 },
        md: { width: 96, height: 40 },
        lg: { width: 128, height: 48 },
        xl: { width: 160, height: 56 },
      },
    },
  },

  input: {
    indicators: [
      "rectangular field with border",
      "placeholder text visible",
      "cursor input appearance",
      "form field styling",
      "associated label nearby",
    ],
    measurements: {
      minWidth: 120,
      minHeight: 32,
      maxHeight: 60,
      aspectRatio: { min: 3, max: 15 },
    },
  },

  card: {
    indicators: [
      "container with elevated appearance",
      "white or light background",
      "shadow or border styling",
      "content sections (header, body, footer)",
      "grouped related content",
    ],
    measurements: {
      minWidth: 200,
      minHeight: 150,
      aspectRatio: { min: 0.8, max: 2.5 },
    },
  },

  heading: {
    indicators: [
      "larger text size than surrounding text",
      "bold or heavy font weight",
      "positioned at top of sections",
      "darker color than body text",
      "clear hierarchical importance",
    ],
    measurements: {
      minHeight: 24,
      fontSizeRanges: {
        h1: { min: 32, max: 64 },
        h2: { min: 24, max: 48 },
        h3: { min: 20, max: 32 },
        h4: { min: 16, max: 24 },
      },
    },
  },
};

export const LAYOUT_DETECTION_PATTERNS = {
  flexRow: {
    indicators: [
      "elements aligned horizontally",
      "consistent vertical positioning",
      "regular spacing between items",
      "left-to-right flow",
    ],
    detection: "elements share similar Y coordinates within 20px tolerance",
  },

  flexColumn: {
    indicators: [
      "elements stacked vertically",
      "consistent horizontal alignment",
      "regular vertical spacing",
      "top-to-bottom flow",
    ],
    detection: "elements share similar X coordinates within 20px tolerance",
  },

  grid: {
    indicators: [
      "elements arranged in rows and columns",
      "consistent spacing in both directions",
      "rectangular grid pattern",
      "multiple items per row",
    ],
    detection: "elements form matrix pattern with 2+ rows and 2+ columns",
  },
};

export const COLOR_ANALYSIS_PATTERNS = {
  primary: {
    detection:
      "most prominent action color (usually blue, green, or brand color)",
    usage: "buttons, links, primary actions",
    chakraMapping: "colorScheme='blue'",
  },

  secondary: {
    detection: "subdued action color or outline styling",
    usage: "secondary buttons, outlined elements",
    chakraMapping: "variant='outline'",
  },

  background: {
    detection: "most frequent color, usually light/white",
    usage: "container backgrounds, page background",
    chakraMapping: "bg='white' or bg='gray.50'",
  },

  text: {
    detection: "high contrast with background, usually dark",
    usage: "body text, headings",
    chakraMapping: "color='gray.800' or color='gray.600'",
  },

  border: {
    detection: "subtle color for borders and dividers",
    usage: "input borders, card borders, dividers",
    chakraMapping: "borderColor='gray.200'",
  },
};

export const FORM_PATTERNS = {
  loginForm: {
    elements: [
      "email input",
      "password input",
      "submit button",
      "optional remember checkbox",
    ],
    layout: "vertical stack with consistent spacing",
    styling: "clean, minimal, focus on usability",
  },

  signupForm: {
    elements: [
      "name inputs",
      "email input",
      "password input",
      "confirm password",
      "submit button",
    ],
    layout: "vertical or two-column layout",
    styling: "welcoming, clear validation states",
  },

  contactForm: {
    elements: [
      "name input",
      "email input",
      "message textarea",
      "submit button",
    ],
    layout: "vertical stack with textarea larger",
    styling: "professional, accessible",
  },

  searchForm: {
    elements: ["search input", "search button or icon", "optional filters"],
    layout: "horizontal or input with button",
    styling: "prominent, easy to find",
  },
};

export const CHAKRA_BEST_PRACTICES = {
  spacing: {
    rule: "Use Chakra spacing scale (1=4px, 2=8px, 4=16px, 6=24px, 8=32px)",
    examples: [
      "p={4} instead of padding='16px'",
      "mt={6} instead of marginTop='24px'",
      "spacing={4} for Stack components",
    ],
  },

  colors: {
    rule: "Use Chakra color scales (gray.50 to gray.900, blue.50 to blue.900)",
    examples: [
      "bg='gray.50' for light backgrounds",
      "color='gray.800' for dark text",
      "colorScheme='blue' for themed components",
    ],
  },

  responsiveness: {
    rule: "Use responsive object syntax for breakpoints",
    examples: [
      "w={{ base: '100%', md: '400px' }}",
      "fontSize={{ base: 'md', lg: 'lg' }}",
      "columns={{ base: 1, md: 2, lg: 3 }}",
    ],
  },

  accessibility: {
    rule: "Include proper ARIA attributes and semantic HTML",
    examples: [
      "as='main' for main content areas",
      "aria-label for icon buttons",
      "alt text for images",
    ],
  },

  interactivity: {
    rule: "Include hover and focus states for interactive elements",
    examples: [
      "_hover={{ bg: 'blue.600' }} for buttons",
      "_focus={{ borderColor: 'blue.500' }} for inputs",
      "_active={{ transform: 'scale(0.95)' }} for pressed states",
    ],
  },
};

// Context-aware code generation based on component relationships
export const COMPONENT_RELATIONSHIPS = {
  formField: {
    structure: "FormControl > FormLabel + Input + FormHelperText",
    spacing: "mb={4} between form fields",
    validation: "include FormErrorMessage for required fields",
  },

  cardWithAction: {
    structure: "Card > CardBody > (content) + CardFooter > Button",
    spacing: "p={5} for CardBody, pt={0} for CardFooter",
    styling: "shadow='md' and borderRadius='lg'",
  },

  navigationHeader: {
    structure: "Flex as='header' > Logo + Spacer + Navigation + Actions",
    spacing: "p={4} horizontal padding",
    styling: "borderBottom='1px' and shadow='sm'",
  },

  heroSection: {
    structure: "Box > Container > VStack > Heading + Text + Button",
    spacing: "py={20} for section, spacing={6} for VStack",
    styling: "textAlign='center' and maxW='4xl'",
  },
};

export function getComponentContext(
  type: string,
  surroundingElements: any[]
): any {
  // Analyze surrounding elements to provide better context
  const context = {
    isInForm: surroundingElements.some(
      (el) => el.type === "input" || el.type === "button"
    ),
    isInCard: surroundingElements.some((el) => el.type === "card"),
    isInNavigation: surroundingElements.some((el) => el.type === "navigation"),
    hasMultipleButtons:
      surroundingElements.filter((el) => el.type === "button").length > 1,
    hasFormElements: surroundingElements.some((el) =>
      ["input", "textarea", "select", "checkbox", "radio"].includes(el.type)
    ),
  };

  return context;
}

export function enhanceComponentDetection(elements: any[]): any[] {
  return elements.map((element, index) => {
    const context = getComponentContext(element.type, elements);

    // Enhance based on context
    if (element.type === "button" && context.isInForm) {
      element.variant = element.variant || "solid";
      element.formRole = "submit";
    }

    if (element.type === "input" && context.isInForm) {
      element.formProperties = {
        ...element.formProperties,
        required: true, // Assume form inputs are required
      };
    }

    if (element.type === "text" && index === 0) {
      // First text element is likely a heading
      element.type = "heading";
      element.styling = {
        ...element.styling,
        fontSize: "lg",
        fontWeight: "bold",
      };
    }

    return element;
  });
}
