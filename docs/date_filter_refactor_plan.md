# Date Filter Refactor Plan

## 1. Project Goal

The objective of this refactor is to enhance the user interface of the date filter by replacing the current text-based navigation buttons with icons. Additionally, a new "search month" icon will be introduced. This new feature will allow users to trigger a data fetch for the entire currently displayed month, but only if no specific date range has been selected.

## 2. Files to be Modified

The following files will require modification to implement the new features:

*   **`frontend/js/ui.js`**: To update the HTML structure of the calendar modal.
*   **`frontend/js/main.js`**: To add the new event listener and logic for the "search month" functionality.
*   **`frontend/css/style.css`**: To add styling for the new icons and ensure they are visually consistent with the existing UI.

## 3. Implementation Steps

### Step 1: Update the Calendar Header in `ui.js`

The primary change in this file will be within the `createInteractiveCalendar` function. The existing `<button>` elements for month navigation will be replaced with `<i>` tags, which can be styled to display icons. A new icon for the "search month" functionality will also be added.

**Location:** [`frontend/js/ui.js:176`](frontend/js/ui.js:176)

**Current Code:**
```html
<button id="prev-month-btn"><</button>
<h3 id="calendar-month-year">${monthName} ${year}</h3>
<button id="next-month-btn">></button>
```

**New Code:**
```html
<i id="prev-month-btn" class="calendar-nav-icon"><</i>
<h3 id="calendar-month-year">${monthName} ${year}</h3>
<i id="search-month-btn" class="calendar-nav-icon">&#x1F50D;</i> <!-- Magnifying glass icon -->
<i id="next-month-btn" class="calendar-nav-icon">></i>
```

### Step 2: Add Styles for New Icons in `style.css`

New CSS rules will be added to style the new `<i>` elements as clickable icons and provide visual feedback on hover.

**Location:** [`frontend/css/style.css`](frontend/css/style.css) (append to the end of the file)

**New CSS:**
```css
.calendar-nav-icon {
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.2s;
    font-style: normal; /* Remove italic styling from <i> tag */
}

.calendar-nav-icon:hover {
    background-color: #4a5568;
}

#search-month-btn {
    font-size: 1.2em;
}
```

### Step 3: Implement "Search Month" Logic in `main.js`

A new event listener will be added to the `openCalendarModal` function to handle clicks on the "search month" icon.

**Location:** [`frontend/js/main.js:62`](frontend/js/main.js:62) (add after the existing event listeners)

**New JavaScript:**
```javascript
document.getElementById('search-month-btn').addEventListener('click', () => {
    if (!selectionStart && !selectionEnd) {
        currentStartDate = new Date(calendarDate);
        currentStartDate.setDate(1);
        handleApiParamsChange();
        closeCalendarModal();
    }
});
```

This code will check if a date range is selected. If not, it will set the `currentStartDate` to the first day of the month currently visible in the calendar and then trigger the data fetching process.

## 4. Testing Plan

After implementing the changes, the following scenarios should be tested:

1.  **Icon Functionality:**
    *   Verify that the previous and next month icons navigate the calendar correctly.
    *   Verify that the new icons have the correct hover effects.
2.  **"Search Month" Feature:**
    *   Open the calendar, navigate to a different month, and click the "search month" icon without selecting a date range. Confirm that the data for the new month is fetched and displayed.
    *   Select a date range and then click the "search month" icon. Confirm that nothing happens, as the feature should be disabled when a range is selected.
3.  **Existing Functionality:**
    *   Ensure that the date range selection and filtering still work as expected.
    *   Confirm that resetting filters still functions correctly.
