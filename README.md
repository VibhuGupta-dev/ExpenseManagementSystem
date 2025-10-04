# User Management System

A simple web application for managing users, featuring an admin interface to add new users. Built with **React** for the frontend and **Node.js with Express** for the backend, this project includes authentication and role-based access control.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Admin-only user creation with email notification of generated passwords.
- Role-based access control (**admin**, **employee**, **manager**).
- JWT-based authentication with token storage in **cookies** and **localStorage**.
- Form validation for user input.
- Responsive design with basic styling.

---

## Prerequisites

- **Node.js** (v14.x or higher)  
- **npm** (v6.x or higher)  
- **MongoDB** (local or remote instance)  
- **Git** (for cloning the repository)  

---

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/user-management-system.git
   cd user-management-system
