import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  constructor() {}

  // Fetch diets from the backend
  getDiets(): Observable<any> {
    return from(
      fetch(`${environment.mealPlannerUrl}/diet`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
