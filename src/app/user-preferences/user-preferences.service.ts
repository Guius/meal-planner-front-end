import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DietDto {
  id: string;
  name: string;
  description?: string;
  creationDate: Date;
  lastUpdated: Date;
}
export interface PaginatedDietsResponseDto {
  data: DietDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CookDietDto {
  id: string;
  name: string;
  description?: string;
}

export interface MyDietsResponseDto {
  data: CookDietDto[];
}
@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  constructor() {}

  // Fetch diets from the backend
  getDiets(): Observable<PaginatedDietsResponseDto> {
    return from(
      fetch(`${environment.mealPlannerUrl}/diet`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          // Create error with status code for better error handling
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          throw error;
        }
        return response.json();
      })
    );
  }

  // Fetch user's selected diets
  getMyDiets(): Observable<MyDietsResponseDto> {
    return from(
      fetch(`${environment.mealPlannerUrl}/diet/my-diets`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          // Create error with status code for better error handling
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          throw error;
        }
        return response.json();
      })
    );
  }

  // Update user's selected diets
  updateMyDiets(dietIds: string[]): Observable<any> {
    return from(
      fetch(`${environment.mealPlannerUrl}/diet/my-diets`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dietIds }),
      }).then((response) => {
        if (!response.ok) {
          // Create error with status code for better error handling
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          throw error;
        }
        return response.json();
      })
    );
  }

  // Example method - you can add your user preferences logic here
  getUserPreferences(): Observable<any> {
    return of({
      theme: 'light',
      notifications: true,
      language: 'en',
    });
  }

  updateUserPreferences(preferences: any): Observable<any> {
    // Here you would typically make an HTTP call to update user preferences
    console.log('Updating user preferences:', preferences);
    return of(preferences);
  }
}
