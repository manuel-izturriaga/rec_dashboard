# Codebase Documentation

This document provides an overview of the project's components, their functionalities, and how they interact with each other.

## Backend

### `backend/server.js`

This file contains a simple Bun server that acts as a proxy to the Recreation.gov API. It fetches data from two different endpoints, combines them, and serves the result.

#### Server Logic

-   The server listens on port `3000`.
-   It exposes a single API endpoint: `/api/campsites`.
-   It requires two query parameters:
    -   `campgroundId`: The ID of the campground to fetch data for.
    -   `month`: The starting month for availability data (in `YYYY-MM-DD` format).

#### Data Fetching and Combination

-   The server fetches data from two Recreation.gov API endpoints concurrently:
    1.  **Availability API**: Gets the monthly availability for a given campground.
    2.  **Sites API**: Gets detailed information about each campsite in the campground.
-   It then combines the data from both sources, using the `campsite_id` as the key.
-   The combined data is returned as a JSON array.
-   CORS is enabled to allow requests from the frontend.

## Frontend

### `frontend/js/api.js`

This file is responsible for all communication with the backend and external APIs.

#### `fetchCombinedData(campgroundId, startDate)`

-   **Purpose**: Fetches campsite details and availability data.
-   **Parameters**:
    -   `campgroundId` (string): The ID of the campground.
    -   `startDate` (Date): The start date for availability.
-   **Functionality**:
    -   Constructs URLs for the search and availability APIs on Recreation.gov.
    -   Fetches data from both APIs concurrently using `Promise.all()`.
    -   Combines the results, linking availability data to each campsite by its `campsite_id`.
    -   Handles errors by displaying a message in the UI.
-   **Returns**: A `Promise` that resolves to an object containing the combined campsite data, or `null` on error.

### `frontend/js/ui.js`

This file handles all UI rendering and manipulation.

#### `createCampsiteCard(campsite, currentStartDate, selectedDays)`

-   **Purpose**: Creates an HTML element for a single campsite card.
-   **Functionality**:
    -   Extracts and displays various campsite attributes like hookups, site length, and check-in/out times.
    -   Generates a star rating display.
    -   Collects and lists amenities.
    -   Renders a daily availability calendar for the selected month, highlighting available, reserved, and unknown dates. The calendar can be filtered by specific days of the week.

#### `displayCampsites(campsitesToDisplay, currentStartDate, selectedDays)`

-   **Purpose**: Renders a list of campsite cards and global notices.
-   **Functionality**:
    -   Clears any previously displayed content.
    -   Separates campsites into two categories: "SP/Group Sites" and "Other Campsites" based on the `isGroupSite` helper function.
    -   Creates and appends a card for each campsite using `createCampsiteCard`.
    -   Collects and displays unique global notices (e.g., "no sewer hook ups").
    -   Displays a message if no campsites are found for a given category or for the current filters.

#### Helper Functions

-   `getAttributeValue(attributes, name)`: Safely retrieves an attribute value from a campsite's attributes array.
-   `getStarRating(rating)`: Converts a numerical rating into a string of star emojis.
-   `isGroupSite(campsite)`: Determines if a campsite is a group site based on its name and type.

### `frontend/js/main.js`

This is the main entry point for the frontend application. It initializes the application, sets up event listeners, and manages the application state.

#### Global State

-   `originalCampsites`: Stores the complete, unfiltered list of campsites fetched from the API.
-   `currentCampgroundId`: The ID of the currently selected campground.
-   `currentStartDate`: The start date for the availability view.

#### Core Functions

-   `populateTypeFilter(campsites)`: Populates the "Type" filter dropdown with unique campsite types from the fetched data.
-   `applyFilters()`: Filters the `originalCampsites` array based on the user's selections (type, status, waterfront, days of the week) and calls `displayCampsites` to update the UI.
-   `resetFilters()`: Resets all filter controls to their default values and re-fetches the data.
-   `handleApiParamsChange()`: Triggered when the campground ID or start date changes. It calls `fetchCombinedData` to get new data, stores it, populates the type filter, and applies the current filters.

#### Initialization

-   On `window.onload`, the application sets the default campground ID and start date, then calls `handleApiParamsChange` to perform the initial data load and render the UI.
-   Event listeners are attached to all filter controls and input fields to trigger `applyFilters` or `handleApiParamsChange` as needed.