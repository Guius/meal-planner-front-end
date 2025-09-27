import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'palette',
    loadComponent: () =>
      import('./palette/palette-2.component').then((m) => m.Palette2Component),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'user-preferences',
    loadComponent: () =>
      import('./user-preferences/user-preferences.component').then((m) => m.UserPreferencesComponent),
  },
  {
    path: '',
    redirectTo: 'palette',
    pathMatch: 'full',
  },
];
