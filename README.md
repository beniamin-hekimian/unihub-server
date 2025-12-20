# UniHub Server

A comprehensive backend API for a University Management System built with the MERN stack. This server handles authentication, user management, course enrollment, exam management, and result tracking for students, professors, and administrators.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Professor, Student)
- **Student Management**: CRUD operations for student records
- **Professor Management**: CRUD operations for professor records
- **Subject Management**: Course/subject creation and assignment to professors
- **Enrollment System**: Student enrollment in subjects
- **Exam Management**: Create and manage exams for subjects
- **Result Tracking**: Record and retrieve exam results
- **Secure API**: CORS enabled, cookie-based authentication, password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing, CORS
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unihub-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4173
   MONGO_URI=mongodb+srv://your-connection-string
   FRONTEND_URL=localhost:5173
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Start the server**
   - Development mode (with auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

The server will start on `http://localhost:4173` (or the port specified in your `.env`).

## API Endpoints

### Authentication Routes
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/signout` - User logout

### Student Routes (Admin only)
- `GET /students` - Get all students
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Professor Routes (Admin only)
- `GET /professors` - Get all professors
- `POST /professors` - Create new professor
- `PUT /professors/:id` - Update professor
- `DELETE /professors/:id` - Delete professor

### Subject Routes
- `GET /subjects` - Get all subjects (Admin)
- `GET /subjects/professors/:professorId` - Get subjects by professor (Professor)
- `POST /subjects` - Create subject (Admin)
- `PUT /subjects/:id` - Update subject (Admin)
- `DELETE /subjects/:id` - Delete subject (Admin)

### Enrollment Routes
- `GET /enrolments` - Get all enrollments
- `POST /enrolments` - Create enrollment
- `PUT /enrolments/:id` - Update enrollment
- `DELETE /enrolments/:id` - Delete enrollment

### Exam Routes
- `GET /exams` - Get all exams
- `POST /exams` - Create exam
- `PUT /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam

### Result Routes
- `GET /results` - Get all results
- `POST /results` - Create result
- `PUT /results/:id` - Update result
- `DELETE /results/:id` - Delete result

## Project Structure

```
unihub-server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Route handlers
│   ├── authController.js
│   ├── studentController.js
│   └── ...
├── middlewares/             # Custom middlewares
│   ├── auth.js             # JWT authentication
│   └── role.js             # Role-based authorization
├── models/                  # Mongoose schemas
│   ├── User.js
│   ├── Student.js
│   └── ...
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   └── ...
├── server.js                # Main server file
├── package.json
├── .env                     # Environment variables
└── README.md
```

## Authentication

The API uses JWT tokens for authentication. After successful login via `/auth/signin`, the token is stored in an HTTP-only cookie. All protected routes require a valid JWT token.

### User Roles
- **Admin**: Full access to all resources
- **Professor**: Access to their assigned subjects and related data
- **Student**: Limited access to their own data

## Database Models

- **User**: Base user model with authentication
- **Student**: Student-specific information
- **Professor**: Professor-specific information
- **Subject**: Course/subject details
- **Enrolment**: Student-subject relationships
- **Exam**: Exam details and scheduling
- **Result**: Exam results and grades

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue in the repository or contact the development team.