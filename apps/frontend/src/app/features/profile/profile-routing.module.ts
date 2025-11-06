import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: 'bookings', component: MyBookingsComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'bookings', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
