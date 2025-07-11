# Codebase Overview

This document provides an overview of the project's structure and components.

## Frontend

### HTML
- [`frontend/index.html`](./frontend/index.html): Main landing page.
- [`frontend/reservations.html`](./frontend/reservations.html): Page for viewing and managing reservations.

### CSS
- [`frontend/css/style.css`](./frontend/css/style.css): Main stylesheet for the application.

### JavaScript
- [`frontend/js/main.js`](./frontend/js/main.js): Main JavaScript file for the landing page.
- [`frontend/js/api.js`](./frontend/js/api.js): Handles API communication.
- [`frontend/js/reservations.js`](./frontend/js/reservations.js): Logic for the reservations page. Includes caching to handle `304 Not Modified` responses and correctly parses nested reservation data from the API.
- [`frontend/js/ui.js`](./frontend/js/ui.js): UI-related helper functions.

## Backend
- [`backend/server.js`](./backend/server.js): The main Node.js server file.
