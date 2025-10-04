User Management System
A simple web application for managing users, featuring an admin interface to add new users. Built with React for the frontend and Node.js with Express for the backend, this project includes authentication and role-based access control.
Table of Contents

Features
Prerequisites
Installation
Usage
Project Structure
API Endpoints
Environment Variables
Contributing
License

Features

Admin-only user creation with email notification of generated passwords.
Role-based access control (admin, employee, manager).
JWT-based authentication with token storage in cookies and localStorage.
Form validation for user input.
Responsive design with basic styling.

Prerequisites

Node.js (v14.x or higher)
npm (v6.x or higher)
MongoDB (local or remote instance)
Git (for cloning the repository)

Installation
Backend Setup

Clone the repository:git clone https://github.com/your-username/user-management-system.git
cd user-management-system


Install backend dependencies:cd backend
npm install


Create a .env file in the backend directory and add the following environment variables:PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secure-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FRONTEND_URL=http://localhost:5173


Start the backend server:npm start

Or, for development with auto-restart:nodemon index.js



Frontend Setup

Navigate to the frontend directory:cd frontend


Install frontend dependencies:npm install


Start the frontend development server:npm start

The app will be available at http://localhost:5173.

Usage

Login:
Navigate to the login page and log in with admin credentials (initial admin can be created via the signup endpoint if no admin exists).


Add User:
After logging in as an admin, go to the /add-user route.
Fill out the form with the user's name, email, role (employee or manager), country, optional manager ID, and password.
Submit the form to add the user. A success message will appear, and the password will be sent to the user's email (if email service is configured).


Logout:
Use the logout option to clear the session.



Project Structure
user-management-system/
├── backend/
│   ├── config/           # Database connection configuration
│   ├── controller/       # Backend logic (e.g., AdminView.js)
│   ├── middleware/       # Authentication middleware
│   ├── models/           # Mongoose schemas (e.g., UserSchema.js)
│   ├── routes/           # API route definitions
│   ├── utils/            # Utility functions (e.g., EmailService.js)
│   ├── index.js          # Main server file
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/        # React components (e.g., AddUser.js, Login.jsx)
│   │   └── css/          # Custom styles (e.g., AddUser.css)
│   ├── package.json
│   └── .env              # Optional frontend environment variables
├── README.md
└── package.json          # Root project dependencies (if any)

API Endpoints

Authentication:

POST /api/auth/login - Log in with email and password.
POST /api/auth/logout - Log out and clear the token.
POST /api/auth/signup - Create an initial admin user (admin-restricted).
POST /api/auth/forgot-password - Request a new password.


Admin:

POST /api/admin/addUser - Add a new user (admin only).
GET /api/admin/users - Fetch all users (admin only, currently disabled in frontend).
PUT /api/admin/users/:id - Update a user (admin only).
DELETE /api/admin/users/:id - Delete a user (admin only).


Employee & Manager:

Routes under /api/employee and /api/manager (to be implemented).


Approval Rules:

Routes under /api/admin for approval rules (to be implemented).



Environment Variables
Create a .env file in the backend directory with the following:

PORT - Server port (default: 3000).
MONGODB_URI - MongoDB connection string (e.g., mongodb://localhost:27017/userdb).
JWT_SECRET - Secret key for JWT token generation.
EMAIL_USER - Email account for sending passwords.
EMAIL_PASS - Email account password or app-specific password.
FRONTEND_URL - URL of the frontend (e.g., http://localhost:5173).

Contributing

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m "Add new feature").
Push to the branch (git push origin feature-branch).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
