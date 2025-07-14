# Plan: Date Range Filter Enhancement

This document outlines the plan to enhance the date filter to allow users to select a specific date range within a selected month.

## 1. Proposed Solution

The proposed solution introduces a two-stage filtering process. First, the user selects a month, which fetches all availability data for that month. Then, the user can optionally select a start and end date within that month to further refine the results.

- **UI:** A new "Select Dates" button will appear next to the month input. Clicking this will reveal a dedicated date range selection UI.
- **Interaction:** The date range selector will allow picking a start and end date. An "Apply" button will trigger the client-side filtering of the already-fetched monthly data.
- **Client-Side Filtering:** The core logic will be performed on the client-side, avoiding additional API calls.

## 2. User Flow

```mermaid
graph TD
    A[User selects a month] --> B{API fetches data for the entire month};
    B --> C[Campsites for the month are displayed];
    C --> D{User clicks "Select Dates"};
    D --> E[Date range picker UI is shown];
    E --> F{User selects a start and end date};
    F --> G[Apply button is enabled];
    G --> H{User clicks "Apply"};
    H --> I[Campsite list is updated to show only sites available for the entire selected range];
    C --> J[User can still use other filters];
    J --> I;
```

## 3. Implementation Details

### `frontend/index.html`

- **Add "Select Dates" button and date range picker container:**
  In the `filter-group` for the month selector, add a button and a new container for the date picker.

  ```html
  <div class="filter-group">
      <label for="start-date-input">Month:</label>
      <input type="month" id="start-date-input">
      <button id="select-dates-btn" class="ml-2">Select Dates</button>
  </div>
  <div id="date-range-picker-container" class="hidden">
      <div class="filter-group">
          <label for="start-range-date">Start Date:</label>
          <input type="date" id="start-range-date">
      </div>
      <div class="filter-group">
          <label for="end-range-date">End Date:</label>
          <input type="date" id="end-range-date">
      </div>
      <button id="apply-date-range-filter" disabled>Apply</button>
      <button id="clear-date-range-filter">Clear</button>
  </div>
  ```

### `frontend/css/style.css`

- **Style the new elements:**
  Add CSS to style the date range picker container and its buttons.

  ```css
  #date-range-picker-container {
      border: 1px solid #ccc;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 8px;
  }
  ```

### `frontend/js/main.js`

- **Get references to new DOM elements:**

  ```javascript
  const selectDatesBtn = document.getElementById('select-dates-btn');
  const dateRangePickerContainer = document.getElementById('date-range-picker-container');
  const startRangeDateInput = document.getElementById('start-range-date');
  const endRangeDateInput = document.getElementById('end-range-date');
  const applyDateRangeFilterBtn = document.getElementById('apply-date-range-filter');
  const clearDateRangeFilterBtn = document.getElementById('clear-date-range-filter');
  ```

- **Add event listeners:**

  - **`select-dates-btn`:** Toggle the visibility of the `date-range-picker-container`.
  - **`start-range-date`, `end-range-date`:** Enable the `apply-date-range-filter` button when both dates are selected. Also, ensure the end date cannot be before the start date.
  - **`apply-date-range-filter`:** Call `applyFilters()` and disable the button.
  - **`clear-date-range-filter`:** Clear the date range inputs, hide the container, and re-apply filters.

- **Modify `applyFilters()`:**

  - Add a new filtering step that checks for availability within the selected date range if one is provided.
  - This will involve creating a new helper function, `hasAvailabilityForRange()`.

  ```javascript
  function applyFilters() {
      // ... existing filter logic ...
      const startDate = startRangeDateInput.value;
      const endDate = endRangeDateInput.value;

      const filteredCampsites = originalCampsites.filter(campsite => {
          // ... existing filter conditions ...

          // Date Range Filter
          if (startDate && endDate) {
              if (!hasAvailabilityForRange(campsite, startDate, endDate)) {
                  return false;
              }
          }

          return true;
      });

      displayCampsites(filteredCampsites, currentStartDate, selectedDays);
  }
  ```

- **Create `hasAvailabilityForRange()` helper function:**

  This function will check if a campsite is "Available" for every day in the selected range.

  ```javascript
  function hasAvailabilityForRange(campsite, startDateStr, endDateStr) {
      const start = new Date(startDateStr + 'T00:00:00Z');
      const end = new Date(endDateStr + 'T00:00:00Z');
      let currentDate = new Date(start);

      while (currentDate <= end) {
          const isoDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';
          if (campsite.availability[isoDate] !== 'Available') {
              return false;
          }
          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
      return true;
  }
  ```

- **Update `resetFilters()`:**

  - Add logic to clear and hide the date range picker.

### `frontend/js/ui.js`

- **No changes are required in `ui.js` for this plan.** The existing `generateCalendarGrid` will continue to display the entire month's availability, which is the desired behavior. The filtering itself happens in `main.js`.

This plan provides a clear path to implementing the date range filter enhancement, improving the user's ability to find available campsites without changing the core API interaction.