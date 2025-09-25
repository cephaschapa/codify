# 🤖 Vision AI Setup Instructions

## Getting GPT Vision Working

The design-to-code tool now supports **GPT Vision AI** for much more accurate analysis of design images!

### 1. **Get OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. **Add Environment Variable**

1. Create a `.env.local` file in the project root
2. Add your API key:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. **Restart Development Server**

```bash
npm run dev
```

## 🎯 **What Vision AI Provides:**

### **vs Canvas Analysis (Current):**

- ❌ Basic color extraction
- ❌ Simple shape detection
- ❌ Limited element classification
- ❌ No text recognition
- ❌ Struggles with real designs

### **✅ Vision AI Analysis (New):**

- 🎨 **Accurate color extraction** from real designs
- 🔍 **Text recognition** - reads actual content
- 🧠 **Smart component detection** - buttons, inputs, cards, navigation
- 📐 **Layout understanding** - flex, grid, positioning
- 🎛️ **Property detection** - sizes, variants, styles
- 📱 **Pattern recognition** - forms, navigation, modals
- 🎯 **Real content** - uses actual text from designs

## 🚀 **Enhanced Code Generation:**

### **Before (Canvas):**

```jsx
<VStack spacing={4}>
  <Button>Action Button</Button>
  <Text>Detected Text</Text>
</VStack>
```

### **After (Vision AI):**

```jsx
<VStack spacing={6} align="stretch">
  <Heading size="lg">Sign Up for Free</Heading>
  <Input placeholder="Enter your email" size="md" />
  <Button variant="solid" size="lg" colorScheme="blue">
    Create Account
  </Button>
  <Text fontSize="sm" color="gray.600">
    Already have an account? Sign in
  </Text>
</VStack>
```

## 🔄 **Fallback System:**

The tool automatically:

1. **Tries Vision AI first** (if API key is configured)
2. **Falls back to Canvas analysis** if Vision fails
3. **Shows which method was used** with visual indicators

## 💡 **Best Results With:**

- Screenshots of real applications
- UI mockups with clear text
- Design systems and component libraries
- Landing pages and forms
- Mobile app interfaces

## 🔒 **Security Note:**

This demo uses client-side API calls for simplicity. In production, route API calls through your backend for security.

## 💰 **Cost:**

- GPT-4 Vision costs ~$0.01-0.03 per image analysis
- Very affordable for development and testing
- Consider rate limiting for production use
