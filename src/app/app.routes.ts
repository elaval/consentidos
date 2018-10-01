import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { CallbackComponent } from './callback/callback.component';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'notauth', component: NotAuthComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: '' }
];
