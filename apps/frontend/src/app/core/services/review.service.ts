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
    // TODO: Integrate with backend API
    // return this.http.get<ReviewListResponse>(`${this.apiUrl}/event/${eventId}`);
    
    // Stub implementation
    return of({
      reviews: [
        {
          id: 'r1',
          eventId: eventId,
          userId: 'u1',
          userName: 'John Doe',
          rating: 5,
          comment: 'Amazing event! Highly recommend.',
          createdAt: new Date('2025-11-01'),
          updatedAt: new Date('2025-11-01')
        },
        {
          id: 'r2',
          eventId: eventId,
          userId: 'u2',
          userName: 'Jane Smith',
          rating: 4,
          comment: 'Great experience, well organized.',
          createdAt: new Date('2025-10-28'),
          updatedAt: new Date('2025-10-28')
        }
      ],
      averageRating: 4.5,
      totalReviews: 127
    }).pipe(delay(400));
  }

  createReview(data: CreateReviewRequest): Observable<Review> {
    // TODO: Integrate with backend API
    // return this.http.post<Review>(this.apiUrl, data);
    
    // Stub implementation
    return of({
      id: 'r' + Math.random().toString(36).substr(2, 9),
      eventId: data.eventId,
      userId: 'currentUser',
      userName: 'Current User',
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date(),
      updatedAt: new Date()
    }).pipe(delay(500));
  }
}
