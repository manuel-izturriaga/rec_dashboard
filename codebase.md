# Codebase Overview

This document provides an overview of the project's structure and components.

## Frontend

### HTML
- [`frontend/index.html`](./frontend/index.html): Main landing page.
- [`frontend/reservations.html`](./frontend/reservations.html): A dynamic dashboard page for viewing reservation analytics.

### CSS
- [`frontend/css/style.css`](./frontend/css/style.css): Main stylesheet for the application.

### JavaScript
- [`frontend/js/main.js`](./frontend/js/main.js): Main JavaScript file for the landing page. It handles all user interactions, including filtering for campsites. It now features a completely redesigned, interactive calendar modal for date range selection. The modal supports "drill-in" navigation from year to month to day, and the selected range is fully integrated with the core filtering logic. The calendar now appears directly under the date range input field, features a dark theme to match the rest of the site, and correctly highlights the entire selected date range. A bug was fixed to ensure date comparisons are handled in UTC, which resolves an issue where the first day of a selected range was not being highlighted correctly.
- [`frontend/js/api.js`](./frontend/js/api.js): Handles API communication.
- [`frontend/js/reservations.js`](./frontend/js/reservations.js): Powers the reservations dashboard. It fetches reservation data, populates a state filter, and renders several charts (line, bar, pie) using Chart.js to visualize the data. It handles filtering and dynamically updates all components.
- [`frontend/js/ui.js`](./frontend/js/ui.js): Contains UI-related helper functions. It is now responsible for generating the HTML for the non-interactive availability grid in campsite cards, as well as the new interactive calendar modal, the month selector view, and the year selector view.
- [`dashboard.js`](./dashboard.js): Contains the logic for the main dashboard, including data fetching and rendering of various components.

## Backend
- [`backend/server.js`](./backend/server.js): The main Node.js server file.
