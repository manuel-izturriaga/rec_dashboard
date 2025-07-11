# AI Coding Agent Instructions: Campground Availability Dashboard

## 1. Project Overview

Your task is to build a simple, engaging, and user-friendly web application that displays campground availability. The application will fetch data from two separate APIs and present it in a visually appealing dashboard. The core design concept is to display each campsite's information in a format resembling a "Pokemon card," with an image, attributes, and an availability calendar.

## 2. Technology Stack

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (ES6+)
*   **Runtime:**
    *   Bun.js (for all scripting and server needs)
*   **File Structure:**
    *   Organize the project into a clean and logical structure with separate folders for CSS, JavaScript, and any assets.

## 3. API Endpoints

The application will use two primary API endpoints from `recreation.gov`.

### 3.1. AVAILABILITY_API

This API provides detailed information about each campsite.

*   **URL:** `https://www.recreation.gov/api/camps/availability/campground/[campgroundID]/month?start_date=[date]T00%3A00%3A00.000Z`
*   **Parameters:**
    *   `[campgroundID]`: The ID of the campground (e.g., `232702` for "SEVEN POINTS (TN)").
    *   `[date]`: The start date of the month to fetch, formatted as `YYYY-MM-DD`.
*   **Example Response:**
    ```json
    {
      "campsites": {
        "27551": {
        "campsite_id": "27551",
        "site": "20",
        "loop": "SPOI",
        "campsite_reserve_type": "Site-Specific",
        "availabilities": {
          "2025-07-01T00:00:00Z": "Reserved",
          "2025-07-02T00:00:00Z": "Reserved",
          "2025-07-03T00:00:00Z": "Reserved",
          "2025-07-04T00:00:00Z": "Reserved",
          "2025-07-05T00:00:00Z": "Reserved",
          "2025-07-06T00:00:00Z": "Reserved",
          "2025-07-07T00:00:00Z": "Reserved",
          "2025-07-08T00:00:00Z": "Reserved",
          "2025-07-09T00:00:00Z": "Reserved",
          "2025-07-10T00:00:00Z": "Reserved",
          "2025-07-11T00:00:00Z": "Reserved",
          "2025-07-12T00:00:00Z": "Available",
          "2025-07-13T00:00:00Z": "Reserved",
          "2025-07-14T00:00:00Z": "Reserved",
          "2025-07-15T00:00:00Z": "Reserved",
          "2025-07-16T00:00:00Z": "Reserved",
          "2025-07-17T00:00:00Z": "Reserved",
          "2025-07-18T00:00:00Z": "Reserved",
          "2025-07-19T00:00:00Z": "Reserved",
          "2025-07-20T00:00:00Z": "Available",
          "2025-07-21T00:00:00Z": "Reserved",
          "2025-07-22T00:00:00Z": "Reserved",
          "2025-07-23T00:00:00Z": "Reserved",
          "2025-07-24T00:00:00Z": "Reserved",
          "2025-07-25T00:00:00Z": "Reserved",
          "2025-07-26T00:00:00Z": "Reserved",
          "2025-07-27T00:00:00Z": "Reserved",
          "2025-07-28T00:00:00Z": "Available",
          "2025-07-29T00:00:00Z": "Reserved",
          "2025-07-30T00:00:00Z": "Reserved",
          "2025-07-31T00:00:00Z": "Reserved"
        },
        "quantities": {
          "2025-07-01T00:00:00Z": 0,
          "2025-07-02T00:00:00Z": 0,
          "2025-07-03T00:00:00Z": 0,
          "2025-07-04T00:00:00Z": 0,
          "2025-07-05T00:00:00Z": 0,
          "2025-07-06T00:00:00Z": 0,
          "2025-07-07T00:00:00Z": 0,
          "2025-07-08T00:00:00Z": 0,
          "2025-07-09T00:00:00Z": 0,
          "2025-07-10T00:00:00Z": 0,
          "2025-07-11T00:00:00Z": 0,
          "2025-07-12T00:00:00Z": 1,
          "2025-07-13T00:00:00Z": 0,
          "2025-07-14T00:00:00Z": 0,
          "2025-07-15T00:00:00Z": 0,
          "2025-07-16T00:00:00Z": 0,
          "2025-07-17T00:00:00Z": 0,
          "2025-07-18T00:00:00Z": 0,
          "2025-07-19T00:00:00Z": 0,
          "2025-07-20T00:00:00Z": 1,
          "2025-07-21T00:00:00Z": 0,
          "2025-07-22T00:00:00Z": 0,
          "2025-07-23T00:00:00Z": 0,
          "2025-07-24T00:00:00Z": 0,
          "2025-07-25T00:00:00Z": 0,
          "2025-07-26T00:00:00Z": 0,
          "2025-07-27T00:00:00Z": 0,
          "2025-07-28T00:00:00Z": 1,
          "2025-07-29T00:00:00Z": 0,
          "2025-07-30T00:00:00Z": 0,
          "2025-07-31T00:00:00Z": 0
        },
      "campsite_type": "STANDARD ELECTRIC",
      "type_of_use": "Overnight",
      "min_num_people": 1,
      "max_num_people": 8,
      "capacity_rating": "Single",
      "hide_external": false,
      "campsite_rules": null,
      "supplemental_camping": null
    },...
  }
}
    ```

