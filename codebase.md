# Codebase Structure

This document outlines the structure of the application, detailing each component and its function.

## Frontend

### HTML ([`frontend/`](frontend/))
- **[`index.html`](frontend/index.html)**: Main dashboard page.
- **[`reservations.html`](frontend/reservations.html)**: Page for managing reservations.
- **[`all-campgrounds.html`](frontend/all-campgrounds.html)**: Page for viewing all campgrounds.

### CSS ([`frontend/css/`](frontend/css/))
- **[`style.css`](frontend/css/style.css)**: Main stylesheet for the application.

### JavaScript ([`frontend/js/`](frontend/js/))
- **[`main.js`](frontend/js/main.js)**: Main JavaScript file for the dashboard page. Handles event listeners and initial data fetching.
- **[`ui.js`](frontend/js/ui.js)**: Handles UI updates and manipulations.
- **[`api.js`](frontend/js/api.js)**: Manages all interactions with the backend API.
- **[`reservations.js`](frontend/js/reservations.js)**: JavaScript for the reservations page.
- **[`all-campgrounds.js`](frontend/js/all-campgrounds.js)**: JavaScript for the all-campgrounds page.

### Data (`frontend/data/`)
- **[`Facilities_API_v1.json`](frontend/data/Facilities_API_v1.json)**: JSON data for campground facilities.
- **[`FacilityAddresses_API_v1.json`](frontend/data/FacilityAddresses_API_v1.json)**: JSON data for facility addresses.

## Backend

- **[`backend/server.js`](backend/server.js)**: The main server file, built with Express.js. It handles API requests, serves static files, and manages application routes.

## Documentation (`docs/`)
- This directory contains all project documentation, including plans and brainstorming files.
