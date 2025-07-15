# Plan to Merge Facility and Address Data

The core of this plan is to fetch both data sources, merge them in the browser, and then use the combined data to populate the table and filters. This approach avoids any backend changes and keeps the logic contained within the frontend.

Here are the steps I will take:

1.  **Fetch Both Data Files Concurrently:**
    *   In `frontend/js/all-campgrounds.js`, I will modify the existing `fetch` call to use `Promise.all`. This will allow the browser to download both `Facilities_API_v1.json` and `FacilityAddresses_API_v1.json` at the same time, which is more efficient.

2.  **Create an Efficient Data Merging Function:**
    *   I will create a new function, `mergeData(facilities, addresses)`, that takes the data from both files as input.
    *   To merge the data efficiently, this function will first create a JavaScript `Map` of the addresses, using `FacilityID` as the key. This will allow for very fast lookups.
    *   The function will then iterate through the `facilities` array and, for each facility, use the map to find the corresponding address. The properties from the address will be added to the facility object.
    *   This function will return a new array of `campgrounds` with the combined information.

3.  **Update Application Logic to Use Merged Data:**
    *   The main `campgrounds` array will be populated with the result from our new `mergeData` function.
    *   All other functions that rely on this data will be updated to use the new, combined data structure.

4.  **Correct and Update UI Components:**
    *   **State Filter:** The `populateStateFilter` function will be updated to use the `AddressStateCode` property from the merged data to correctly populate the state dropdown.
    *   **Table Display:** The `renderTable` function will be modified to display the `City` and `AddressStateCode` in the table.
    *   **Filtering Logic:** The `filterAndRender` function will be updated to filter by `AddressStateCode`.

## Data Flow Diagram

```mermaid
graph TD
    subgraph "Data Fetching"
        A[Facilities_API_v1.json]
        B[FacilityAddresses_API_v1.json]
    end

    subgraph "Data Processing in all-campgrounds.js"
        C(Promise.all)
        D[mergeData function]
        E[Enriched 'campgrounds' array]
    end

    subgraph "UI Updates"
        F[populateStateFilter]
        G[renderTable]
        H[filterAndRender]
        I[State Filter Dropdown]
        J[Campgrounds Table]
    end

    A --> C
    B --> C
    C --> D
    D -- Merged Data --> E
    E --> F
    E --> G
    E --> H
    F --> I
    G --> J
    H --> G