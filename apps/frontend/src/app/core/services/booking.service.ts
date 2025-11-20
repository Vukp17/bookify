import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Booking,
  BookingRequest,
  BookingConfirmation,
  CancelBookingRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(data: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, data);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  cancelBooking(data: CancelBookingRequest): Observable<Booking> {
    return this.http.delete<Booking>(`${this.apiUrl}/${data.bookingId}`);
  }
}
