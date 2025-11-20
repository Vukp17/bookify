import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Review,
  CreateReviewRequest,
  ReviewListResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getEventReviews(eventId: string): Observable<ReviewListResponse> {
    return this.http.get<ReviewListResponse>(`${this.apiUrl}/event/${eventId}`);
  }

  createReview(data: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, data);
  }
}
