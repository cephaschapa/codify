// Real ChakraUI code examples for training the Vision AI

export const CHAKRA_EXAMPLES = {
  button: {
    solid: `<Button 
  variant="solid" 
  colorScheme="blue" 
  size="md"
  borderRadius="md"
  shadow="sm"
  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
>
  Get Started
</Button>`,

    outline: `<Button 
  variant="outline" 
  colorScheme="blue" 
  size="md"
  borderWidth="2px"
  borderRadius="md"
  _hover={{ bg: "blue.50" }}
>
  Learn More
</Button>`,

    ghost: `<Button 
  variant="ghost" 
  colorScheme="gray" 
  size="sm"
  _hover={{ bg: "gray.100" }}
>
  Cancel
</Button>`,
  },

  card: {
    simple: `<Card shadow="lg" borderRadius="xl" overflow="hidden">
  <CardBody p={6}>
    <Heading size="md" mb={3}>Card Title</Heading>
    <Text color="gray.600" fontSize="sm">
      Card description with proper styling and spacing.
    </Text>
  </CardBody>
</Card>`,

    withImage: `<Card shadow="md" borderRadius="lg" overflow="hidden" bg="white">
  <Image src="/image.jpg" alt="Card image" h="200px" objectFit="cover" />
  <CardBody p={5}>
    <Heading size="md" mb={2}>Featured Article</Heading>
    <Text color="gray.600" fontSize="sm" lineHeight="tall">
      Article description goes here with proper typography.
    </Text>
  </CardBody>
  <CardFooter pt={0} pb={5} px={5}>
    <Button variant="solid" colorScheme="blue" size="sm">
      Read More
    </Button>
  </CardFooter>
</Card>`,
  },

  form: {
    input: `<FormControl isRequired>
  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
    Email Address
  </FormLabel>
  <Input
    type="email"
    placeholder="Enter your email"
    size="md"
    borderRadius="md"
    borderColor="gray.300"
    _focus={{ 
      borderColor: "blue.500", 
      boxShadow: "0 0 0 1px #3182ce" 
    }}
    _hover={{ borderColor: "gray.400" }}
  />
  <FormHelperText fontSize="xs" color="gray.500">
    We'll never share your email
  </FormHelperText>
</FormControl>`,

    textarea: `<FormControl>
  <FormLabel fontSize="sm" fontWeight="medium">Message</FormLabel>
  <Textarea
    placeholder="Enter your message..."
    rows={4}
    resize="vertical"
    borderRadius="md"
    _focus={{ borderColor: "blue.500" }}
  />
</FormControl>`,

    select: `<FormControl>
  <FormLabel fontSize="sm" fontWeight="medium">Country</FormLabel>
  <Select placeholder="Select country" size="md" borderRadius="md">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </Select>
</FormControl>`,
  },

  layout: {
    vstack: `<VStack spacing={6} align="stretch" w="full" maxW="md" mx="auto">
  <Heading size="lg" textAlign="center">Welcome</Heading>
  <Text color="gray.600" textAlign="center">
    Get started with our platform
  </Text>
  <Button colorScheme="blue" size="lg">Sign Up</Button>
</VStack>`,

    hstack: `<HStack spacing={4} align="center" justify="space-between" w="full" p={4}>
  <Heading size="md">Dashboard</Heading>
  <HStack spacing={3}>
    <Button variant="ghost" size="sm">Settings</Button>
    <Button colorScheme="blue" size="sm">Profile</Button>
  </HStack>
</HStack>`,

    grid: `<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={6}>
  <Card>
    <CardBody>
      <Heading size="md" mb={2}>Feature 1</Heading>
      <Text color="gray.600">Description</Text>
    </CardBody>
  </Card>
  <Card>
    <CardBody>
      <Heading size="md" mb={2}>Feature 2</Heading>
      <Text color="gray.600">Description</Text>
    </CardBody>
  </Card>
</SimpleGrid>`,
  },

  navigation: {
    header: `<Flex 
  as="header" 
  align="center" 
  justify="space-between" 
  wrap="wrap" 
  w="full" 
  p={4} 
  bg="white" 
  borderBottom="1px" 
  borderColor="gray.200"
  shadow="sm"
>
  <Heading size="md" color="gray.800">Brand</Heading>
  <HStack spacing={4}>
    <Button variant="ghost" size="sm">About</Button>
    <Button variant="ghost" size="sm">Contact</Button>
    <Button colorScheme="blue" size="sm">Sign In</Button>
  </HStack>
</Flex>`,

    sidebar: `<Box
  as="nav"
  w="250px"
  h="100vh"
  bg="gray.50"
  borderRight="1px"
  borderColor="gray.200"
  p={4}
  position="fixed"
  left="0"
  top="0"
>
  <VStack spacing={2} align="stretch">
    <Button variant="ghost" justifyContent="flex-start" size="sm">
      Dashboard
    </Button>
    <Button variant="ghost" justifyContent="flex-start" size="sm">
      Analytics
    </Button>
    <Button variant="ghost" justifyContent="flex-start" size="sm">
      Settings
    </Button>
  </VStack>
</Box>`,
  },
};

export const DESIGN_TO_CODE_EXAMPLES = [
  {
    description: "Simple blue button with shadow",
    expectedCode: `<Button 
  variant="solid" 
  colorScheme="blue" 
  size="md"
  borderRadius="md"
  shadow="sm"
>
  Get Started
</Button>`,
  },
  {
    description: "Email input field with label and validation",
    expectedCode: `<FormControl isRequired>
  <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
  <Input
    type="email"
    placeholder="Enter your email"
    size="md"
    borderRadius="md"
    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
  />
  <FormErrorMessage>Email is required</FormErrorMessage>
</FormControl>`,
  },
  {
    description: "Card with image, title, and button",
    expectedCode: `<Card shadow="lg" borderRadius="xl" overflow="hidden" maxW="sm">
  <Image src="/image.jpg" alt="Feature" h="200px" objectFit="cover" />
  <CardBody p={5}>
    <Heading size="md" mb={2}>Feature Title</Heading>
    <Text color="gray.600" fontSize="sm" mb={4}>
      Feature description with proper spacing
    </Text>
    <Button colorScheme="blue" size="sm" w="full">
      Learn More
    </Button>
  </CardBody>
</Card>`,
  },
];

export const CHAKRA_PROPS_REFERENCE = {
  spacing: {
    xs: "1",
    sm: "2",
    md: "4",
    lg: "6",
    xl: "8",
    "2xl": "10",
  },
  borderRadius: {
    none: "none",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
    full: "full",
  },
  shadow: {
    none: "none",
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
  },
  fontSize: {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
    "3xl": "3xl",
    "4xl": "4xl",
  },
};
