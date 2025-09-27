import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  constructor() {}

  // Example method - you can add your user preferences logic here
  getUserPreferences(): Observable<any> {
    return of({
      theme: 'light',
      notifications: true,
      language: 'en'
    });
  }

  updateUserPreferences(preferences: any): Observable<any> {
    // Here you would typically make an HTTP call to update user preferences
    console.log('Updating user preferences:', preferences);
    return of(preferences);
  }
}