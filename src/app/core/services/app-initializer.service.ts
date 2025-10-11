import { Injectable } from '@angular/core';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private cleanupInterceptor?: () => void;

  constructor(private authInterceptor: AuthInterceptor) {}

  /**
   * Initializes the application by setting up the fetch interceptor
   * This should be called during app initialization
   */
  public initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Set up the fetch interceptor
      this.cleanupInterceptor = this.authInterceptor.createFetchInterceptor();
      console.log('Auth interceptor initialized');
      resolve();
    });
  }

  /**
   * Cleanup function to restore original fetch if needed
   */
  public cleanup(): void {
    if (this.cleanupInterceptor) {
      this.cleanupInterceptor();
      console.log('Auth interceptor cleaned up');
    }
  }
}
