# Nepal Guide Connect Backend

A comprehensive backend API for the Nepal Guide Connect tourism platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Tourist, Guide, and Admin roles with different permissions
- **Request Management**: Tour request creation, assignment, and status tracking
- **Guide Management**: Guide profiles, availability, and statistics
- **Destination Management**: CRUD operations for tourist destinations
- **Notification System**: Real-time notifications for assignments and updates
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs
- **Validation**: Mongoose validation
- **Environment**: dotenv

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=mongodb+srv://guidenepal:Guidenepal@guidenepal.4zbqv0m.mongodb.net/?retryWrites=true&w=majority&appName=guidenepal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Destinations
- `GET /api/destinations` - Get all destinations (Public)
- `GET /api/destinations/:id` - Get single destination (Public)
- `GET /api/destinations/categories` - Get destination categories (Public)
- `POST /api/destinations` - Create destination (Admin only)
- `PUT /api/destinations/:id` - Update destination (Admin only)
- `DELETE /api/destinations/:id` - Delete destination (Admin only)

### Requests
- `POST /api/requests` - Create new request (Tourist only)
- `GET /api/requests` - Get requests (Role-based access)
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id/assign` - Assign guide to request (Admin only)
- `PUT /api/requests/:id/status` - Update request status (Guide/Admin)
- `PUT /api/requests/:id/review` - Add review to completed request (Tourist only)

### Guides
- `GET /api/guides` - Get all guides (Public)
- `GET /api/guides/:id` - Get single guide (Public)
- `GET /api/guides/:id/stats` - Get guide statistics (Guide/Admin)
- `PUT /api/guides/:id/availability` - Update guide availability (Guide/Admin)
- `GET /api/guides/available/:requestId` - Get available guides for request (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/stats` - Get notification statistics
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications

## Demo Accounts

After seeding the database, you can use these demo accounts:

- **Tourist**: `tourist@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `admin123`
- **Guide**: `guide@demo.com` / `demo123`

## Database Models

### User
- Authentication and profile information
- Role-based permissions (tourist, guide, admin)
- Guide-specific fields (specialties, languages, experience, etc.)

### Destination
- Tourist destinations with categories and difficulty levels
- Images, descriptions, and requirements
- Search and filtering capabilities

### Request
- Tour requests from tourists
- Destination selections and preferences
- Assignment and status tracking
- Review and rating system

### Notification
- Real-time notifications for users
- Assignment alerts and status updates
- Read/unread tracking

## Security Features

- JWT authentication with secure tokens
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- CORS configuration for frontend integration
- Input validation and sanitization
- Role-based access control

## Development

- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm start` - Start production server

## Environment Variables

Make sure to set all required environment variables in your `.env` file for proper functionality.