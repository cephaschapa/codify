export interface ColorPalette {
  dominant: string;
  palette: string[];
  background: string;
  text: string;
  accent: string;
}

export interface DetectedElement {
  type:
    | "button"
    | "text"
    | "heading"
    | "input"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "switch"
    | "card"
    | "image"
    | "container"
    | "navigation"
    | "form"
    | "badge"
    | "alert"
    | "tooltip"
    | "modal"
    | "divider"
    | "breadcrumb"
    | "stepper"
    | "tabs"
    | "accordion"
    | "menu"
    | "avatar"
    | "icon"
    | "link"
    | "list"
    | "table"
    | "progress"
    | "spinner";
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  colors: {
    background?: string;
    text?: string;
    border?: string;
    hover?: string;
    focus?: string;
    gradient?: {
      from: string;
      to: string;
    };
  };
  content?: string;
  confidence: number;
  styling?: {
    fontSize?:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    fontWeight?:
      | "thin"
      | "light"
      | "normal"
      | "medium"
      | "semibold"
      | "bold"
      | "extrabold"
      | "black";
    borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    shadow?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
    borderWidth?: "0" | "1" | "2" | "4" | "8";
    padding?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    margin?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    opacity?: number;
    zIndex?: number;
  };
  variant?: "solid" | "outline" | "ghost" | "link" | "subtle" | "surface";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  state?: "default" | "hover" | "focus" | "active" | "disabled" | "loading";
  formProperties?: {
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    type?:
      | "text"
      | "email"
      | "password"
      | "number"
      | "tel"
      | "url"
      | "search"
      | "date"
      | "time";
    validation?: "error" | "warning" | "success";
  };
  accessibility?: {
    ariaLabel?: string;
    role?: string;
  };
}

export interface LayoutAnalysis {
  type: "flex" | "grid" | "absolute";
  direction?: "row" | "column";
  alignment?: "start" | "center" | "end" | "space-between" | "space-around";
  gap?: number;
  padding?: number;
}

export interface PageSection {
  name:
    | "header"
    | "navigation"
    | "hero"
    | "content"
    | "sidebar"
    | "footer"
    | "cta";
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  elements: number[]; // indices of elements in this section
}

export interface PageLayout {
  type:
    | "landing"
    | "dashboard"
    | "blog"
    | "profile"
    | "form"
    | "ecommerce"
    | "documentation";
  structure:
    | "header-main-footer"
    | "sidebar-main"
    | "header-sidebar-main-footer"
    | "fullscreen";
  sections: PageSection[];
}

export interface UIPatterns {
  isForm: boolean;
  isNavigation: boolean;
  isCard: boolean;
  isList: boolean;
  isModal: boolean;
  isHeader: boolean;
  isFooter: boolean;
  isSidebar: boolean;
  isLandingPage: boolean;
  isDashboard: boolean;
  isBlogPost: boolean;
  isProfilePage: boolean;
}

export interface ImageAnalysisResult {
  colors: ColorPalette;
  elements: DetectedElement[];
  layout: LayoutAnalysis;
  dimensions: {
    width: number;
    height: number;
  };
  pageLayout?: PageLayout;
  patterns?: UIPatterns;
}

