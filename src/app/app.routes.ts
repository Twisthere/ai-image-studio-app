import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'generate',
    loadComponent: () =>
      import('./pages/generate/generate').then(
        (m) => m.Generate
      ),
  },
  {
    path: 'modify',
    loadComponent: () =>
      import('./pages/modify/modify').then((m) => m.Modify),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery').then(
        (m) => m.Gallery
      ),
  },
  { path: '**', redirectTo: '' },
];
