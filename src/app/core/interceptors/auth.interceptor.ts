import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async handleRefreshToken(): Promise<void> {
    if (this.isRefreshing) {
      // If refresh is already in progress, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    try {
      this.isRefreshing = true;
      await this.authService.refreshLogin();
      this.processQueue(null);
    } catch (error) {
      this.processQueue(error);
      // Refresh failed, logout and redirect to login
      try {
        await this.authService.logout();
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
      }
      await this.router.navigate(['/login']);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Intercepts fetch requests to handle 401 responses
   * Replaces the global window.fetch with an intercepted version that automatically
   * attempts token refresh on 401 responses and retries the original request
   *
   * @returns A cleanup function that restores the original fetch when called
   */
  public createFetchInterceptor(): () => void {
    // 📦 Save the original fetch function before we replace it
    // This is crucial - once we overwrite window.fetch, we'd lose access to the original
    const originalFetch = window.fetch;

    // 🔄 Replace the global fetch with our intercepted version
    // Every fetch() call in the entire application will now go through this function
    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      // 📞 Make the request using the original fetch (not our intercepted version)
      const response = await originalFetch(input, init);

      // 🚨 Check if we got a 401 Unauthorized response
      if (response.status === 401) {
        try {
          // 🔄 Attempt to refresh the token
          await this.handleRefreshToken();

          // ✅ Refresh succeeded! Retry the original request using originalFetch
          // Important: We use originalFetch here to avoid infinite loops
          // This retry bypasses our interceptor and goes directly to the server
          return originalFetch(input, init);
        } catch (error) {
          // ❌ Refresh failed (user will be logged out by handleRefreshToken)
          // Return the original 401 response so the calling code can handle it
          return response;
        }
      }

      // ✅ Not a 401, return the response as normal
      return response;
    };

    // 🎫 Return a cleanup function that restores the original fetch
    // This allows callers to "undo" the global modification when needed
    // Usage: const cleanup = createFetchInterceptor(); cleanup(); // restores original
    return () => {
      // 🧹 Restore the original fetch function
      window.fetch = originalFetch;
    };
  }
}