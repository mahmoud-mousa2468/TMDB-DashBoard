import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MovieDetailsComponent } from './features/movie-details/movie-details.component';
import { BrowseComponent } from './features/browse/browse.component';
import { LoginComponent } from './features/login/login.component';
import { FavouriteComponent } from './features/favourite/favourite.component';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-details/movie-details.component').then(
        (m) => m.MovieDetailsComponent,
      ),
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./features/browse/browse.component').then(
        (m) => m.BrowseComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'favourite',
    loadComponent: () =>
      import('./features/favourite/favourite.component').then(
        (m) => m.FavouriteComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '', // أو خليه يروح لـ 'home'
    pathMatch: 'full'
  }
];
