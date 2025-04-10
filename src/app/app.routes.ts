import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'generate',
    loadComponent: () =>
      import('./pages/generate/generate.component').then(
        (m) => m.GenerateComponent
      ),
  },
  {
    path: 'modify',
    loadComponent: () =>
      import('./pages/modify/modify.component').then((m) => m.ModifyComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then(
        (m) => m.GalleryComponent
      ),
  },
  { path: '**', redirectTo: '' }, // Redirect any unknown paths to home
];
