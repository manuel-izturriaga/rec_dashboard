import { fetchCombinedData } from './api.js';
import { displayCampsites } from './ui.js';

// DOM elements
const campgroundIdInput = document.getElementById('campground-id-input');
const startDateInput = document.getElementById('start-date-input');
const typeFilter = document.getElementById('type-filter');
const statusFilter = document.getElementById('status-filter');
const waterfrontFilter = document.getElementById('waterfront-filter');
const daysOfWeekFilter = document.getElementById('days-of-week-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const spGroupSitesDisplay = document.getElementById('sp-group-sites-display');
const otherCampsitesDisplay = document.getElementById('other-campsites-display');
const globalNoticesDiv = document.getElementById('global-notices');

// Global data stores
let originalCampsites = [];
let currentCampgroundId = '232702'; // Default campground ID
let currentStartDate = new Date(); // Default to current month
currentStartDate.setMonth(currentStartDate.getMonth() + 1); // Set to first day of NEXT month
currentStartDate.setDate(1); // Set to first day of the month

/**
 * Populates the Type filter dropdown with unique campsite types.
 * @param {Array} campsites - The array of campsite objects.
 */
function populateTypeFilter(campsites) {
    const uniqueTypes = new Set();
    campsites.forEach(campsite => {
        if (campsite.type) {
            uniqueTypes.add(campsite.type);
        }
    });

    // Clear existing options except "All Types"
    typeFilter.innerHTML = '<option value="all">All Types</option>';

    // Add unique types
    Array.from(uniqueTypes).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

/**
 * Applies filters to the original campsite data and updates the display.
 */
function applyFilters() {
    const selectedType = typeFilter.value;
    const selectedStatus = statusFilter.value;
    const isWaterfrontChecked = waterfrontFilter.checked;
    // Get selected day numbers from the multi-select (0 for Sun, 1 for Mon, etc.)
    const selectedDays = Array.from(daysOfWeekFilter.querySelectorAll('.day-box.selected')).map(box => parseInt(box.dataset.day, 10));

    const filteredCampsites = originalCampsites.filter(campsite => {
        // Type filter
        if (selectedType !== 'all' && campsite.type !== selectedType) {
            return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && campsite.campsite_status !== selectedStatus) {
            return false;
        }

        // Waterfront filter (odd numbers between 11 and 41)
        if (isWaterfrontChecked) {
            const siteNumber = parseInt(campsite.name, 10);
            if (isNaN(siteNumber) || siteNumber % 2 === 0 || siteNumber < 11 || siteNumber > 41) {
                return false;
            }
        }
        return true;
    });

    displayCampsites(filteredCampsites, currentStartDate, selectedDays); // Pass selectedDays to displayCampsites
}

/**
 * Resets all filters to their default values and re-applies them.
 */
function resetFilters() {
    typeFilter.value = 'all';
    statusFilter.value = 'all';
    waterfrontFilter.checked = false;
    // Clear all selected options in the days of week filter
    Array.from(daysOfWeekFilter.querySelectorAll('.day-box')).forEach(box => {
        box.classList.remove('selected');
    });
    // Reset campground ID and month to initial defaults
    campgroundIdInput.value = '232702';
    currentCampgroundId = '232702';
    currentStartDate = new Date();
    currentStartDate.setMonth(currentStartDate.getMonth() + 1); // Set to first day of NEXT month
    currentStartDate.setDate(1);
    startDateInput.value = `${currentStartDate.getFullYear()}-${(currentStartDate.getMonth() + 1).toString().padStart(2, '0')}`;

    handleApiParamsChange(); // Re-fetch data with reset parameters
}

/**
 * Handles changes in campground ID or start date input fields.
 * Triggers a re-fetch of data and then re-applies filters.
 */
async function handleApiParamsChange() {
    currentCampgroundId = campgroundIdInput.value;
    // Ensure start date is always the 1st of the selected month, avoiding timezone issues.
    // By adding a time, we prevent JS from defaulting to UTC and shifting the date.
    const selectedDate = new Date(`${startDateInput.value}-01T12:00:00`);
    currentStartDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    // Fetch and display initial data
    const data = await fetchCombinedData(currentCampgroundId, currentStartDate);
    if (data && data.campsites) {
        originalCampsites = data.campsites; // Store the original data
        populateTypeFilter(originalCampsites); // Populate type filter based on new data
        applyFilters(); // Apply initial filters (which means display all initially)
    } else {
        // If data fetch failed, ensure both sections show no data message
        spGroupSitesDisplay.innerHTML = '<p class="text-gray-600 w-full text-center">Failed to load data.</p>';
        otherCampsitesDisplay.innerHTML = '<p class="text-gray-600 w-full text-center">Failed to load data.</p>';
        globalNoticesDiv.classList.add('hidden');
    }
}

// Event Listeners for filters
campgroundIdInput.addEventListener('change', handleApiParamsChange);
startDateInput.addEventListener('change', handleApiParamsChange);
typeFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);
waterfrontFilter.addEventListener('change', applyFilters);
// Drag-to-select for days of the week
let isDragging = false;
let startDay = -1;

daysOfWeekFilter.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('day-box')) {
        isDragging = true;
        const day = parseInt(e.target.dataset.day, 10);
        startDay = day;
        
        // Clear previous selection if not holding shift
        if (!e.shiftKey) {
            daysOfWeekFilter.querySelectorAll('.day-box').forEach(box => box.classList.remove('selected'));
        }
        
        e.target.classList.toggle('selected');
        e.preventDefault(); // Prevent text selection
    }
});

daysOfWeekFilter.addEventListener('mouseover', (e) => {
    if (isDragging && e.target.classList.contains('day-box')) {
        const currentDay = parseInt(e.target.dataset.day, 10);
        const dayBoxes = Array.from(daysOfWeekFilter.querySelectorAll('.day-box'));
        const startIndex = dayBoxes.findIndex(box => parseInt(box.dataset.day, 10) === startDay);
        const currentIndex = dayBoxes.findIndex(box => parseInt(box.dataset.day, 10) === currentDay);

        // Clear selection before reapplying
        dayBoxes.forEach(box => box.classList.remove('selected'));

        const min = Math.min(startIndex, currentIndex);
        const max = Math.max(startIndex, currentIndex);

        for (let i = min; i <= max; i++) {
            dayBoxes[i].classList.add('selected');
        }
    }
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        startDay = -1;
        applyFilters();
    }
});
resetFiltersButton.addEventListener('click', resetFilters);

// Initial load logic
window.onload = async function() {
    // Set default values for inputs on load
    campgroundIdInput.value = currentCampgroundId;
    // Format currentStartDate to YYYY-MM for the month input
    startDateInput.value = `${currentStartDate.getFullYear()}-${(currentStartDate.getMonth() + 1).toString().padStart(2, '0')}`;

    await handleApiParamsChange(); // Trigger initial data fetch and display
};