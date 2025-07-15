# Codebase Documentation

This document provides an overview of the project structure and components.

## Frontend

The frontend is responsible for rendering the user interface and handling user interactions.

### `frontend/js/all-campgrounds.js`

This file manages the "All Campgrounds" page.

**Key Functions:**

*   **`Promise.all([...])`**: Concurrently fetches campground data from `data/Facilities_API_v1.json` and address data from `data/FacilityAddresses_API_v1.json`.
*   **`mergeData(facilities, addresses)`**: Merges the two datasets based on `FacilityID`, creating a unified data source.
*   **`populateStateFilter()`**: Populates the state filter dropdown using the `AddressStateCode` from the merged data.
*   **`renderTable(data)`**: Renders the list of campgrounds, now including `City` and `AddressStateCode`.
*   **`filterAndRender()`**: Filters campgrounds based on the selected state (`AddressStateCode`) and search term.

### `frontend/all-campgrounds.html`

The HTML structure for the "All Campgrounds" page. It includes the table, filters, and search bar.