### 3.2. SITES_API

This API provides the availability status for each campsite for a given month.

*   **URL:** `https://www.recreation.gov/api/search/campsites?fq=asset_id%3A[campgroundID]&size=70`
*   **Parameters:**
    *   `[campgroundID]`: The ID of the campground.
*   **Example Response:**
    ```json
    {
  "campsites": [
    {
      "accessible": "false",
      "aggregate_cell_coverage": 2.90909090909091,
      "asset_id": "232702",
      "asset_name": "SEVEN POINTS (TN)",
      "asset_type": "Campground",
      "attributes": [
        {
          "attribute_category": "site_details",
          "attribute_id": 11,
          "attribute_name": "Checkin Time",
          "attribute_value": "3:00 PM"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 65,
          "attribute_name": "Pets Allowed",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 77,
          "attribute_name": "Shade",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 56,
          "attribute_name": "Min Num of People",
          "attribute_value": "1"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 29,
          "attribute_name": "Electric Hookup",
          "attribute_value": "50 amp"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 10,
          "attribute_name": "Capacity/Size Rating",
          "attribute_value": "Single"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 52,
          "attribute_name": "Max Num of People",
          "attribute_value": "8"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 9,
          "attribute_name": "Campfire Allowed",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 12,
          "attribute_name": "Checkout Time",
          "attribute_value": "12:00 PM"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 97,
          "attribute_name": "Water Hookup",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 23,
          "attribute_name": "Driveway Entry",
          "attribute_value": "Back-In"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 0,
          "attribute_name": "Is Equipment Mandatory",
          "attribute_value": "true"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 0,
          "attribute_name": "Site Length",
          "attribute_value": "97"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 54,
          "attribute_name": "Max Vehicle Length",
          "attribute_value": "20"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 53,
          "attribute_name": "Max Num of Vehicles",
          "attribute_value": "2"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 26,
          "attribute_name": "Driveway Surface",
          "attribute_value": "Paved"
        },
        {
          "attribute_category": "equipment_details",
          "attribute_id": 0,
          "attribute_name": "Tent Pad Width",
          "attribute_value": "0"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 29,
          "attribute_name": "Electricity Hookup",
          "attribute_value": "50"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 31,
          "attribute_name": "Fire Pit",
          "attribute_value": "Y"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 300,
          "attribute_name": "Map X Coordinate",
          "attribute_value": "383.83"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 67,
          "attribute_name": "Picnic Table",
          "attribute_value": "Y"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 4,
          "attribute_name": "BBQ",
          "attribute_value": "Y"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 97,
          "attribute_name": "Water Hookup",
          "attribute_value": "Y"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 314,
          "attribute_name": "Placed on Map",
          "attribute_value": "1"
        },
        {
          "attribute_category": "amenities",
          "attribute_id": 301,
          "attribute_name": "Map Y Coordinate",
          "attribute_value": "241.34"
        }
      ],
      "average_rating": 4.571429,
      "campsite_id": "28184",
      "campsite_reserve_type": "Site-Specific",
      "campsite_status": "Open",
      "city": "Hermitage",
      "country_code": "United States",
      "fee_templates": {
        "Off Peak": "Off PeakSTANDARD ELECTRIC",
        "Peak": "PeakSTANDARD ELECTRIC",
        "Transition": "TransitionSTANDARD ELECTRIC",
        "Walk In": "Walk InSTANDARD ELECTRIC"
      },
      "latitude": "36.13468800000000",
      "longitude": "-86.57165500000001",
      "loop": "SPOI",
      "name": "01",
      "notices": [
        {
          "text": "Please note that there are no sewer hook ups at the campground.",
          "type": "warning"
        }
      ],
      "number_of_ratings": 14,
      "org_id": "130",
      "org_name": "US Army Corps of Engineers",
      "parent_asset_id": "232702",
      "parent_asset_name": "SEVEN POINTS (TN)",
      "parent_asset_type": "campground",
      "permitted_equipment": [
        {
          "equipment_name": "Tent",
          "max_length": 100
        },
        {
          "equipment_name": "RV",
          "max_length": 45
        },
        {
          "equipment_name": "Trailer",
          "max_length": 45
        }
      ],
      "preview_image_url": "https://cdn.recreation.gov/public/2022/02/10/17/08/28184_95cdf2ce-a384-4405-802c-fe429e43a166_700.jpg",
      "reservable": true,
      "state_code": "Tennessee",
      "type": "STANDARD ELECTRIC",
      "type_of_use": "Overnight"
    },
    ```

