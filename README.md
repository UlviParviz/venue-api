# Venue Reservation API

## Overview

This project is an API for managing venues and reservations built with Node.js and Express. MongoDB is used as the database. Users can register, log in, and make reservations for venues. After a reservation is made, a confirmation email is sent to the user's registered email address using Nodemailer. It's recommended to use Gmail for email services.

## Installation

Clone the repository:

```bash
git clone https://github.com/UlviParviz/venue-api.git
```

Navigate into the project directory:

```bash
cd venue-api
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## API Endpoints

### Venue Endpoints

- **GET All Venues**
  - Endpoint: `/api/venues?page={page}&limit={limit}&keyword={location}`
  - Retrieves a list of all venues with pagination and optional search by location.

- **POST Create New Venue** (Admin only)
  - Endpoint: `/api/venues`
  - Body:
    ```json
    {
      "name": "example name",
      "capacity": 500,
      "description": "example description.",
      "location": "example location"
    }
    ```
  - Creates a new venue.

- **GET Venue Details**
  - Endpoint: `/api/venues/{venueId}`
  - Retrieves details of a specific venue by ID.

- **PUT Update Venue** (Admin only)
  - Endpoint: `/api/venues/{venueId}`
  - Updates details of a specific venue by ID.

- **DELETE Delete Venue** (Admin only)
  - Endpoint: `/api/venues/{venueId}`
  - Deletes a specific venue by ID.

### Authentication Endpoints

- **POST Register**
  - Endpoint: `/api/auth/register`
  - Body:
    ```json
    {
      "username": "example",
      "email": "example@gmail.com",
      "password": "example123"
    }
    ```
  - Note: Password must include both numbers and letters.

- **POST Login**
  - Endpoint: `/api/auth/login`
  - Body:
    ```json
    {
      "email": "example@gmail.com",
      "password": "example123"
    }
    ```

### Reservation Endpoints

- **POST Create New Reservation**
  - Endpoint: `/api/reservations`
  - Body:
    ```json
    {
      "venueId": "{venueId}",
      "date": "ex: 2024-09-15T19:00:00.000Z",
      "time": "ex: 06:00",
      "numberOfPeople": 4
    }
    ```
  - Creates a new reservation for a venue.

- **GET Current User Reservations**
  - Endpoint: `/api/reservations`
  - Retrieves all reservations made by the currently logged-in user.

- **GET Reservation Details**
  - Endpoint: `/api/reservations/{reservationID}`
  - Retrieves details of a specific reservation by ID.
  - Note: Includes populated data for both the reserving user and the reserved venue.

- **DELETE Cancel Reservation**
  - Endpoint: `/api/reservations/{reservationID}`
  - Cancels a specific reservation by ID.

## Testing

This project uses Mocha, Chai, and Supertest for testing:

- **Mocha** is a test framework that provides the structure for running tests.
- **Chai** is an assertion library that helps with writing test assertions in a readable manner.
- **Supertest** is a library for testing HTTP APIs.

### Running Tests

1. **Authentication Tests**
   ```bash
   npm run test:auth
   ```
   This runs tests for authentication-related endpoints (registration and login).

2. **Venue Tests**
   ```bash
   npm run test:venue
   ```
   This runs tests for venue-related endpoints (create, update, delete, and retrieve venues).

3. **Reservation Tests**
   ```bash
   npm run test:reservation
   ```
   This runs tests for reservation-related endpoints (create, retrieve, and cancel reservations).

### Test Scripts

In your `package.json`, you'll find the following scripts configured for testing:

```json
"scripts": {
    "test:auth": "mocha __tests__/auth.test.js",
    "test:venue": "mocha __tests__/venue.test.js",
    "test:reservation": "mocha __tests__/reservation.test.js",
}
```
