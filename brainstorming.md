I'm wanting to build a simple webapp to display campground site and availability in a fun, engaging, and most importantly EASY manner. 

To do this we will use various API endpoints and tie them together to display all the information.

One API, let's call it AVAILABILITY_API, will be this https://www.recreation.gov/api/camps/availability/campground/[campgroundID]/month?start_date=[date]T00%3A00%3A00.000Z. Where campgroundID will be derived or selected by the user and date will be set as the first day of the month also selected by the user in the format '2025-07-01'.

This API responds with something like this:
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
          "attribute_id": 56,
          "attribute_name": "Min Num of People",
          "attribute_value": "1"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 65,
          "attribute_name": "Pets Allowed",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 9,
          "attribute_name": "Campfire Allowed",
          "attribute_value": "Yes"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 52,
          "attribute_name": "Max Num of People",
          "attribute_value": "8"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 10,
          "attribute_name": "Capacity/Size Rating",
          "attribute_value": "Single"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 11,
          "attribute_name": "Checkin Time",
          "attribute_value": "3:00 PM"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 97,
          "attribute_name": "Water Hookup",
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
          "attribute_id": 29,
          "attribute_name": "Electric Hookup",
          "attribute_value": "50 amp"
        },
        {
          "attribute_category": "site_details",
          "attribute_id": 12,
          "attribute_name": "Checkout Time",
          "attribute_value": "12:00 PM"
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
          "attribute_category": "equipment_details",
          "attribute_id": 23,
          "attribute_name": "Driveway Entry",
          "attribute_value": "Back-In"
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

THe other endpoint, SITES_API, will be https://www.recreation.gov/api/search/campsites?fq=asset_id%3A[campgroundID]&agg=type&size=70.

The SITES_API responds with this format:
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
    },

The idea is to have a dashboard where each campsite looks like a pokemon card.
Picture up top, attributes below, minimalist, fun. 

Within each card at the bottom you would also have a section for availability. It would essentially look like a calendar with each week starting on Monday ending on Sunday. The dates available would be green, unavailable will be grey.

At the top we have a one row section for filters/selectors:
1) Campground - input field for now, will update later to pull from an endpoint.
2) a checkbox dropdown with attributes (include icons), electric hookup, water hookup, etc.
3) date - this is just show months and will be tied to the api call date field.
4) Days - Monday-Sunday checkbox dropdown, to filter campsite cards only to those that have those day available consecutively.

be creative with the look of it all but stick to the idea of pokemon cards

i want this to be light and easy to use. organize all the files in the best way, create folders as needed. css should have it's own file. create js functions/scripts into their own files if it makes sense.frontend and backend should be organized respectively. 
use bun.js instead of node.js. let's keep it as streamlined and optimized as possible.

write out your plans for all features to an md file. write the documentation for all scripts in another md file, this one will be used when other llm agents need to look and work on the code.


