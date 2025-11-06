import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingFormComponent } from './booking-form/booking-form.component';

@NgModule({
  declarations: [
    BookingFormComponent
  ],
  imports: [
    SharedModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
