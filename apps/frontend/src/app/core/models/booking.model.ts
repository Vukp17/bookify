import { Event } from './event.model';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  event?: Event;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  bookingReference: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingDate: Date;
  cancellationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
}

export interface BookingConfirmation {
  booking: Booking;
  message: string;
  confirmationEmail: boolean;
}

export interface CancelBookingRequest {
  bookingId: string;
  reason?: string;
}
