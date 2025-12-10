import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { environment } from '../../../environments/environment';
import { BookingRequest } from '../models';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createBooking', () => {
    it('should create a new booking', () => {
      const bookingRequest: BookingRequest = {
        eventId: '1',
        ticketTypeId: '1',
        quantity: 2
      };

      const mockBooking = {
        id: '1',
        userId: 'user1',
        eventId: '1',
        ticketType: 'General Admission',
        quantity: 2,
        totalAmount: 200,
        status: 'confirmed' as const,
        bookingReference: 'BK123',
        paymentStatus: 'completed' as const,
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createBooking(bookingRequest).subscribe(booking => {
        expect(booking.quantity).toBe(2);
        expect(booking.status).toBe('confirmed');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bookings`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(bookingRequest);
      req.flush(mockBooking);
    });
  });

  describe('getMyBookings', () => {
    it('should return user bookings', () => {
      const mockBookings = [
        {
          id: '1',
          userId: 'user1',
          eventId: '1',
          ticketType: 'General',
          quantity: 2,
          totalAmount: 200,
          status: 'confirmed' as const,
          bookingReference: 'BK123',
          paymentStatus: 'completed' as const,
          bookingDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getMyBookings().subscribe(bookings => {
        expect(bookings.length).toBe(1);
        expect(bookings[0].bookingReference).toBe('BK123');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bookings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBookings);
    });
  });

  describe('getBookingById', () => {
    it('should return a single booking', () => {
      const mockBooking = {
        id: '1',
        userId: 'user1',
        eventId: '1',
        ticketType: 'General',
        quantity: 2,
        totalAmount: 200,
        status: 'confirmed' as const,
        bookingReference: 'BK123',
        paymentStatus: 'completed' as const,
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.getBookingById('1').subscribe(booking => {
        expect(booking.id).toBe('1');
        expect(booking.bookingReference).toBe('BK123');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bookings/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBooking);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', () => {
      const mockCancelledBooking = {
        id: '1',
        userId: 'user1',
        eventId: '1',
        ticketType: 'General',
        quantity: 2,
        totalAmount: 200,
        status: 'cancelled' as const,
        bookingReference: 'BK123',
        paymentStatus: 'refunded' as const,
        bookingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.cancelBooking({ bookingId: '1' }).subscribe(booking => {
        expect(booking.status).toBe('cancelled');
        expect(booking.paymentStatus).toBe('refunded');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bookings/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCancelledBooking);
    });
  });
});
