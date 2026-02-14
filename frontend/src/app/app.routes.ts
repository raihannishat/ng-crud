import { Routes } from '@angular/router';
import { ItemsComponent } from './components/items/items';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ItemsComponent }
];
