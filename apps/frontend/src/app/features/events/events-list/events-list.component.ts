import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event, EventCategory, EventFilters } from '../../../core/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
  standalone: false
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];
  categories: EventCategory[] = [];
  isLoading = false;
  filterForm!: FormGroup;
  
  constructor(
    private eventService: EventService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.loadCategories();
    this.loadEvents();
    this.setupFilterWatch();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      location: [''],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  setupFilterWatch(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadEvents();
      });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    const filters: EventFilters = this.filterForm.value;
    
    this.eventService.getEvents(filters).subscribe({
      next: (response) => {
        this.events = response.events;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  toggleFavorite(event: Event, $event: MouseEvent): void {
    $event.stopPropagation();
    this.eventService.toggleFavorite(event.id).subscribe({
      next: (response) => {
        event.isFavorite = response.isFavorite;
      }
    });
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
