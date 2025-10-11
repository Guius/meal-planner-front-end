import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Diet, RandomRecipeDto } from './random-recipe.dto';

@Injectable()
export class PaletteService {
  constructor() {}

  async getRandomRecipes(
    numberOfRecipes: number,
    recipesIdsOfPalette: string[],
    recipeIdsOfBasket: string[]
  ): Promise<RandomRecipeDto[]> {
    // return of(fakePalette);

    const params = new URLSearchParams({
      recipesInBasket: recipeIdsOfBasket.join(','),
      recipesInPalette: recipesIdsOfPalette.join(','),
      numberOfRecipes: numberOfRecipes.toString(),
    });

    const response = await fetch(
      `${environment.mealPlannerUrl}/meal-planner/random-recipes?${params}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getRandomRecipe(
    recipesIdsOfPalette: string[],
    recipeIdsOfBasket: string[]
  ): Promise<RandomRecipeDto> {
    // return of(fakePalette);

    const params = new URLSearchParams({
      recipesInBasket: recipeIdsOfBasket.join(','),
      recipesInPalette: recipesIdsOfPalette.join(','),
    });

    const response = await fetch(
      `${environment.mealPlannerUrl}/meal-planner/random-recipe?${params}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async sendRecipesToEmail(
    selectedRecipes: RandomRecipeDto[],
    ingredientsList: string[]
  ): Promise<any> {
    const response = await fetch(
      `${environment.mealPlannerUrl}/meal-planner/send-recipes-in-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          randomRecipes: selectedRecipes,
          ingredientsList: ingredientsList,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
