# Eneba Game Store Assignment

This is a full-stack web application built with React, Node.js, Express, and SQLite.

## Prerequisites
- Node.js installed on your machine.

## How to Run the Application

Because this is a Full-Stack application, you will need two terminal windows to run the Backend and the Frontend simultaneously.

### 1. Start the Backend (API & Database)
Open your first terminal window, navigate to the backend folder, and run:

cd backend
npm install
### 1. Open a second, new terminal window, navigate to the frontend folder, and run:

cd frontend-app
npm install
npm start
### Features Implemented

    Frontend: Built with React. Matches the provided design screenshot precisely, including dynamic platform colors, cashback badges, hover states, and original layout formatting.

    Backend: Built with Node.js and Express to handle API routing.

    Database: Uses SQLite for a simple, zero-configuration local database. The games.db file auto-generates and seeds itself on the first backend run, making it extremely easy to test locally.

    Real-time Search: The React frontend uses a debounced search input (300ms) to prevent spamming the backend with requests while typing.
