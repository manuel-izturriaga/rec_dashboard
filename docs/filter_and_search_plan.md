# Updated Plan: State Filter, Search Bar, and Enhanced Details

1.  **Modify `frontend/all-campgrounds.html`**:
    *   Add a dropdown menu (`<select>`) for state selection.
    *   Add a text input (`<input type="text">`) to serve as the search bar.
    *   Add new table headers (`<th>`) for "City" and "Reservable".

2.  **Update `frontend/js/all-campgrounds.js`**:
    *   Fetch and store the full list of campgrounds.
    *   Populate the state filter dropdown with unique states.
    *   Implement a filtering function that applies both the state filter and the search term. The search will apply to the campground name.
    *   Create a `renderTable` function to display the campgrounds.
    *   Add event listeners to both the state dropdown and the search bar to trigger the filtering logic and re-render the table.
    *   Update `renderTable` to populate the new "City" and "Reservable" columns.

### Updated Workflow Diagram

```mermaid
graph TD
    A[Page Load] --> B{Fetch All Campgrounds};
    B --> C{Store Campgrounds Data};
    B --> D{Extract Unique States};
    D --> E{Populate State Filter Dropdown};
    C --> F{Render Initial Table};

    G[User Selects State] --> J{Apply Filters};
    H[User Enters Search Term] --> J;

    J --> K{Render Filtered Table};