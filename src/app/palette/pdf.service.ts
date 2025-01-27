import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { RandomRecipeDto } from './random-recipe.dto';

// Import the custom font file

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generatePdf(
    simplifiedIngredientsList: string[],
    recipes: RandomRecipeDto[]
  ): Promise<void> {
    const pdf = new jsPDF();

    // Load the custom font as a binary string
    const myFont = await this.loadFont();

    pdf.addFileToVFS('Knewave-Regular.ttf', myFont); // Add the font data
    pdf.addFont('Knewave-Regular.ttf', 'Knewave-Regular', 'normal');

    // Set font to the custom font
    pdf.setFont('Knewave-Regular');

    // First page: Meal Plan
    // Set background color for the page
    pdf.setFillColor(230, 240, 230); // Light green
    pdf.rect(0, 0, 210, 297, 'F'); // A4 Page size (210mm x 297mm)

    // Draw rounded rectangle for the title
    pdf.setFillColor(160, 220, 200); // Title background color
    pdf.roundedRect(10, 10, 190, 30, 5, 5, 'F'); // x, y, width, height, radius

    // Add the title text
    pdf.setFontSize(24); // Large font size
    pdf.setTextColor(40, 40, 40); // Dark gray text color
    pdf.text('Meal plan', 20, 30); // Add text with some padding

    // Save the PDF
    pdf.save('Meal_Plan.pdf');
  }

  // Method to load the font as a binary string
  private async loadFont(): Promise<string> {
    const fontPath = '../assets/fonts/Knewave-Regular.ttf'; // Path to your font file
    const response = await fetch(fontPath);
    if (!response.ok) {
      throw new Error(`Failed to load font from ${fontPath}`);
    }
    const fontBuffer = await response.arrayBuffer();
    return this.arrayBufferToBase64(fontBuffer);
  }

  // Convert ArrayBuffer to Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