export class ImageAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          // Set canvas dimensions
          this.canvas.width = img.width;
          this.canvas.height = img.height;

          // Draw image to canvas
          this.ctx.drawImage(img, 0, 0);

          // Perform analysis
          const colors = this.extractColors();
          const elements = this.detectElements();
          const layout = this.analyzeLayout(elements);

          resolve({
            colors,
            elements,
            layout,
            dimensions: {
              width: img.width,
              height: img.height,
            },
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  private extractColors(): ColorPalette {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;

    // Sample colors from different regions
    const colorCounts = new Map<string, number>();
    const sampleSize = 100; // Sample every 100th pixel for performance

    for (let i = 0; i < data.length; i += 4 * sampleSize) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Convert to hex
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`;
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }

    // Sort by frequency and get top colors
    const sortedColors = Array.from(colorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([color]) => color);

    // Analyze color properties
    const dominant = sortedColors[0] || "#ffffff";
    const background = this.detectBackgroundColor(sortedColors);
    const text = this.detectTextColor(background);
    const accent = this.detectAccentColor(sortedColors, background);

    return {
      dominant,
      palette: sortedColors.slice(0, 5),
      background,
      text,
      accent,
    };
  }

  private detectBackgroundColor(colors: string[]): string {
    // Simple heuristic: assume background is the most frequent light color
    // or the color found in corners
    const corners = [
      this.getPixelColor(0, 0),
      this.getPixelColor(this.canvas.width - 1, 0),
      this.getPixelColor(0, this.canvas.height - 1),
      this.getPixelColor(this.canvas.width - 1, this.canvas.height - 1),
    ];

    // Find most common corner color
    const cornerColorCounts = new Map<string, number>();
    corners.forEach((color) => {
      cornerColorCounts.set(color, (cornerColorCounts.get(color) || 0) + 1);
    });

    const mostCommonCorner = Array.from(cornerColorCounts.entries()).sort(
      ([, a], [, b]) => b - a
    )[0];

    return mostCommonCorner ? mostCommonCorner[0] : colors[0] || "#ffffff";
  }

  private detectTextColor(backgroundColor: string): string {
    // Simple contrast-based text color detection
    const bgLuminance = this.getLuminance(backgroundColor);
    return bgLuminance > 0.5 ? "#000000" : "#ffffff";
  }

  private detectAccentColor(colors: string[], backgroundColor: string): string {
    // Find a color that contrasts well with background
    for (const color of colors) {
      if (
        color !== backgroundColor &&
        this.getContrast(color, backgroundColor) > 3
      ) {
        return color;
      }
    }
    return "#007bff"; // Default blue
  }

  private detectElements(): DetectedElement[] {
    const elements: DetectedElement[] = [];

    // Simple edge detection for rectangular elements
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const edges = this.detectEdges(imageData);
    const rectangles = this.findRectangles(edges);

    // Convert rectangles to elements with basic classification
    rectangles.forEach((rect) => {
      const element = this.classifyElement(rect);
      if (element) {
        elements.push(element);
      }
    });

    return elements;
  }

  private detectEdges(imageData: ImageData): ImageData {
    // Simple Sobel edge detection
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const edges = new ImageData(width, height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Get surrounding pixel intensities
        const intensities = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
            const intensity =
              (data[neighborIdx] +
                data[neighborIdx + 1] +
                data[neighborIdx + 2]) /
              3;
            intensities.push(intensity);
          }
        }

        // Sobel operators
        const gx =
          -1 * intensities[0] +
          1 * intensities[2] +
          -2 * intensities[3] +
          2 * intensities[5] +
          -1 * intensities[6] +
          1 * intensities[8];

        const gy =
          -1 * intensities[0] +
          -2 * intensities[1] +
          -1 * intensities[2] +
          1 * intensities[6] +
          2 * intensities[7] +
          1 * intensities[8];

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const threshold = 50;

        edges.data[idx] = magnitude > threshold ? 255 : 0;
        edges.data[idx + 1] = magnitude > threshold ? 255 : 0;
        edges.data[idx + 2] = magnitude > threshold ? 255 : 0;
        edges.data[idx + 3] = 255;
      }
    }

    return edges;
  }

  private findRectangles(
    edges: ImageData
  ): Array<{ x: number; y: number; width: number; height: number }> {
    // Simplified rectangle detection using connected components
    const rectangles: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    const width = edges.width;
    const height = edges.height;
    const visited = new Array(width * height).fill(false);

    // Simple approach: look for rectangular regions with strong color differences
    // We'll use the original image data instead of edges for better detection
    const originalData = this.ctx.getImageData(0, 0, width, height);

    // Grid-based sampling to find potential UI elements
    const sampleSize = 20; // Sample every 20 pixels

    for (let y = 0; y < height - sampleSize; y += sampleSize) {
      for (let x = 0; x < width - sampleSize; x += sampleSize) {
        if (visited[y * width + x]) continue;

        // Check if this region has consistent properties (potential UI element)
        const region = this.analyzeRegion(
          originalData,
          x,
          y,
          sampleSize,
          sampleSize
        );

        if (region.isUIElement) {
          // Try to expand the region to find the full element bounds
          const bounds = this.expandRegion(
            originalData,
            x,
            y,
            region.avgColor,
            visited
          );

          if (bounds.width > 30 && bounds.height > 20) {
            // Minimum size threshold
            rectangles.push(bounds);

            // Mark region as visited
            for (let ry = bounds.y; ry < bounds.y + bounds.height; ry += 5) {
              for (let rx = bounds.x; rx < bounds.x + bounds.width; rx += 5) {
                if (ry < height && rx < width) {
                  visited[ry * width + rx] = true;
                }
              }
            }
          }
        }
      }
    }

    return rectangles;
  }

  private analyzeRegion(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number
  ): { isUIElement: boolean; avgColor: string; variance: number } {
    const data = imageData.data;
    const imgWidth = imageData.width;

    let totalR = 0,
      totalG = 0,
      totalB = 0;
    let pixelCount = 0;
    const colors: number[][] = [];

    // Sample colors in the region
    for (let dy = 0; dy < height && y + dy < imageData.height; dy += 2) {
      for (let dx = 0; dx < width && x + dx < imgWidth; dx += 2) {
        const idx = ((y + dy) * imgWidth + (x + dx)) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a > 128) {
          // Skip transparent pixels
          totalR += r;
          totalG += g;
          totalB += b;
          colors.push([r, g, b]);
          pixelCount++;
        }
      }
    }

    if (pixelCount === 0) {
      return { isUIElement: false, avgColor: "#ffffff", variance: 0 };
    }

    const avgR = Math.round(totalR / pixelCount);
    const avgG = Math.round(totalG / pixelCount);
    const avgB = Math.round(totalB / pixelCount);
    const avgColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB)
      .toString(16)
      .slice(1)}`;

    // Calculate color variance
    let variance = 0;
    colors.forEach(([r, g, b]) => {
      variance +=
        Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2);
    });
    variance = variance / colors.length;

    // A UI element typically has:
    // - Low color variance (consistent color)
    // - Different color from background
    // - Reasonable contrast with surroundings
    const isConsistent = variance < 2000; // Low variance indicates solid color
    const hasContrast = this.hasContrastWithSurroundings(
      imageData,
      x,
      y,
      width,
      height,
      avgColor
    );

    return {
      isUIElement: isConsistent && hasContrast,
      avgColor,
      variance,
    };
  }

  private hasContrastWithSurroundings(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number,
    elementColor: string
  ): boolean {
    // Check pixels around the border of the region
    const borderPixels: string[] = [];
    const data = imageData.data;
    const imgWidth = imageData.width;
    const imgHeight = imageData.height;

    // Sample border pixels
    for (let i = 0; i < width; i += 5) {
      // Top border
      if (y > 0 && x + i < imgWidth) {
        const idx = ((y - 1) * imgWidth + (x + i)) * 4;
        const color = `#${(
          (1 << 24) +
          (data[idx] << 16) +
          (data[idx + 1] << 8) +
          data[idx + 2]
        )
          .toString(16)
          .slice(1)}`;
        borderPixels.push(color);
      }
      // Bottom border
      if (y + height < imgHeight && x + i < imgWidth) {
        const idx = ((y + height) * imgWidth + (x + i)) * 4;
        const color = `#${(
          (1 << 24) +
          (data[idx] << 16) +
          (data[idx + 1] << 8) +
          data[idx + 2]
        )
          .toString(16)
          .slice(1)}`;
        borderPixels.push(color);
      }
    }

    for (let i = 0; i < height; i += 5) {
      // Left border
      if (x > 0 && y + i < imgHeight) {
        const idx = ((y + i) * imgWidth + (x - 1)) * 4;
        const color = `#${(
          (1 << 24) +
          (data[idx] << 16) +
          (data[idx + 1] << 8) +
          data[idx + 2]
        )
          .toString(16)
          .slice(1)}`;
        borderPixels.push(color);
      }
      // Right border
      if (x + width < imgWidth && y + i < imgHeight) {
        const idx = ((y + i) * imgWidth + (x + width)) * 4;
        const color = `#${(
          (1 << 24) +
          (data[idx] << 16) +
          (data[idx + 1] << 8) +
          data[idx + 2]
        )
          .toString(16)
          .slice(1)}`;
        borderPixels.push(color);
      }
    }

    // Check if element color contrasts with surrounding colors
    let contrastCount = 0;
    borderPixels.forEach((borderColor) => {
      if (this.getContrast(elementColor, borderColor) > 1.5) {
        contrastCount++;
      }
    });

    return contrastCount > borderPixels.length * 0.3; // At least 30% contrast
  }

  private expandRegion(
    imageData: ImageData,
    startX: number,
    startY: number,
    targetColor: string,
    visited: boolean[]
  ): { x: number; y: number; width: number; height: number } {
    const width = imageData.width;
    const height = imageData.height;

    // Simple expansion - find the bounding box of similar colored pixels
    let minX = startX,
      maxX = startX;
    let minY = startY,
      maxY = startY;

    const tolerance = 50; // Color tolerance for expansion
    const targetRGB = this.hexToRgb(targetColor);

    // Expand horizontally
    for (let x = startX; x < width; x += 2) {
      const color = this.getPixelColor(x, startY);
      const rgb = this.hexToRgb(color);
      if (this.colorDistance(targetRGB, rgb) < tolerance) {
        maxX = x;
      } else {
        break;
      }
    }

    for (let x = startX; x >= 0; x -= 2) {
      const color = this.getPixelColor(x, startY);
      const rgb = this.hexToRgb(color);
      if (this.colorDistance(targetRGB, rgb) < tolerance) {
        minX = x;
      } else {
        break;
      }
    }

    // Expand vertically
    for (let y = startY; y < height; y += 2) {
      const color = this.getPixelColor(startX, y);
      const rgb = this.hexToRgb(color);
      if (this.colorDistance(targetRGB, rgb) < tolerance) {
        maxY = y;
      } else {
        break;
      }
    }

    for (let y = startY; y >= 0; y -= 2) {
      const color = this.getPixelColor(startX, y);
      const rgb = this.hexToRgb(color);
      if (this.colorDistance(targetRGB, rgb) < tolerance) {
        minY = y;
      } else {
        break;
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private classifyElement(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): DetectedElement | null {
    const aspectRatio = rect.width / rect.height;
    const area = rect.width * rect.height;

    // Get the dominant color of this element
    const elementImageData = this.ctx.getImageData(
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
    const elementColor = this.getDominantColor(elementImageData);

    // More sophisticated classification
    let type: DetectedElement["type"];
    let confidence = 0.5;

    // Button detection: wider than tall, medium size, often rectangular
    if (
      aspectRatio >= 1.5 &&
      aspectRatio <= 6 &&
      rect.height >= 20 &&
      rect.height <= 80 &&
      rect.width >= 60 &&
      rect.width <= 300
    ) {
      type = "button";
      confidence = 0.8;
    }
    // Text detection: very wide, short height
    else if (aspectRatio > 4 && rect.height <= 40) {
      type = "text";
      confidence = 0.7;
    }
    // Input field detection: wide but not too wide, consistent height
    else if (
      aspectRatio >= 2 &&
      aspectRatio <= 8 &&
      rect.height >= 25 &&
      rect.height <= 60 &&
      rect.width >= 100
    ) {
      type = "input";
      confidence = 0.6;
    }
    // Card detection: larger rectangular areas, roughly square to moderately rectangular
    else if (area > 5000 && aspectRatio >= 0.5 && aspectRatio <= 3) {
      type = "card";
      confidence = 0.7;
    }
    // Image detection: square or rectangular, medium to large size
    else if (area > 2000 && aspectRatio >= 0.7 && aspectRatio <= 1.5) {
      type = "image";
      confidence = 0.6;
    }
    // Container: everything else that's reasonably sized
    else if (area > 1000) {
      type = "container";
      confidence = 0.4;
    } else {
      // Too small to be a meaningful UI element
      return null;
    }

    return {
      type,
      bounds: rect,
      colors: {
        background: elementColor,
      },
      confidence,
    };
  }

  private getDominantColor(imageData: ImageData): string {
    const data = imageData.data;
    const colorCounts = new Map<string, number>();

    // Sample every few pixels for performance
    for (let i = 0; i < data.length; i += 4 * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 128) {
        // Skip transparent pixels
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)}`;
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
      }
    }

    // Return the most frequent color
    const sortedColors = Array.from(colorCounts.entries()).sort(
      ([, a], [, b]) => b - a
    );

    return sortedColors.length > 0 ? sortedColors[0][0] : "#ffffff";
  }

  private analyzeLayout(elements: DetectedElement[]): LayoutAnalysis {
    if (elements.length < 2) {
      return { type: "absolute" };
    }

    // Sort elements by position for better analysis
    const sortedByY = [...elements].sort((a, b) => a.bounds.y - b.bounds.y);
    const sortedByX = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);

    // Advanced layout analysis
    const layoutMetrics = this.calculateLayoutMetrics(elements);

    // Check for grid pattern first (most structured)
    if (this.isGridLayout(elements, layoutMetrics)) {
      return {
        type: "grid",
        alignment: layoutMetrics.alignment,
        gap: layoutMetrics.averageGap,
        padding: layoutMetrics.containerPadding,
      };
    }

    // Check for flex layouts
    const horizontalAlignment = this.checkHorizontalAlignment(elements);
    const verticalAlignment = this.checkVerticalAlignment(elements);

    if (horizontalAlignment > 0.6) {
      return {
        type: "flex",
        direction: "row",
        alignment: this.determineFlexAlignment(sortedByX, "horizontal"),
        gap: layoutMetrics.horizontalGap,
        padding: layoutMetrics.containerPadding,
      };
    } else if (verticalAlignment > 0.6) {
      return {
        type: "flex",
        direction: "column",
        alignment: this.determineFlexAlignment(sortedByY, "vertical"),
        gap: layoutMetrics.verticalGap,
        padding: layoutMetrics.containerPadding,
      };
    }

    return {
      type: "absolute",
      padding: layoutMetrics.containerPadding,
    };
  }

  private calculateLayoutMetrics(elements: DetectedElement[]) {
    // Calculate spacing between elements
    const horizontalGaps: number[] = [];
    const verticalGaps: number[] = [];

    // Sort elements for gap calculation
    const sortedByX = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);
    const sortedByY = [...elements].sort((a, b) => a.bounds.y - b.bounds.y);

    // Calculate horizontal gaps
    for (let i = 1; i < sortedByX.length; i++) {
      const prev = sortedByX[i - 1];
      const curr = sortedByX[i];
      const gap = curr.bounds.x - (prev.bounds.x + prev.bounds.width);
      if (gap > 0) horizontalGaps.push(gap);
    }

    // Calculate vertical gaps
    for (let i = 1; i < sortedByY.length; i++) {
      const prev = sortedByY[i - 1];
      const curr = sortedByY[i];
      const gap = curr.bounds.y - (prev.bounds.y + prev.bounds.height);
      if (gap > 0) verticalGaps.push(gap);
    }

    // Find container boundaries
    const minX = Math.min(...elements.map((e) => e.bounds.x));
    const minY = Math.min(...elements.map((e) => e.bounds.y));
    const maxX = Math.max(...elements.map((e) => e.bounds.x + e.bounds.width));
    const maxY = Math.max(...elements.map((e) => e.bounds.y + e.bounds.height));

    // Estimate container padding (distance from edges)
    const containerPadding = Math.max(8, Math.min(minX, minY, 32));

    return {
      horizontalGap:
        horizontalGaps.length > 0
          ? Math.round(this.median(horizontalGaps))
          : 16,
      verticalGap:
        verticalGaps.length > 0 ? Math.round(this.median(verticalGaps)) : 16,
      averageGap: Math.round(
        ((horizontalGaps.length > 0 ? this.median(horizontalGaps) : 16) +
          (verticalGaps.length > 0 ? this.median(verticalGaps) : 16)) /
          2
      ),
      containerPadding: Math.round(containerPadding),
      containerBounds: { minX, minY, maxX, maxY },
      alignment: this.determineAlignment(elements),
    };
  }

  private isGridLayout(elements: DetectedElement[], metrics: any): boolean {
    if (elements.length < 4) return false;

    // Check if elements form rows and columns
    const rows = this.groupElementsIntoRows(elements);
    const cols = this.groupElementsIntoColumns(elements);

    // Grid if we have multiple rows AND columns with consistent spacing
    const hasMultipleRows = rows.length >= 2;
    const hasMultipleColumns = cols.length >= 2;
    const hasConsistentSpacing = this.hasConsistentSpacing(elements);

    return hasMultipleRows && hasMultipleColumns && hasConsistentSpacing;
  }

  private groupElementsIntoRows(
    elements: DetectedElement[]
  ): DetectedElement[][] {
    const tolerance = 20;
    const rows: DetectedElement[][] = [];
    const sortedByY = [...elements].sort((a, b) => a.bounds.y - b.bounds.y);

    for (const element of sortedByY) {
      let addedToRow = false;

      for (const row of rows) {
        const rowY = row[0].bounds.y;
        if (Math.abs(element.bounds.y - rowY) <= tolerance) {
          row.push(element);
          addedToRow = true;
          break;
        }
      }

      if (!addedToRow) {
        rows.push([element]);
      }
    }

    return rows.filter((row) => row.length > 0);
  }

  private groupElementsIntoColumns(
    elements: DetectedElement[]
  ): DetectedElement[][] {
    const tolerance = 20;
    const columns: DetectedElement[][] = [];
    const sortedByX = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);

    for (const element of sortedByX) {
      let addedToColumn = false;

      for (const column of columns) {
        const columnX = column[0].bounds.x;
        if (Math.abs(element.bounds.x - columnX) <= tolerance) {
          column.push(element);
          addedToColumn = true;
          break;
        }
      }

      if (!addedToColumn) {
        columns.push([element]);
      }
    }

    return columns.filter((column) => column.length > 0);
  }

  private hasConsistentSpacing(elements: DetectedElement[]): boolean {
    // Check if spacing between elements is relatively consistent
    const horizontalGaps: number[] = [];
    const verticalGaps: number[] = [];

    // Similar to calculateLayoutMetrics but focused on consistency
    const sortedByX = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);
    const sortedByY = [...elements].sort((a, b) => a.bounds.y - b.bounds.y);

    for (let i = 1; i < sortedByX.length; i++) {
      const prev = sortedByX[i - 1];
      const curr = sortedByX[i];
      const gap = curr.bounds.x - (prev.bounds.x + prev.bounds.width);
      if (gap > 0) horizontalGaps.push(gap);
    }

    for (let i = 1; i < sortedByY.length; i++) {
      const prev = sortedByY[i - 1];
      const curr = sortedByY[i];
      const gap = curr.bounds.y - (prev.bounds.y + prev.bounds.height);
      if (gap > 0) verticalGaps.push(gap);
    }

    // Check consistency using standard deviation
    const hConsistent =
      horizontalGaps.length > 0
        ? this.standardDeviation(horizontalGaps) < 20
        : true;
    const vConsistent =
      verticalGaps.length > 0
        ? this.standardDeviation(verticalGaps) < 20
        : true;

    return hConsistent && vConsistent;
  }

  private determineFlexAlignment(
    sortedElements: DetectedElement[],
    direction: "horizontal" | "vertical"
  ): "start" | "center" | "end" | "space-between" | "space-around" {
    if (sortedElements.length < 2) return "start";

    const positions =
      direction === "horizontal"
        ? sortedElements.map((e) => e.bounds.x)
        : sortedElements.map((e) => e.bounds.y);

    const gaps: number[] = [];
    for (let i = 1; i < positions.length; i++) {
      gaps.push(positions[i] - positions[i - 1]);
    }

    // Check for consistent spacing (space-between/space-around)
    const gapStdDev = this.standardDeviation(gaps);
    if (gapStdDev < 10) {
      // Consistent spacing - could be space-between or space-around
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      return avgGap > 50 ? "space-between" : "space-around";
    }

    // Check alignment based on positions
    const containerSize =
      direction === "horizontal" ? this.canvas.width : this.canvas.height;
    const firstPos = positions[0];
    const lastPos = positions[positions.length - 1];

    if (firstPos < containerSize * 0.1) return "start";
    if (lastPos > containerSize * 0.9) return "end";
    if (firstPos > containerSize * 0.3 && lastPos < containerSize * 0.7)
      return "center";

    return "start";
  }

  private determineAlignment(
    elements: DetectedElement[]
  ): "start" | "center" | "end" {
    // Determine overall content alignment in container
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const avgX =
      elements.reduce((sum, e) => sum + e.bounds.x + e.bounds.width / 2, 0) /
      elements.length;
    const avgY =
      elements.reduce((sum, e) => sum + e.bounds.y + e.bounds.height / 2, 0) /
      elements.length;

    const xOffset = Math.abs(avgX - centerX) / centerX;
    const yOffset = Math.abs(avgY - centerY) / centerY;

    if (xOffset < 0.2 && yOffset < 0.2) return "center";
    if (avgX < centerX * 0.7) return "start";
    if (avgX > centerX * 1.3) return "end";

    return "start";
  }

  // Helper functions
  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private standardDeviation(numbers: number[]): number {
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map((n) => Math.pow(n - avg, 2));
    const avgSquaredDiff =
      squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private checkHorizontalAlignment(elements: DetectedElement[]): number {
    // Check how many elements share similar Y coordinates
    const yPositions = elements.map((el) => el.bounds.y);
    const tolerance = 10;

    let alignedCount = 0;
    for (let i = 0; i < yPositions.length; i++) {
      for (let j = i + 1; j < yPositions.length; j++) {
        if (Math.abs(yPositions[i] - yPositions[j]) <= tolerance) {
          alignedCount++;
        }
      }
    }

    return alignedCount / ((elements.length * (elements.length - 1)) / 2);
  }

  private checkVerticalAlignment(elements: DetectedElement[]): number {
    // Check how many elements share similar X coordinates
    const xPositions = elements.map((el) => el.bounds.x);
    const tolerance = 10;

    let alignedCount = 0;
    for (let i = 0; i < xPositions.length; i++) {
      for (let j = i + 1; j < xPositions.length; j++) {
        if (Math.abs(xPositions[i] - xPositions[j]) <= tolerance) {
          alignedCount++;
        }
      }
    }

    return alignedCount / ((elements.length * (elements.length - 1)) / 2);
  }

  // Helper methods
  private getPixelColor(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private getLuminance(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  private getContrast(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  private colorDistance(
    rgb1: { r: number; g: number; b: number },
    rgb2: { r: number; g: number; b: number }
  ): number {
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
  }
}
