# AI Agent Instructions: Campground Availability Web App

## 1. Project Overview

Build a simple, engaging, and user-friendly web application to display campground site availability. The application will fetch data from two external APIs, combine the information, and present it to the user in a visually appealing "pokemon card-based" interface. The primary goal is to make finding available campsites easy and fun.

## 2. Core Features

- **Dynamic Filtering:** Users can filter campsites based on:
    - Campground ID
    - Site attributes (e.g., electric hookup, water hookup)
    - Month of interest
    - Specific days of the week availability (consecutive)
- **Campsite Information Display:** Each campsite will be displayed as a "card" containing:
    - A preview image.
    - Key attributes and details.
    - A mini-calendar showing availability for the selected month.
- **API Integration:** The app will consume two primary APIs to get all necessary data.

## 3. Technical Stack

- **Runtime:** Bun.js
- **Frontend:** HTML, CSS, JavaScript (vanilla).
- **Backend:** A simple server using Bun.js to handle API requests and data processing.
- **Styling:** CSS in a separate file.
- **Scripts:** JavaScript organized into logical modules/files.

## 4. API Endpoints

### 4.1. Availability API

This API provides detailed information about all campsites within a specific campground.

- **URL:** `https://www.recreation.gov/api/camps/availability/campground/[campgroundID]/month?start_date=[date]T00%3A00%3A00.000Z`
- **Method:** `GET`
- **Parameters:**
    - `[campgroundID]`: The ID of the campground (e.g., `232702`).
    - `[date]`: The first day of the month to check, formatted as `YYYY-MM-DD` (e.g., `2025-07-01`).
- **Response Data Structure:**
  The response is a JSON object containing a `campsites` array. Each object in the array represents a campsite and contains detailed attributes, location info, permitted equipment, etc.
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

### 4.2. Sites API

This API provides the availability status for each day of the month for all campsites in a campground.

- **URL:** `https://www.recreation.gov/api/search/campsites?fq=asset_id%3A[campgroundID]&agg=type&size=70`
- **Method:** `GET`
- **Parameters:**
    - `[campgroundID]`: The ID of the campground (e.g., `232702`).
- **Response Data Structure:**
  The response is a JSON object with a `campsites` key. This key holds an object where each key is a `campsite_id` and the value contains the site details and an `availabilities` object.
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

## 5. Frontend Design (UI/UX)

### 5.1. Main Layout

- A single-row header section for filters and selectors.
- A main content area to display the grid of campsite cards.

### 5.2. Filter Bar

1.  **Campground Input:** A text input field for the `campgroundID`.
2.  **Attribute Filter:** A multi-select dropdown with checkboxes for key attributes. Include icons for visual appeal (e.g., a lightning bolt for electric, a water drop for water).
3.  **Date Selector:** A month/year selector that updates the `date` parameter for the API calls.
4.  **Days Filter:** A multi-select dropdown with checkboxes for Monday through Sunday. This will filter for sites available for all selected days consecutively.

### 5.3. Campsite Card Component

The design should be minimalist and fun, inspired by a "Pokémon card".

- **Top Section:** Display the `preview_image_url`.
- **Middle Section (Attributes):**
    - **Campsite Name/Number:** Use `site` from Sites API or `name` from Availability API.
    - **Key Details:** Display important attributes from the Availability API response (e.g., "Electric Hookup: 50 amp", "Pets Allowed: Yes", "Max Vehicle Length: 20").
- **Bottom Section (Availability Calendar):**
    - Display a mini-calendar for the selected month.
    - Weeks should run Monday to Sunday.
    - Color-code the days:
        - **Green:** `Available`
        - **Grey:** `Reserved` or otherwise not available.

## 6. Backend & Data Logic

1.  **Create a Bun server** to act as a proxy. This avoids CORS issues and hides API logic from the client.
2.  The server should expose a single endpoint, e.g., `/api/campsites?campgroundId=...&month=...`.
3.  When this endpoint is hit, the server will:
    a. Call the **Availability API** to get site details.
    b. Call the **Sites API** to get daily availability.
    c. **Combine the data:** Create a unified JSON object for each campsite that includes both its details (from Availability API) and its daily availability calendar (from Sites API).
    d. Return the combined data to the frontend.
4.  Implement filtering logic on the backend to apply attribute and day-of-week filters before returning data.

## 7. Project File Structure

Organize files logically. Create folders as needed.

```
rec_dashboard/
├── backend/
│   └── server.js       # Bun.js server for API proxy and data processing
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── style.css   # All styles
│   └── js/
│       ├── main.js       # Main script to orchestrate UI and data fetching
│       ├── api.js        # Functions for fetching data from our backend
│       └── ui.js         # Functions for creating and updating UI components (cards, etc.)
├── llms.md             # This instruction file.
├── codebase.md         # Documentation of components and their functions.
└── package.json        # Project dependencies and scripts
```

## 8. Development Setup

- Initialize the project with `bun init`.
- Add any necessary dependencies.
- Create a `start` script in `package.json` to run the backend server: `"start": "bun run backend/server.js"`.

## 9. Documentation and Instructions

Document everything and update documentation as features are implemented. If possible, break up the work into subtasks.

## 10. First Draft

The first draft of this project is found in first_draft.html. Parse out that file and distribute the contents into separate files as needed for optimum organization. There are a few bugs in it that we will fix later, but for now that should be our starting point.
