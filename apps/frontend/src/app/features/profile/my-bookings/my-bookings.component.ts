import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  standalone: false
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  displayedColumns: string[] = ['event', 'date', 'tickets', 'amount', 'status', 'actions'];

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  getUpcomingBookings(): Booking[] {
    return this.bookings.filter(b => {
      if (!b.event) return false;
      return new Date(b.event.date) >= new Date() && b.status !== 'cancelled';
    });
  }

  getPastBookings(): Booking[] {
    return this.bookings.filter(b => {
      if (!b.event) return false;
      return new Date(b.event.date) < new Date() || b.status === 'cancelled';
    });
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      this.bookingService.cancelBooking({ bookingId: booking.id }).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Close', { duration: 5000 });
          this.loadBookings();
        },
        error: () => {
          this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canCancel(booking: Booking): boolean {
    if (!booking.cancellationDeadline) return false;
    return new Date(booking.cancellationDeadline) > new Date() && booking.status === 'confirmed';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'confirmed': 'primary',
      'pending': 'accent',
      'cancelled': 'warn',
      'refunded': 'warn'
    };
    return colors[status] || 'basic';
  }
}
