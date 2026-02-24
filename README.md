# nearby-app
Nearby is a full-stack MERN application that recommends places based on the user’s current mood and real-time location.  The app creates a personalized discovery experience by combining mood-based filtering, geolocation, and interactive maps.

Nearby – Mood-Based Location Recommendation App

Nearby is a full-stack MERN application that recommends places based on the user’s current mood and real-time location.

It provides a personalized discovery experience by combining mood-based filtering, geolocation, and interactive maps.

Features

* Mood-based place recommendations
* Location-aware suggestions
* Interactive map integration
* Secure Authentication (Register / Login / Logout)
* User profile management
* Search history tracking
* Delete search history
* Delete account functionality
* Fully Dockerized (Frontend + Backend)

Tech Stack

* MongoDB: Database
* Express.js: Backend
* React.js: Frontend
* Node.js: Server runtime
* Docker & Docker Compose: Containerization
* REST APIs
* Location & Map Services

Project Structure

nearby-app/
│
├── client/        # React frontend
├── server/        # Node + Express backend
├── docker-compose.yml
└── README.md

Environment Variables
Create a `.env` file inside the `server` folder:


Access the application:

Frontend → [http://localhost:3001](http://localhost:3001)
Backend → [http://localhost:5001](http://localhost:5001)

Authentication Flow

* User Registration
* Secure Login with JWT
* Protected Routes
* Logout
* Delete Account

What This Project Demonstrates

* Full-stack MERN development
* RESTful API architecture
* Secure authentication & user management
* Location-based recommendation logic
* Dockerized multi-container deployment.
* Production-ready setup

