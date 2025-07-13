# Codebase Overview

This document provides an overview of the project's structure and components.

## Frontend

### HTML
- [`frontend/index.html`](./frontend/index.html): Main landing page.
- [`frontend/reservations.html`](./frontend/reservations.html): A dynamic dashboard page for viewing reservation analytics.

### CSS
- [`frontend/css/style.css`](./frontend/css/style.css): Main stylesheet for the application.

### JavaScript
- [`frontend/js/main.js`](./frontend/js/main.js): Main JavaScript file for the landing page. It handles all user interactions, including filtering for campsites. The filtering logic correctly combines "Current Week" and "Day of Week" selections, using a Monday-first week calculation.
- [`frontend/js/api.js`](./frontend/js/api.js): Handles API communication.
- [`frontend/js/reservations.js`](./frontend/js/reservations.js): Powers the reservations dashboard. It fetches reservation data, populates a state filter, and renders several charts (line, bar, pie) using Chart.js to visualize the data. It handles filtering and dynamically updates all components.
- [`frontend/js/ui.js`](./frontend/js/ui.js): Contains UI-related helper functions, including generating the calendar grid for availability. The calendar logic is configured to treat Monday as the first day of the week.
- [`dashboard.js`](./dashboard.js): Contains the logic for the main dashboard, including data fetching and rendering of various components.

## Backend
- [`backend/server.js`](./backend/server.js): The main Node.js server file.
