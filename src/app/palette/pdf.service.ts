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
    pdf.setFontSize(24); // Large title font size
    pdf.text('Meal Plan', 10, 20); // Title at (x:10, y:20)

    pdf.setFontSize(16); // Subtitle font size
    pdf.text('List of Meals', 10, 40); // Subtitle at (x:10, y:40)

    // Example list of meals
    let meals: string[] = [];
    for (let i = 0; i < recipes.length; i++) {
      meals.push(recipes[i].name);
    }

    pdf.setFontSize(12); // Regular content font size
    meals.forEach((meal, index) => {
      pdf.text(`${index + 1}. ${meal}`, 10, 50 + index * 10); // Dynamic positioning
    });

    // Add second page
    pdf.addPage();

    // Second page: Ingredients List
    pdf.setFontSize(20); // Medium title font size
    pdf.text('Ingredients List', 10, 20); // Title at (x:10, y:20)

    // Example list of ingredients
    pdf.setFontSize(12); // Regular content font size
    simplifiedIngredientsList.forEach((ingredient, index) => {
      pdf.text(`${index + 1}. ${ingredient}`, 10, 30 + index * 10); // Dynamic positioning
    });

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
