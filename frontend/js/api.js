// Define API endpoints
const API_ENDPOINT_SEARCH = 'https://www.recreation.gov/api/search/campsites?fq=asset_id%3A';
const API_ENDPOINT_AVAILABILITY = 'https://www.recreation.gov/api/camps/availability/campground/';

/**
 * Fetches campsite details and availability data from the Recreation.gov API.
 * Combines availability data with campsite details.
 * @param {string} campgroundId - The ID of the campground.
 * @param {Date} startDate - The start date for availability (first of the month).
 * @returns {Promise<Object|null>} An object containing combined campsite data, or null on error.
 */
export async function fetchCombinedData(campgroundId, startDate) {
    try {
        // Set the date to midnight UTC (00:00:00.000Z) before converting to ISO string
        const midnightStartDateUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0));
        const isoFormattedDate = midnightStartDateUTC.toISOString();
        const encodedStartDate = encodeURIComponent(isoFormattedDate);

        const searchUrl = `${API_ENDPOINT_SEARCH}${campgroundId}&size=70`; // Fetch up to 70 campsites
        const availabilityUrl = `${API_ENDPOINT_AVAILABILITY}${campgroundId}/month?start_date=${encodedStartDate}`;

        console.log("Fetching availability from:", availabilityUrl); // Log the URL to verify

        // Fetch both datasets concurrently
        const [searchResponse, availabilityResponse] = await Promise.all([
            fetch(searchUrl),
            fetch(availabilityUrl)
        ]);

        if (!searchResponse.ok) throw new Error(`Search API error! status: ${searchResponse.status}`);
        if (!availabilityResponse.ok) throw new Error(`Availability API error! status: ${availabilityResponse.status}`);

        const searchData = await searchResponse.json();
        const availabilityJson = await availabilityResponse.json();

        // Store availability data globally for easy lookup
        const availabilityData = availabilityJson.campsites || {};

        // Combine campsite details with their corresponding availability
        const combinedCampsites = searchData.campsites.map(campsite => {
            // Link availability by campsite_id
            const siteAvailability = availabilityData[campsite.campsite_id] || {};
            return { ...campsite, availability: siteAvailability };
        });

        return { campsites: combinedCampsites };

    } catch (error) {
        console.error('Error fetching data:', error);
        // Display error message in the main content area
        const spGroupSitesDisplay = document.getElementById('sp-group-sites-display');
        const otherCampsitesDisplay = document.getElementById('other-campsites-display');
        const globalNoticesDiv = document.getElementById('global-notices');
        const errorMessageHtml = `
            <div class="message-box error w-full">
                <p>Failed to load data. Please check the console for more details.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
        spGroupSitesDisplay.innerHTML = errorMessageHtml;
        otherCampsitesDisplay.innerHTML = ''; // Clear other section
        globalNoticesDiv.classList.add('hidden'); // Hide notices
        return null;
    }
}