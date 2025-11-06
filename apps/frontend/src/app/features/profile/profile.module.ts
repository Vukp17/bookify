import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    MyBookingsComponent,
    FavoritesComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
