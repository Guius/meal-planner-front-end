import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RandomRecipeDto } from './random-recipe.dto';

@Injectable()
export class PaletteService {
  constructor(private http: HttpClient) {}

  getRandomRecipes(numberOfRecipes: number): Observable<RandomRecipeDto[]> {
    return this.http.get<RandomRecipeDto[]>(
      `${environment.mealPlannerUrl}/meal-planner/random-recipes/${numberOfRecipes}`
    );
  }
}
