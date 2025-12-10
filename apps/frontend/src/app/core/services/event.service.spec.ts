import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { environment } from '../../../environments/environment';
import { EventFilters } from '../models';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should return array of events', () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Test Event',
          description: 'Description',
          date: new Date(),
          startTime: '10:00',
          endTime: '12:00',
          location: 'Test Location',
          category: { id: '1', name: 'Technology' },
          organizerId: '1',
          ticketTypes: [],
          totalSeats: 100,
          availableSeats: 50,
          status: 'published' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getEvents().subscribe(events => {
        expect(events.length).toBe(1);
        expect(events[0].title).toBe('Test Event');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should include filters in request params', () => {
      const filters: EventFilters = {
        search: 'tech',
        category: '1',
        location: 'New York'
      };

      service.getEvents(filters).subscribe();

      const req = httpMock.expectOne(request => 
        request.url === `${environment.apiUrl}/events` &&
        request.params.has('search') &&
        request.params.get('search') === 'tech'
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getEventById', () => {
    it('should return a single event', () => {
      const mockEvent = {
        id: '1',
        title: 'Test Event',
        description: 'Description',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        location: 'Test Location',
        category: { id: '1', name: 'Technology' },
        organizerId: '1',
        ticketTypes: [],
        totalSeats: 100,
        availableSeats: 50,
        status: 'published' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.getEventById('1').subscribe(event => {
        expect(event.id).toBe('1');
        expect(event.title).toBe('Test Event');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });
  });

  describe('getCategories', () => {
    it('should return array of categories', () => {
      const mockCategories = [
        { id: '1', name: 'Technology', icon: 'computer' },
        { id: '2', name: 'Business', icon: 'business' }
      ];

      service.getCategories().subscribe(categories => {
        expect(categories.length).toBe(2);
        expect(categories[0].name).toBe('Technology');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle event favorite status', () => {
      const mockResponse = {
        isFavorite: true,
        message: 'Added to favorites'
      };

      service.toggleFavorite('1').subscribe(response => {
        expect(response.isFavorite).toBe(true);
        expect(response.message).toBe('Added to favorites');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/favorites/1`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getFavorites', () => {
    it('should return user favorite events', () => {
      const mockFavorites = [
        {
          id: '1',
          title: 'Favorite Event',
          description: 'Description',
          date: new Date(),
          startTime: '10:00',
          endTime: '12:00',
          location: 'Test Location',
          category: { id: '1', name: 'Technology' },
          organizerId: '1',
          ticketTypes: [],
          totalSeats: 100,
          availableSeats: 50,
          status: 'published' as const,
          isFavorite: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getFavorites().subscribe(events => {
        expect(events.length).toBe(1);
        expect(events[0].isFavorite).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/favorites`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFavorites);
    });
  });
});
