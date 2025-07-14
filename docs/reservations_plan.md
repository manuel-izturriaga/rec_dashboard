# Reservation Page Implementation Plan

This document outlines the technical plan for creating a new reservations page in the dashboard.

## 1. File Structure

The following new files will be created to support the reservations page:

-   `frontend/reservations.html`: The HTML file for the new reservations page.
-   `frontend/js/reservations.js`: The JavaScript file containing the logic for the reservations page.

## 2. HTML Structure (`frontend/reservations.html`)

The `reservations.html` page will have the following basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservations</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6">Reservations</h1>
        <div class="filter-section mb-4">
            <label for="month-select" class="mr-2">Select Month:</label>
            <input type="month" id="month-select">
        </div>
        <div id="reservations-summary">
            <!-- Aggregated reservation data will be displayed here -->
        </div>
    </div>
    <script src="js/reservations.js" type="module"></script>
</body>
</html>
```

## 3. JavaScript Logic (`frontend/js/reservations.js`)

The `frontend/js/reservations.js` file will handle the following:

### 3.1. Fetching Data

-   A function, `fetchReservations(dateFrom, dateTo)`, will be created to fetch data from the API endpoint: `https://ridb.recreation.gov/api/v1/reservations`.
-   This function will dynamically construct the URL with the `dateFrom` and `dateTo` parameters.
-   It will handle potential API errors gracefully.

### 3.2. Date Filter Logic

-   An event listener will be attached to the `month-select` input field.
-   When the user selects a month, the event listener will trigger a function to:
    -   Get the selected month and year.
    -   Calculate the first and last day of that month.
    -   Call the `fetchReservations` function with the calculated dates.

### 3.3. Data Aggregation

-   A function, `aggregateReservations(reservations)`, will be created to process the fetched data.
-   This function will iterate through the reservations array and group them by `parent_location_id`.
-   It will calculate the total number of reservations for each location.
-   The output will be an object where keys are `parent_location_id` and values are the total reservation counts.

### 3.4. Rendering Data

-   A function, `renderSummary(aggregatedData)`, will be responsible for displaying the data on the page.
-   It will clear any existing content in the `reservations-summary` div.
-   It will then iterate through the aggregated data and create HTML elements to display the summary for each location.

## 4. Main Page Modification (`frontend/index.html`)

To provide access to the new page, a navigation link will be added to `frontend/index.html`. A new `nav` element should be added near the top of the body, after the main heading.

**Modification to `frontend/index.html`:**

```html
<!-- ... inside <body> tag ... -->
<div class="cards-wrapper">
    <h1 class="text-3xl font-bold mb-6 w-full text-center">Your Campsite Collection</h1>
    <nav class="w-full text-center mb-4">
        <a href="index.html" class="text-blue-500 hover:underline">Campsites</a> |
        <a href="reservations.html" class="text-blue-500 hover:underline">Reservations</a>
    </nav>
    
    <div id="global-notices" class="global-notices-section hidden">
<!-- ... rest of the file ... -->
```

</div>