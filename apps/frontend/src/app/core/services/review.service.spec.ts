import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment';
import { CreateReviewRequest } from '../models';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEventReviews', () => {
    it('should return event reviews with average rating', () => {
      const mockResponse = {
        reviews: [
          {
            id: '1',
            eventId: '1',
            userId: 'user1',
            userName: 'John Doe',
            rating: 5,
            comment: 'Great event!',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            eventId: '1',
            userId: 'user2',
            userName: 'Jane Smith',
            rating: 4,
            comment: 'Good event',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        averageRating: 4.5,
        totalReviews: 2
      };

      service.getEventReviews('1').subscribe(response => {
        expect(response.reviews.length).toBe(2);
        expect(response.averageRating).toBe(4.5);
        expect(response.totalReviews).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews/event/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createReview', () => {
    it('should create a new review', () => {
      const reviewRequest: CreateReviewRequest = {
        eventId: '1',
        rating: 5,
        comment: 'Excellent event!'
      };

      const mockReview = {
        id: '1',
        eventId: '1',
        userId: 'user1',
        userName: 'Test User',
        rating: 5,
        comment: 'Excellent event!',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createReview(reviewRequest).subscribe(review => {
        expect(review.rating).toBe(5);
        expect(review.comment).toBe('Excellent event!');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reviews`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(reviewRequest);
      req.flush(mockReview);
    });
  });
});
