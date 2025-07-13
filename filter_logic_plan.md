# Plan to Refactor Filtering Logic

This document outlines the plan to fix a bug in the campsite filtering logic where the "Current Week" and "Day of Week" filters interact incorrectly.

## Analysis of the Problem

1.  **Inconsistent Week Calculation**: The `applyFilters` function in `frontend/js/main.js` calculates the week starting from Sunday, while `frontend/js/ui.js` calculates it starting from Monday. This causes synchronization issues.
2.  **Flawed Filter Logic**: The "Current Week" and "Day of Week" filters are applied as separate, independent steps. The correct behavior requires them to be treated as a single, combined condition.

## Plan for Resolution

The filtering logic within the `applyFilters` function in `frontend/js/main.js` will be refactored to correctly combine the filter conditions.

### Step-by-step Plan:

1.  **Synchronize Week Calculation**: Update the `firstDayOfWeek` calculation inside `applyFilters` to use the same Monday-first logic that is now in `ui.js`. This will ensure consistency across the application.
2.  **Combine Filter Logic**: Rewrite the filter conditions to handle the following scenarios correctly:
    *   **If "Current Week" is checked:**
        *   And **no specific days** are selected, the filter will pass for any campsite that has at least one available day within the current Monday-Sunday week.
        *   And **specific days** (e.g., Friday, Saturday) are selected, the filter will only pass for campsites that are available on one of those selected days *within* the current week.
    *   **If "Current Week" is NOT checked:**
        *   The "Day of Week" filter will revert to its original behavior, searching for availability on the selected days across the entire selected month.

This new logic will be implemented within a single, unified block inside the main filter loop to ensure the conditions are evaluated together.

### Visual Logic Flow

```mermaid
graph TD
    A[Start applyFilters] --> B{isCurrentWeekChecked?};
    B -- Yes --> C{Calculate Mon-Sun week range};
    C --> D{Iterate through campsite's availability};
    D --> E{Date in week & status is 'Available'?};
    E -- No --> D;
    E -- Yes --> F{selectedDays has items?};
    F -- Yes --> G{Is available day in selectedDays?};
    G -- Yes --> H[Set flag availableInWeek = true, break loop];
    G -- No --> D;
    F -- No --> H;
    D -- End of loop --> I{availableInWeek is true?};
    I -- No --> J[Return false (filter out)];
    I -- Yes --> K{Other filters (type, status, etc.)};

    B -- No --> L{selectedDays has items?};
    L -- Yes --> M[Run original month-based day availability checks];
    M --> N{Passes checks?};
    N -- No --> J;
    N -- Yes --> K;
    L -- No --> K;

    K --> O[All other filters pass?];
    O -- Yes --> P[Return true (keep campsite)];
    O -- No --> J;