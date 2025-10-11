import { RandomRecipeDto } from '../dtos/random-recipe.dto';
import { Diet } from './diet.type';

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
