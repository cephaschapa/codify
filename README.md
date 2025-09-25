# 🎨 Design to Code - ChakraUI Generator

Transform design snapshots into production-ready ChakraUI React components using AI-powered analysis.

![Design to Code](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![ChakraUI](https://img.shields.io/badge/ChakraUI-v3.27.0-319795?style=for-the-badge&logo=chakra-ui)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🤖 **AI-Powered Analysis**

- **GPT Vision API** for intelligent design recognition
- **30+ Component Types** detected (buttons, forms, cards, navigation, etc.)
- **Real Text Extraction** from design images
- **Smart Layout Detection** (flex, grid, page structure)

### 🎯 **Precise Component Generation**

- **Pixel-Perfect Styling** (shadows, borders, spacing)
- **Advanced Form Elements** (inputs, selects, checkboxes, validation)
- **Visual Properties** (border radius, shadows, opacity, z-index)
- **State Management** (hover, focus, disabled, loading states)

### 🏗️ **Page Layout Generation**

- **Full Page Structures** (header, sidebar, footer, content)
- **Section-Based Code** with proper component hierarchy
- **Responsive Layouts** with proper containers
- **Page Type Detection** (landing, dashboard, blog, etc.)

### 👀 **Live Preview & Export**

- **Tabbed Interface** (Component | Page Layout | Live Preview)
- **Real-time Preview** with actual styling
- **Multiple Export Options** (copy, download, component/page code)
- **Debug Panel** showing analysis details

## 🚀 Quick Start

### 1. **Clone & Install**

```bash
git clone https://github.com/cephaschapa/codify.git
cd codify
npm install
```

### 2. **Set up Vision AI** (Optional but Recommended)

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How It Works

### **1. Upload Design**

- Drag & drop any UI design image
- Supports PNG, JPG, JPEG, GIF, BMP, WebP
- Works with screenshots, mockups, or design files

### **2. AI Analysis**

- **Vision AI** analyzes the design for components and layout
- **Fallback** to Canvas analysis if Vision API unavailable
- **Real-time processing** with progress indicators

### **3. Generate Code**

- **Component Tab**: Single reusable component
- **Page Layout Tab**: Full page structure with sections
- **Live Preview Tab**: Interactive preview of generated UI

### **4. Export & Use**

- Copy generated ChakraUI code
- Download as `.tsx` files
- Ready for production use

## 🔧 Architecture

### **Core Analysis Systems**

- **`src/utils/imageAnalysis.ts`** - Canvas-based image processing
- **`src/utils/visionAnalysis.ts`** - GPT Vision API integration
- **`src/utils/detailedCodeGenerator.ts`** - Precise ChakraUI code generation
- **`src/utils/pageLayoutGenerator.ts`** - Full page layout generation

### **UI Components**

- **`src/components/ImageUpload.tsx`** - Drag & drop upload interface
- **`src/components/TabbedOutput.tsx`** - Multi-tab code display
- **`src/components/AnalysisDebug.tsx`** - Debug information panel
- **`src/components/VisionStatus.tsx`** - AI status indicator

## 🎨 Supported Components

### **Basic Elements**

- Text, Headings, Buttons, Images, Containers

### **Form Elements**

- Input (text, email, password, number, etc.)
- Textarea, Select, Checkbox, Radio, Switch
- Form validation states and labels

### **Advanced UI**

- Cards, Badges, Alerts, Avatars, Dividers
- Progress bars, Spinners, Tables, Lists
- Breadcrumbs, Tabs, Accordions, Menus

### **Layout Components**

- Flex layouts (HStack, VStack)
- Grid layouts (SimpleGrid)
- Page sections (Header, Footer, Sidebar)

## 🎯 Perfect For

- **Landing Page Designs** → Complete page layouts
- **Dashboard Mockups** → Component libraries
- **Mobile App Interfaces** → Screen components
- **Form Designs** → Validation and styling
- **Design Systems** → Component documentation

## 📊 Analysis Capabilities

### **Visual Properties**

- Border radius (none to full)
- Shadows (xs to 2xl, inner)
- Border widths (0 to 8px)
- Font sizes (xs to 6xl)
- Font weights (thin to black)
- Opacity and transparency
- Z-index layering

### **Layout Detection**

- Flexbox arrangements
- Grid patterns
- Absolute positioning
- Responsive containers
- Section boundaries

### **Color Analysis**

- Dominant color extraction
- Background/text contrast
- Accent color detection
- Gradient recognition
- State colors (hover/focus)

## 🤖 AI Integration

### **GPT Vision API**

- Intelligent component recognition
- Real text content extraction
- Advanced layout understanding
- Property and state detection

### **Fallback System**

- Canvas-based analysis when Vision AI unavailable
- Automatic method switching
- Visual indicators for analysis method used

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: ChakraUI v3.27.0
- **Styling**: Tailwind CSS v3.4
- **AI Integration**: OpenAI GPT-4 Vision
- **Image Processing**: Canvas API
- **Language**: TypeScript
- **Code Highlighting**: react-syntax-highlighter

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built for hackday project
- Powered by OpenAI GPT Vision
- UI components by ChakraUI
- Inspired by the need for faster design-to-code workflows

---

**Transform any design into clean, production-ready ChakraUI code in seconds!** 🚀
