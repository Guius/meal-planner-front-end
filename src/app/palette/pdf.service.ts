import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { RandomRecipeDto } from './random-recipe.dto';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generatePdf(
    simplifiedIngredientsList: string[],
    recipes: RandomRecipeDto[]
  ): void {
    const pdf = new jsPDF();

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
}
