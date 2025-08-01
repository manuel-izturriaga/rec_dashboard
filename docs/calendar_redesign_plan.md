# Calendar Redesign: "Drill-In" Feature Plan

### **Objective:**
Transform the current month input into an interactive, multi-level date selection component. Users will be able to click the input to open a full-page calendar, select a day or range, and navigate between month and year views.

### **Current State Analysis:**
*   **UI:** A simple `<input type="month">` is used to select a month, which triggers a data refresh. A separate, hidden `<input type="date">` range picker can be opened with a "Select Dates" button.
*   **Logic:** Filtering is handled in `frontend/js/main.js` by `applyFilters()`. The calendar display in each campsite card is generated by `generateCalendarGrid()` in `frontend/js/ui.js` and is for display purposes only, not for interaction.
*   **Disconnect:** The month selection, date-range selection, and calendar display are three separate, loosely connected features.

### **Proposed Architecture:**
We will create a new, unified calendar modal that replaces the existing date controls. This modal will manage all date-related interactions.

Here is a diagram illustrating the new component flow:

```mermaid
graph TD
    subgraph User Interaction
        A[User Clicks "Month" Input] --> B{Open Calendar Modal};
    end

    subgraph Calendar Modal
        B --> C[Show Month View];
        C -- Clicks Day --> D[Select Day/Range];
        C -- Clicks Header --> E[Show Year View];
        E -- Clicks Month --> C;
        D -- Clicks 'Apply' --> F[Apply Date Filter];
        C -- Clicks 'Next/Prev' --> C;
    end

    subgraph Application Logic
        F --> G[Update Main UI & Filter Campsites];
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style G fill:#cfc,stroke:#333,stroke-width:2px
```

### **Step-by-Step Implementation Plan:**

1.  **Phase 1: Refactor HTML and Basic Scaffolding**
    *   **Goal:** Remove old elements and create the foundation for the new calendar modal.
    *   **Actions:**
        1.  In `frontend/index.html`, remove the `<button id="select-dates-btn">` and the entire `<div id="date-range-picker-container">`.
        2.  Change the `<input type="month" id="start-date-input">` to `<input type="text" id="date-range-display" readonly placeholder="Select a date range">`. This will display the selected range and act as the trigger for the modal.
        3.  Add a new container for the modal at the end of the `<body>`: `<div id="calendar-modal" class="modal-hidden"></div>`.

2.  **Phase 2: Build the Interactive Calendar Component**
    *   **Goal:** Create the core UI and navigation for the new calendar.
    *   **Actions:**
        1.  In `frontend/js/ui.js`, create a new function: `createInteractiveCalendar(date, selection)`. This will generate the HTML for the calendar, including:
            *   A clickable header showing the current month and year (e.g., "July 2025").
            *   "Previous" and "Next" month navigation buttons.
            *   A grid of day cells, each with a `data-date` attribute.
            *   "Apply", "Clear", and "Cancel" buttons.
        2.  In `frontend/js/main.js`, create functions `openCalendarModal()` and `closeCalendarModal()` to control the visibility of the modal.
        3.  Add a `click` event listener to the new `#date-range-display` input that calls `openCalendarModal()`.

3.  **Phase 3: Implement Date Selection Logic**
    *   **Goal:** Allow users to select a single day or a range of days.
    *   **Actions:**
        1.  In `frontend/js/main.js`, add event listeners within the modal to handle clicks on day cells.
        2.  Implement state management for the selection (e.g., `selectionStart` and `selectionEnd` dates).
        3.  On each click, re-render the calendar content to visually reflect the current selection (e.g., adding `.selected` and `.in-range` classes to the day cells).
        4.  Update `createInteractiveCalendar()` in `frontend/js/ui.js` to add the appropriate CSS classes based on the selection state passed to it.

4.  **Phase 4: Implement "Drill-In/Zoom-Out" Navigation**
    *   **Goal:** Enable navigation between the day-view, month-view, and year-view.
    *   **Actions:**
        1.  In `frontend/js/ui.js`, create a `createMonthSelectorView(year)` function that generates a grid of 12 months.
        2.  In `frontend/js/main.js`, add a click listener to the calendar's header. When clicked, it will render the month selector view inside the modal.
        3.  Add click listeners to the months in the month selector view. Clicking a month will switch the modal back to the interactive day calendar for that month.

5.  **Phase 5: Integrate with Filtering Logic**
    *   **Goal:** Connect the new calendar's selections to the application's main filtering function.
    *   **Actions:**
        1.  In `frontend/js/main.js`, when the "Apply" button in the modal is clicked:
            *   Update the `#date-range-display` input with the formatted selected range (e.g., "Jul 15, 2025 - Jul 22, 2025").
            *   Call the existing `applyFilters()` function.
            *   Close the modal.
        2.  Modify `applyFilters()` to use the `selectionStart` and `selectionEnd` state variables for the date range check, instead of reading from the old, now-removed input fields.
        3.  Update `resetFilters()` to clear the selection variables and the `#date-range-display` input.