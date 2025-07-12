# Codebase Overview

This document provides an overview of the project's structure and components.

## Frontend

### HTML
- [`frontend/index.html`](./frontend/index.html): Main landing page.
- [`frontend/reservations.html`](./frontend/reservations.html): A dynamic dashboard page for viewing reservation analytics.

### CSS
- [`frontend/css/style.css`](./frontend/css/style.css): Main stylesheet for the application.

### JavaScript
- [`frontend/js/main.js`](./frontend/js/main.js): Main JavaScript file for the landing page.
- [`frontend/js/api.js`](./frontend/js/api.js): Handles API communication.
- [`frontend/js/reservations.js`](./frontend/js/reservations.js): Powers the reservations dashboard. It fetches reservation data, populates a state filter, and renders several charts (line, bar, pie) using Chart.js to visualize the data. It handles filtering and dynamically updates all components.
- [`frontend/js/ui.js`](./frontend/js/ui.js): UI-related helper functions.
- [`dashboard.js`](./dashboard.js): Contains the logic for the main dashboard, including data fetching and rendering of various components.

## Backend
- [`backend/server.js`](./backend/server.js): The main Node.js server file.
