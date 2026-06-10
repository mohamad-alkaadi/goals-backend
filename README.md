# Goals Backend

This is the backend for a to-do application called **Goals**. It is built with Node.js, Express, and MongoDB. The API provides user authentication, goal management, friend connections, and group features.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB & Mongoose** - Database and ODM
- **JSON Web Token (JWT)** - Authentication
- **Bcrypt** - Password hashing
- **Validator** - String validation

## Features

- **User Authentication:** Sign up, log in, and secure route protection.
- **Goal Management:** Create, read, update, and delete personal goals.
- **Social Features:** Manage friends and friend requests.
- **Groups:** Create and manage goal-oriented groups.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A MongoDB cluster or local instance

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mohamad-alkaadi/goals-backend.git
   cd goals-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Run the server with Nodemon to automatically restart on file changes:

```bash
npm run dev
```

### Production Mode

Run the standard Node server:

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port defined in your `.env` file).

## API Routes Overview

The base URL for all endpoints is `/api/v1`.

- `/users` - User authentication and profile management
- `/goals` - CRUD operations for goals
- `/friends` - Friend requests and friend list management
- `/groups` - Group creation and management
- `/test` - Test endpoints

## License

This project is licensed under the [ISC License](LICENSE).
