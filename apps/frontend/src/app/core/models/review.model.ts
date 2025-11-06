export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
