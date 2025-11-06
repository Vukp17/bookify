import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: false
})
export class FavoritesComponent implements OnInit {
  favorites: Event[] = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.eventService.getFavorites().subscribe({
      next: (events) => {
        this.favorites = events;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load favorites', 'Close', { duration: 3000 });
      }
    });
  }

  removeFavorite(event: Event): void {
    this.eventService.toggleFavorite(event.id).subscribe({
      next: () => {
        this.snackBar.open('Removed from favorites', 'Close', { duration: 2000 });
        this.loadFavorites();
      }
    });
  }

  viewEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
