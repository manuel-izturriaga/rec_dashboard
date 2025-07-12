import { fetchCombinedData } from './api.js';
import { displayCampsites } from './ui.js';

// DOM elements
const campgroundSelect = document.getElementById('campground-select');
const startDateInput = document.getElementById('start-date-input');
const typeFilter = document.getElementById('type-filter');
const statusFilter = document.getElementById('status-filter');
const waterfrontFilter = document.getElementById('waterfront-filter');
const daysOfWeekFilter = document.getElementById('days-of-week-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const spGroupSitesDisplay = document.getElementById('sp-group-sites-display');
const otherCampsitesDisplay = document.getElementById('other-campsites-display');
const globalNoticesDiv = document.getElementById('global-notices');
const applyDaysFilterButton = document.getElementById('apply-days-filter');

// Global data stores
let originalCampsites = [];
let currentCampgroundId = '232702'; // Default campground ID
let currentStartDate = new Date(); // Default to current month
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
 * Checks if a campsite has availability on a specific day of the week within a given month.
 * @param {object} campsite - The campsite object.
 * @param {number} selectedDay - The selected day of the week (0-6, where 0 is Sunday).
 * @param {Date} startDate - The start date for the search month.
 * @returns {boolean} - True if availability is found for that day, false otherwise.
 */
function hasDayAvailability(campsite, selectedDay, startDate) {
    const availability = campsite.availability;

    if (!availability || Object.keys(availability).length === 0) {
        return false;
    }

    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, month, day));
        const dayOfWeek = currentDate.getUTCDay();

        if (dayOfWeek === selectedDay) {
            const isoDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';
            if (availability[isoDate] === "Available") {
                return true;
            }
        }
    }

    return false;
}

/**
 * Checks if a campsite has consecutive availability for the selected days of the week.
 * @param {object} campsite - The campsite object.
 * @param {number[]} selectedDays - An array of selected day numbers (0-6).
 * @param {Date} startDate - The start date for the search month.
 * @returns {boolean} - True if consecutive availability is found, false otherwise.
 */
function hasConsecutiveAvailability(campsite, selectedDays, startDate) {
    if (selectedDays.length < 2) {
        return true;
    }

    const sortedDays = [...selectedDays].sort((a, b) => a - b);
    const availability = campsite.availability;

    if (!availability || Object.keys(availability).length === 0) {
        return false;
    }

    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, month, day));
        const dayOfWeek = currentDate.getUTCDay();

        if (dayOfWeek === sortedDays[0]) {
            let isSequenceValid = true;
            for (let i = 0; i < sortedDays.length; i++) {
                const dayOffset = (sortedDays[i] - sortedDays[0] + 7) % 7;
                const checkDate = new Date(currentDate);
                checkDate.setUTCDate(currentDate.getUTCDate() + dayOffset);

                if (checkDate.getUTCMonth() !== month) {
                    isSequenceValid = false;
                    break;
                }

                // Corrected the date format to remove milliseconds
                const isoDate = checkDate.toISOString().split('T')[0] + 'T00:00:00Z';

                if (availability[isoDate] !== "Available") {
                    isSequenceValid = false;
                    break;
                }
            }

            if (isSequenceValid) {
                return true;
            }
        }
    }

    return false;
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
        // day of week filter
        if (selectedDays.length === 1) {
            if (!hasDayAvailability(campsite, selectedDays[0], currentStartDate)) {
                return false;
            }
        } else if (selectedDays.length >= 2) {
            if (!hasConsecutiveAvailability(campsite, selectedDays, currentStartDate)) {
                return false;
            }
        }

        // Type filter
        if (selectedType !== 'all' && campsite.type !== selectedType) {
            return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && campsite.campsite_status !== selectedStatus) {
            return false;
        }

        // Waterfront filter with conditional logic based on campground name
        if (isWaterfrontChecked) {
            const siteNumber = parseInt(campsite.name, 10);
            if (isNaN(siteNumber)) return false; // Not a numbered site, filter it out

            const selectedCampgroundName = campgroundSelect.options[campgroundSelect.selectedIndex].text;

            if (selectedCampgroundName === "Anderson Road") {
                if (siteNumber < 1 || siteNumber > 9) {
                    return false;
                }
            } else if (selectedCampgroundName === "Seven Points") {
                if (siteNumber < 11 || siteNumber > 35 || siteNumber % 2 === 0) {
                    return false;
                }
            } else {
                // If waterfront is checked for a campground without special rules, filter out all sites.
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
    campgroundSelect.value = '232702';
    currentCampgroundId = '232702';
    applyDaysFilterButton.disabled = true; // Add this line
    currentStartDate = new Date();
    currentStartDate.setDate(1);
    startDateInput.value = `${currentStartDate.getFullYear()}-${(currentStartDate.getMonth() + 1).toString().padStart(2, '0')}`;

    handleApiParamsChange(); // Re-fetch data with reset parameters
}

/**
 * Handles changes in campground ID or start date input fields.
 * Triggers a re-fetch of data and then re-applies filters.
 */
async function handleApiParamsChange() {
    currentCampgroundId = campgroundSelect.value;
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
campgroundSelect.addEventListener('change', handleApiParamsChange);
startDateInput.addEventListener('change', handleApiParamsChange);
typeFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);
waterfrontFilter.addEventListener('change', applyFilters);
// Click-to-select for days of the week, with shift-click for range selection
let lastClickedDay = -1;

daysOfWeekFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('day-box')) {
        e.preventDefault();
        const dayBoxes = Array.from(daysOfWeekFilter.querySelectorAll('.day-box'));
        const currentDayBox = e.target;
        const currentDay = parseInt(currentDayBox.dataset.day, 10);

        if (e.shiftKey && lastClickedDay !== -1) {
            // Range selection
            const lastIndex = dayBoxes.findIndex(box => parseInt(box.dataset.day, 10) === lastClickedDay);
            const currentIndex = dayBoxes.findIndex(box => box === currentDayBox);

            const min = Math.min(lastIndex, currentIndex);
            const max = Math.max(lastIndex, currentIndex);

            for (let i = min; i <= max; i++) {
                dayBoxes[i].classList.add('selected');
            }
        } else {
            // Single day toggle
            currentDayBox.classList.toggle('selected');
        }

        // Update last clicked day for shift-click
        if (currentDayBox.classList.contains('selected')) {
            lastClickedDay = currentDay;
        } else {
            // If a day was just deselected, the concept of a "range from here" is gone.
            const selectedBoxes = dayBoxes.filter(box => box.classList.contains('selected'));
            if (selectedBoxes.length > 0) {
                // set last clicked to the last selected day
                lastClickedDay = parseInt(selectedBoxes[selectedBoxes.length - 1].dataset.day, 10);
            } else {
                lastClickedDay = -1;
            }
        }

        const anySelected = daysOfWeekFilter.querySelector('.day-box.selected');
        applyDaysFilterButton.disabled = !anySelected;
    }
});

applyDaysFilterButton.addEventListener('click', () => {
    applyFilters();
    applyDaysFilterButton.disabled = true; // Disable after applying
});
resetFiltersButton.addEventListener('click', resetFilters);

// Initial load logic
window.onload = async function() {
    // Set default values for inputs on load
    campgroundSelect.value = currentCampgroundId;
    // Format currentStartDate to YYYY-MM for the month input
    startDateInput.value = `${currentStartDate.getFullYear()}-${(currentStartDate.getMonth() + 1).toString().padStart(2, '0')}`;

    await handleApiParamsChange(); // Trigger initial data fetch and display
};