## 4. Frontend Design and Functionality

### 4.1. Main Dashboard

*   The main view will be a grid of "campsite cards."
*   At the top of the page, there will be a single-row filter and selection bar.

### 4.2. Filter/Selector Bar

1.  **Campground Input:** A text input field for the user to enter a `campgroundID`.
2.  **Attribute Filters:** A checkbox dropdown menu for filtering campsites by attributes. Include icons for common attributes like "Electric Hookup" and "Water Hookup."
3.  **Month Selector:** A dropdown or calendar interface to select the month. This will determine the `start_date` for the API calls.
4.  **Consecutive Days Filter:** A checkbox dropdown for days of the week (Monday-Sunday). This will filter the cards to show only campsites that are available for the selected consecutive days.

### 4.3. Campsite Card

Each card should be styled to look minimalist and fun, like a Pokemon card.

*   **Top Section:** Display the campsite's image, fetched from the `preview_image_url` in the `AVAILABILITY_API` response.
*   **Middle Section:** List key attributes of the campsite (e.g., "Max People," "Pets Allowed," "Electric Hookup").
*   **Bottom Section:** An availability calendar for the selected month.
    *   The calendar should be laid out in a weekly format, with weeks starting on Monday and ending on Sunday.
    *   Dates that are "Available" should be colored green.
    *   Dates that are "Reserved" or otherwise unavailable should be colored grey.

## 5. Implementation Details

*   **Data Fetching:** Create JavaScript functions to fetch data from both APIs based on user selections.
*   **Data Merging:** Combine the data from both APIs using the `campsite_id` as the key. The `AVAILABILITY_API` provides the details for the card, and the `SITES_API` provides the availability for the calendar.
*   **Dynamic Rendering:** Dynamically create and render the campsite cards based on the fetched and merged data.
*   **Filtering Logic:** Implement the filtering logic for attributes and consecutive day availability. When a filter is applied, the dashboard should update to show only the matching campsite cards.

## 6. File Structure

Create the following file and folder structure:

```
/
|-- index.html
|-- css/
|   |-- style.css
|-- js/
|   |-- main.js
|   |-- api.js
|   |-- ui.js
|-- assets/
|   |-- (images and icons for attributes)
|-- backend/
|   |-- (any server-side logic with Bun.js, if necessary)
```

## 7. Documentation

*   Create a `plan.md` file outlining your plan for implementing all features.
*   Create a `code_documentation.md` file with detailed documentation for all JavaScript functions and scripts. This will be used by other AI agents who may work on the code in the future.