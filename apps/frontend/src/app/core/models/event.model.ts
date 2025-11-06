export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  organizerId: string;
  organizer?: EventOrganizer;
  imageUrl?: string;
  agenda?: string;
  speakers?: string[];
  ticketTypes: TicketType[];
  totalSeats: number;
  availableSeats: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isFavorite?: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  available: number;
}

export interface EventOrganizer {
  id: string;
  username: string;
  email: string;
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}
