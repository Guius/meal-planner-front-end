import { RandomRecipeDto, Diet } from './random-recipe.dto';

// Unified structure that contains both simplified UI data and full recipe data
export interface UnifiedRecipe {
  // Simplified data for UI display
  id: string;
  recipeName: string;
  recipeTotalTime: string;
  recipeDiet: Diet;
  simplifiedIngredientsList: string;

  // Full recipe data
  fullRecipe: RandomRecipeDto;
}

// Keep the old interface for backward compatibility if needed
export interface PaletteRecipe {
  id: string;
  recipeName: string;
  recipeTotalTime: string;
  recipeDiet: Diet;
  simplifiedIngredientsList: string[];
}
