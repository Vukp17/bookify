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

  getEvents(filters?: EventFilters, page = 1, pageSize = 12): Observable<Event[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
    }
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(`${this.apiUrl}/categories`);
  }

  toggleFavorite(eventId: string): Observable<{ isFavorite: boolean, message: string }> {
    return this.http.post<{ isFavorite: boolean, message: string }>(`${environment.apiUrl}/favorites/${eventId}`, {});
  }

  getFavorites(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/favorites`);
  }
}
