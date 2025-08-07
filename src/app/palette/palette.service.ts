import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Diet, RandomRecipeDto } from './random-recipe.dto';

@Injectable()
export class PaletteService {
  constructor(private http: HttpClient) {}

  getRandomRecipes(
    numberOfRecipes: number,
    recipesIdsOfPalette: string[],
    recipeIdsOfBasket: string[]
  ): Observable<RandomRecipeDto[]> {
    // return of(fakePalette);

    return this.http.get<RandomRecipeDto[]>(
      `${environment.mealPlannerUrl}/meal-planner/random-recipes`,
      {
        params: {
          recipesInBasket: recipeIdsOfBasket,
          recipesInPalette: recipesIdsOfPalette,
          numberOfRecipes: numberOfRecipes,
        },
        withCredentials: true,
      }
    );
  }

  getRandomRecipe(
    recipesIdsOfPalette: string[],
    recipeIdsOfBasket: string[]
  ): Observable<RandomRecipeDto> {
    // return of(fakePalette);

    return this.http.get<RandomRecipeDto>(
      `${environment.mealPlannerUrl}/meal-planner/random-recipe`,
      {
        params: {
          recipesInBasket: recipeIdsOfBasket,
          recipesInPalette: recipesIdsOfPalette,
        },
        withCredentials: true,
      }
    );
  }

  sendRecipesToEmail(
    selectedRecipes: RandomRecipeDto[],
    ingredientsList: string[]
  ) {
    return this.http.post(
      `${environment.mealPlannerUrl}/meal-planner/send-recipes-in-email`,
      { randomRecipes: selectedRecipes, ingredientsList: ingredientsList },
      { withCredentials: true }
    );
  }
}
