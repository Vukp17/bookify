import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Event,
  EventFilters,
  EventListResponse,
  EventCategory
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(filters?: EventFilters, page = 1, pageSize = 12): Observable<EventListResponse> {
    // TODO: Integrate with backend API
    // let params = new HttpParams()
    //   .set('page', page.toString())
    //   .set('pageSize', pageSize.toString());
    // if (filters) {
    //   if (filters.search) params = params.set('search', filters.search);
    //   if (filters.category) params = params.set('category', filters.category);
    //   if (filters.location) params = params.set('location', filters.location);
    //   if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
    //   if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
    // }
    // return this.http.get<EventListResponse>(this.apiUrl, { params });

    // Stub implementation with mock data
    const mockEvents: Event[] = this.getMockEvents();
    return of({
      events: mockEvents,
      total: mockEvents.length,
      page: page,
      pageSize: pageSize
    }).pipe(delay(500));
  }

  getEventById(id: string): Observable<Event> {
    // TODO: Integrate with backend API
    // return this.http.get<Event>(`${this.apiUrl}/${id}`);
    
    // Stub implementation
    const mockEvents = this.getMockEvents();
    const event = mockEvents.find(e => e.id === id);
    return of(event || mockEvents[0]).pipe(delay(300));
  }

  getCategories(): Observable<EventCategory[]> {
    // TODO: Integrate with backend API
    // return this.http.get<EventCategory[]>(`${environment.apiUrl}/categories`);
    
    // Stub implementation
    return of([
      { id: '1', name: 'Technology', icon: 'computer' },
      { id: '2', name: 'Business', icon: 'business' },
      { id: '3', name: 'Arts & Culture', icon: 'palette' },
      { id: '4', name: 'Music', icon: 'music_note' },
      { id: '5', name: 'Sports', icon: 'sports_soccer' },
      { id: '6', name: 'Education', icon: 'school' }
    ]);
  }

  toggleFavorite(eventId: string): Observable<{ isFavorite: boolean }> {
    // TODO: Integrate with backend API
    // return this.http.post<{ isFavorite: boolean }>(`${this.apiUrl}/${eventId}/favorite`, {});
    
    // Stub implementation
    return of({ isFavorite: true }).pipe(delay(200));
  }

  getFavorites(): Observable<Event[]> {
    // TODO: Integrate with backend API
    // return this.http.get<Event[]>(`${environment.apiUrl}/favorites`);
    
    // Stub implementation
    return of(this.getMockEvents().slice(0, 3));
  }

  private getMockEvents(): Event[] {
    return [
      {
        id: '1',
        title: 'Tech Conference 2025',
        description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.',
        shortDescription: 'The biggest tech conference of the year',
        date: new Date('2025-12-15'),
        startTime: '09:00',
        endTime: '18:00',
        location: 'San Francisco, CA',
        category: { id: '1', name: 'Technology', icon: 'computer' },
        organizerId: 'org1',
        organizer: { id: 'org1', username: 'TechEvents Inc', email: 'contact@techevents.com' },
        imageUrl: 'https://via.placeholder.com/800x400?text=Tech+Conference',
        agenda: 'Day Schedule: 9:00 AM - Registration, 10:00 AM - Keynote, 12:00 PM - Lunch...',
        speakers: ['John Doe (Google)', 'Jane Smith (Microsoft)', 'Bob Johnson (Amazon)'],
        ticketTypes: [
          { id: 't1', name: 'General Admission', price: 199, quantity: 500, available: 350 },
          { id: 't2', name: 'VIP Pass', price: 499, quantity: 100, available: 25 }
        ],
        totalSeats: 600,
        availableSeats: 375,
        status: 'published',
        isFavorite: false,
        averageRating: 4.5,
        reviewCount: 127,
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-11-01')
      },
      {
        id: '2',
        title: 'Art Exhibition Opening',
        description: 'Experience modern art from renowned artists around the world in our exclusive gallery opening.',
        shortDescription: 'Modern art exhibition opening',
        date: new Date('2025-11-20'),
        startTime: '18:00',
        endTime: '22:00',
        location: 'New York, NY',
        category: { id: '3', name: 'Arts & Culture', icon: 'palette' },
        organizerId: 'org2',
        imageUrl: 'https://via.placeholder.com/800x400?text=Art+Exhibition',
        ticketTypes: [
          { id: 't3', name: 'Standard Entry', price: 50, quantity: 200, available: 120 }
        ],
        totalSeats: 200,
        availableSeats: 120,
        status: 'published',
        isFavorite: false,
        averageRating: 4.8,
        reviewCount: 45,
        createdAt: new Date('2025-09-15'),
        updatedAt: new Date('2025-10-20')
      },
      {
        id: '3',
        title: 'Music Festival 2025',
        description: 'Three days of incredible live music featuring top artists and emerging talents.',
        shortDescription: 'Live music festival',
        date: new Date('2025-07-10'),
        startTime: '12:00',
        endTime: '23:00',
        location: 'Austin, TX',
        category: { id: '4', name: 'Music', icon: 'music_note' },
        organizerId: 'org3',
        imageUrl: 'https://via.placeholder.com/800x400?text=Music+Festival',
        ticketTypes: [
          { id: 't4', name: 'Day Pass', price: 89, quantity: 5000, available: 2500 },
          { id: 't5', name: '3-Day Pass', price: 229, quantity: 2000, available: 800 }
        ],
        totalSeats: 7000,
        availableSeats: 3300,
        status: 'published',
        isFavorite: true,
        averageRating: 4.9,
        reviewCount: 892,
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-06-01')
      }
    ];
  }
}
