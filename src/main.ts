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
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// Import Ionic icons
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

// Register icons
addIcons({
  heart,
  'heart-outline': heartOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
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
