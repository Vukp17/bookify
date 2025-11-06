# 🎟️ Bookify - Event Booking System

A comprehensive event booking platform built with Angular and NestJS, allowing users to discover, book, and manage event tickets seamlessly.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Stories](#user-stories)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 User Authentication (Must Have)
- User registration with email, username, and password
- Secure login/logout functionality
- JWT-based authentication
- Protected routes with auth guards

### 📅 Event Management (Must Have)
- Browse available events with detailed information
- Filter events by category, location, and date range
- Search events by keywords
- View comprehensive event details including:
  - Event description and agenda
  - Speaker information
  - Ticket types and availability
  - Location and schedule
  - Customer reviews and ratings

### 🎫 Booking System (Must Have)
- Select ticket types and quantities
- Real-time availability checking
- Secure booking confirmation
- Email notifications
- Booking cancellation with refund policy
- View booking history (upcoming and past events)

### ⭐ Additional Features (Could Have)
- Save events as favorites
- Rate and review attended events
- Event notifications and reminders
- Contact event organizers

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 19
- **UI Library**: Angular Material
- **State Management**: RxJS
- **Routing**: Angular Router with lazy loading
- **HTTP Client**: Angular HttpClient with interceptors
- **Styling**: CSS with Material Design theme

### Backend (To Be Integrated)
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **API**: RESTful

### Development Tools
- **Monorepo**: Nx
- **Language**: TypeScript
- **Package Manager**: npm

## 📁 Project Structure

```
Bookify/
├── apps/
│   ├── frontend/                 # Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/         # Core services, guards, interceptors
│   │   │   │   │   ├── guards/
│   │   │   │   │   ├── interceptors/
│   │   │   │   │   ├── models/
│   │   │   │   │   └── services/
│   │   │   │   ├── shared/       # Shared components and modules
│   │   │   │   │   ├── components/
│   │   │   │   │   └── material.module.ts
│   │   │   │   ├── features/     # Feature modules (lazy loaded)
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── events/
│   │   │   │   │   ├── booking/
│   │   │   │   │   └── profile/
│   │   │   │   └── app-routing.module.ts
│   │   │   └── environments/
│   │   └── project.json
│   └── backend/                   # NestJS application (to be integrated)
│       └── prisma/
├── libs/                          # Shared libraries
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **PostgreSQL**: v14 or later (for backend integration)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/Bookify.git
   cd Bookify
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create `.env` file in the backend directory (when integrating):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bookify"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

### Running the Application

#### Frontend Development Server

```bash
npm start
# or
npx nx serve frontend
```

The application will be available at `http://localhost:4200/`

#### Backend Server (Coming Soon)

```bash
npm run backend:start
# or
npx nx serve backend
```

The API will be available at `http://localhost:3000/api`

### Building for Production

```bash
# Build frontend
npx nx build frontend --prod

# Build backend
npx nx build backend --prod
```

## 📖 User Stories

### Priority: Must Have

1. **User Registration & Login**
   - Users can register using email, username, and password
   - Users can log in and log out successfully

2. **View Events List**
   - Events displayed with title, date, location, and category
   - Users can scroll through the list

3. **Search & Filter Events**
   - Search by keywords in title or description
   - Filter by category, date range, and location
   - Dynamic filter results

4. **View Event Details**
   - Detailed view with full information
   - Ticket types and availability
   - Navigation back to event list

5. **Book Tickets**
   - Select ticket quantity and type
   - Availability confirmation
   - Booking confirmation email

6. **Cancel Booking**
   - Cancel bookings before deadline
   - Refund processing

### Priority: Could Have

7. **Favorites**
   - Save events for later
   - View saved events in profile

8. **View Bookings**
   - Track upcoming and past events
   - View booking status

9. **Reviews & Ratings**
   - Rate events (1-5 stars)
   - Submit text reviews

## 🔌 API Integration

The frontend is currently using **stub services** with mock data. To integrate with a real backend:

1. **Update environment configuration:**
   ```typescript
   // apps/frontend/src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

2. **Replace stub implementations in services:**
   - `apps/frontend/src/app/core/services/auth.service.ts`
   - `apps/frontend/src/app/core/services/event.service.ts`
   - `apps/frontend/src/app/core/services/booking.service.ts`
   - `apps/frontend/src/app/core/services/review.service.ts`

3. **Uncomment the real API calls** marked with `// TODO: Integrate with backend API`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

### Current Status
- ✅ Frontend architecture and UI implementation complete
- ✅ Mock services with sample data
- ✅ Routing and navigation configured
- ✅ Authentication flow implemented
- ⏳ Backend API integration pending
- ⏳ Database schema and migrations pending
- ⏳ Email notification system pending

### Known Issues
- TypeScript warning: `isolatedModules` and `emitDecoratorMetadata` (non-critical)
- Backend integration needed for production use

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Material for the UI components
- Nx for the monorepo architecture
- The Angular and NestJS communities

---

**Note**: This project is currently in development. The frontend is functional with mock data. Backend integration is the next phase of development.