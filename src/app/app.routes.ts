import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'palette',
    loadComponent: () =>
      import('./palette/palette.component').then((m) => m.PaletteComponent),
  },
  {
    path: '',
    redirectTo: 'palette',
    pathMatch: 'full',
  },
];
