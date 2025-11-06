import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { ReviewService } from '../../../core/services/review.service';
import { Event, Review, ReviewListResponse } from '../../../core/models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: false
})
export class EventDetailsComponent implements OnInit {
  event!: Event;
  reviews: Review[] = [];
  averageRating = 0;
  totalReviews = 0;
  isLoading = true;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.loadEventDetails(eventId);
        this.loadReviews(eventId);
      }
    });
  }

  loadEventDetails(eventId: string): void {
    this.isLoading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  loadReviews(eventId: string): void {
    this.reviewService.getEventReviews(eventId).subscribe({
      next: (response: ReviewListResponse) => {
        this.reviews = response.reviews;
        this.averageRating = response.averageRating;
        this.totalReviews = response.totalReviews;
      }
    });
  }

  toggleFavorite(): void {
    this.eventService.toggleFavorite(this.event.id).subscribe({
      next: (response) => {
        this.event.isFavorite = response.isFavorite;
      }
    });
  }

  bookEvent(): void {
    this.router.navigate(['/booking', this.event.id]);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('star');
      } else if (i - 0.5 <= rating) {
        stars.push('star_half');
      } else {
        stars.push('star_border');
      }
    }
    return stars;
  }
}
