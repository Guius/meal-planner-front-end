import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppInitializerService } from './app/core/services/app-initializer.service';

// Import Ionic icons
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

// Register icons
addIcons({
  heart,
  'heart-outline': heartOutline,
});

// Factory function for APP_INITIALIZER
function initializeApp(
  appInitializer: AppInitializerService
): () => Promise<void> {
  return () => appInitializer.initialize();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializerService],
      multi: true,
    },
    importProvidersFrom(
      IonicModule.forRoot({
        rippleEffect: false,
        mode: 'ios',
      })
    ),
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.OFF,
      })
    ),
  ],
});
