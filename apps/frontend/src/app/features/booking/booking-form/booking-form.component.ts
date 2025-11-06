import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { Event, TicketType } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: false
})
export class BookingFormComponent implements OnInit {
  event!: Event;
  bookingForm!: FormGroup;
  isLoading = false;
  selectedTicketType: TicketType | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventService: EventService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      const eventId = params['eventId'];
      if (eventId) {
        this.loadEvent(eventId);
      }
    });
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      ticketTypeId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.bookingForm.get('ticketTypeId')?.valueChanges.subscribe(ticketId => {
      this.selectedTicketType = this.event?.ticketTypes.find(t => t.id === ticketId) || null;
    });
  }

  loadEvent(eventId: string): void {
    this.isLoading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load event', 'Close', { duration: 3000 });
        this.router.navigate(['/events']);
      }
    });
  }

  getTotalPrice(): number {
    if (!this.selectedTicketType) return 0;
    const quantity = this.bookingForm.get('quantity')?.value || 0;
    return this.selectedTicketType.price * quantity;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      const bookingData = {
        eventId: this.event.id,
        ...this.bookingForm.value
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (confirmation) => {
          this.isLoading = false;
          this.snackBar.open(confirmation.message, 'Close', { duration: 5000 });
          this.router.navigate(['/profile/bookings']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Booking failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/events', this.event.id]);
  }
}
