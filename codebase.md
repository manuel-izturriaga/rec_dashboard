# Codebase Overview

This document provides an overview of the project's structure and components.

## Frontend

### HTML (`frontend/index.html`)

- Main page of the dashboard.

### CSS (`frontend/css/style.css`)

- Contains all the styling for the application.

### JavaScript

#### `frontend/js/main.js`

- Main entry point for the frontend JavaScript.
- Initializes the application and handles user interactions.

#### `frontend/js/ui.js`

- Handles UI-related logic, such as creating and managing UI components like the calendar. The calendar is now positioned using CSS, and the scroll/resize event listeners have been removed from `main.js`.

#### `frontend/js/api.js`

- Manages communication with the backend API.

#### `frontend/js/reservations.js`

- Logic specific to the reservations page.

## Backend

### `backend/server.js`

- The main server file, likely running an Express server.
