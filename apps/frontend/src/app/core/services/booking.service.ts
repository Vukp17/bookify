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

  createBooking(data: BookingRequest): Observable<BookingConfirmation> {
    // TODO: Integrate with backend API
    // return this.http.post<BookingConfirmation>(this.apiUrl, data);
    
    // Stub implementation
    return of({
      booking: {
        id: 'booking-' + Math.random().toString(36).substr(2, 9),
        userId: 'user1',
        eventId: data.eventId,
        ticketType: data.ticketTypeId,
        quantity: data.quantity,
        totalAmount: data.quantity * 199,
        status: 'confirmed' as const,
        bookingReference: 'BK' + Date.now(),
        paymentStatus: 'completed' as const,
        bookingDate: new Date(),
        cancellationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      message: 'Booking confirmed successfully!',
      confirmationEmail: true
    }).pipe(delay(1000));
  }

  getMyBookings(): Observable<Booking[]> {
    // TODO: Integrate with backend API
    // return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
    
    // Stub implementation
    return of([
      {
        id: 'b1',
        userId: 'user1',
        eventId: '1',
        event: {
          id: '1',
          title: 'Tech Conference 2025',
          date: new Date('2025-12-15'),
          location: 'San Francisco, CA',
          startTime: '09:00',
          endTime: '18:00',
          description: 'Tech conference',
          category: { id: '1', name: 'Technology' },
          organizerId: 'org1',
          ticketTypes: [],
          totalSeats: 600,
          availableSeats: 375,
          status: 'published' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        ticketType: 'General Admission',
        quantity: 2,
        totalAmount: 398,
        status: 'confirmed' as const,
        bookingReference: 'BK123456789',
        paymentStatus: 'completed' as const,
        bookingDate: new Date('2025-11-01'),
        cancellationDeadline: new Date('2025-12-08'),
        createdAt: new Date('2025-11-01'),
        updatedAt: new Date('2025-11-01')
      }
    ]).pipe(delay(500));
  }

  getBookingById(id: string): Observable<Booking> {
    // TODO: Integrate with backend API
    // return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    
    // Stub implementation
    return of({
      id: 'b1',
      userId: 'user1',
      eventId: '1',
      event: {
        id: '1',
        title: 'Tech Conference 2025',
        date: new Date('2025-12-15'),
        location: 'San Francisco, CA',
        startTime: '09:00',
        endTime: '18:00',
        description: 'Tech conference',
        category: { id: '1', name: 'Technology' },
        organizerId: 'org1',
        ticketTypes: [],
        totalSeats: 600,
        availableSeats: 375,
        status: 'published' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ticketType: 'General Admission',
      quantity: 2,
      totalAmount: 398,
      status: 'confirmed' as const,
      bookingReference: 'BK123456789',
      paymentStatus: 'completed' as const,
      bookingDate: new Date('2025-11-01'),
      cancellationDeadline: new Date('2025-12-08'),
      createdAt: new Date('2025-11-01'),
      updatedAt: new Date('2025-11-01')
    }).pipe(delay(300));
  }

  cancelBooking(data: CancelBookingRequest): Observable<{ message: string }> {
    // TODO: Integrate with backend API
    // return this.http.post<{ message: string }>(`${this.apiUrl}/${data.bookingId}/cancel`, data);
    
    // Stub implementation
    return of({ message: 'Booking cancelled successfully. Refund will be processed within 7 business days.' }).pipe(delay(500));
  }
}
