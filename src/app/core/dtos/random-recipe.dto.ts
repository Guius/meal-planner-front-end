import { Diet } from '../types/diet.type';
import { Ingredient } from '../types/ingredient.type';
import { InstructionStep } from '../types/instruction-step.type';
import { Nutrition } from '../types/nutrition.type';

export interface RandomRecipeDto {
  id: string;
  description: string;
  diet: Diet;
  keywords: string[];
  name: string;
  nutrition: Nutrition;
  recipeCategory: string;
  recipeCuisine: string;
  recipeIngredient: Ingredient[];
  recipeInstructions: InstructionStep[];
  recipeYield: number;
  totalTime: string;
  recipeUrl: string;
}
