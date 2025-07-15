import { fetchCombinedData } from './api.js';
import { displayCampsites, createInteractiveCalendar, createMonthSelectorView, isWaterfront } from './ui.js';

// DOM elements
const campgroundSelect = document.getElementById('campground-select');
const dateRangeDisplay = document.getElementById('date-range-display');
const typeFilter = document.getElementById('type-filter');
const drivewayFilter = document.getElementById('driveway-filter');
const waterfrontFilter = document.getElementById('waterfront-filter');
const currentWeekFilter = document.getElementById('current-week-filter');
const daysOfWeekFilter = document.getElementById('days-of-week-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const spGroupSitesDisplay = document.getElementById('sp-group-sites-display');
const otherCampsitesDisplay = document.getElementById('other-campsites-display');
const globalNoticesDiv = document.getElementById('global-notices');
const applyDaysFilterButton = document.getElementById('apply-days-filter');
const calendarModal = document.getElementById('calendar-modal');

// Global data stores
let originalCampsites = [];
let currentCampgroundId = '232702'; // Default campground ID
let currentStartDate = new Date(); // Default to current month
currentStartDate.setDate(1); // Set to first day of the month

let selectionStart = null;
let selectionEnd = null;
let calendarDate = new Date();

function openCalendarModal() {
    calendarModal.innerHTML = createInteractiveCalendar(calendarDate, { start: selectionStart, end: selectionEnd });
    calendarModal.classList.remove('modal-hidden');

    // Add event listeners for the modal buttons
    document.getElementById('cancel-calendar-btn').addEventListener('click', closeCalendarModal);
    document.getElementById('clear-calendar-btn').addEventListener('click', () => {
        selectionStart = null;
        selectionEnd = null;
        openCalendarModal();
    });
    document.getElementById('apply-calendar-btn').addEventListener('click', () => {
        if (selectionStart) {
            const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
            let dateStr = selectionStart.toLocaleDateString('en-US', options);
            if (selectionEnd) {
                dateStr += ` - ${selectionEnd.toLocaleDateString('en-US', options)}`;
            }
            dateRangeDisplay.value = dateStr;
            applyFilters();
            closeCalendarModal();
        }
    });
    document.getElementById('prev-month-btn').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        openCalendarModal();
    });
    document.getElementById('next-month-btn').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        openCalendarModal();
    });
    document.querySelector('.calendar-grid').addEventListener('click', handleDayClick);
    document.getElementById('calendar-month-year').addEventListener('click', showMonthSelector);
}

function closeCalendarModal() {
    calendarModal.classList.add('modal-hidden');
    calendarModal.innerHTML = '';

    // Clean up event listeners
}

function handleDayClick(e) {
    const dayElement = e.target.closest('.calendar-day');
    if (!dayElement || dayElement.classList.contains('empty')) {
        return; // Clicked on grid gap or empty day
    }

    const clickedDateStr = dayElement.dataset.date;
    const clickedDate = new Date(clickedDateStr + 'T00:00:00Z');

    if (!selectionStart || (selectionStart && selectionEnd)) {
        // Start a new selection
        selectionStart = clickedDate;
        selectionEnd = null;
    } else {
        // Complete the selection
        if (clickedDate < selectionStart) {
            selectionEnd = selectionStart;
            selectionStart = clickedDate;
        } else {
            selectionEnd = clickedDate;
        }
    }

    // Re-render the calendar to show the selection
    openCalendarModal();
}

function showMonthSelector() {
    calendarModal.innerHTML = createMonthSelectorView(calendarDate.getFullYear());
    document.querySelector('.month-selector-grid').addEventListener('click', handleMonthClick);
    document.getElementById('prev-year-btn').addEventListener('click', () => {
        calendarDate.setFullYear(calendarDate.getFullYear() - 1);
        showMonthSelector();
    });
    document.getElementById('next-year-btn').addEventListener('click', () => {
        calendarDate.setFullYear(calendarDate.getFullYear() + 1);
        showMonthSelector();
    });
}

function handleMonthClick(e) {
    const monthElement = e.target.closest('.month-selector-month');
    if (!monthElement) {
        return;
    }
    const month = parseInt(monthElement.dataset.month, 10);
    calendarDate.setMonth(month);
    openCalendarModal();
}

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
 * Populates the Driveway filter dropdown with unique driveway types.
 * @param {Array} campsites - The array of campsite objects.
 */
function populateDrivewayFilter(campsites) {
    const uniqueDriveways = new Set();
    campsites.forEach(campsite => {
        if (Array.isArray(campsite.attributes)) {
            const drivewayAttribute = campsite.attributes.find(attr => attr.attribute_name === 'Driveway Entry');
            if (drivewayAttribute) {
                uniqueDriveways.add(drivewayAttribute.attribute_value);
            }
        }
    });

    // Clear existing options except "All Driveways"
    drivewayFilter.innerHTML = '<option value="all">All Driveways</option>';

    // Add unique driveways
    Array.from(uniqueDriveways).sort().forEach(driveway => {
        const option = document.createElement('option');
        option.value = driveway;
        option.textContent = driveway;
        drivewayFilter.appendChild(option);
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
 * Checks if a campsite has availability for a specified date range.
 * @param {object} campsite - The campsite object.
 * @param {string} startDateStr - The start date of the range (YYYY-MM-DD).
 * @param {string} endDateStr - The end date of the range (YYYY-MM-DD).
 * @returns {boolean} - True if the campsite is available for the entire range, false otherwise.
 */
function hasAvailabilityForRange(campsite, startDateStr, endDateStr) {
    const start = new Date(startDateStr + 'T00:00:00Z');
    const end = new Date(endDateStr + 'T00:00:00Z');
    let currentDate = new Date(start);

    while (currentDate <= end) {
        const isoDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';
        if (campsite.availability[isoDate] !== 'Available') {
            return false;
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return true;
}

/**
 * Applies filters to the original campsite data and updates the display.
 */
function applyFilters() {
    const selectedType = typeFilter.value;
    const selectedDriveway = drivewayFilter.value;
    const isWaterfrontChecked = waterfrontFilter.checked;
    const isCurrentWeekChecked = currentWeekFilter.checked;
    // Get selected day numbers from the multi-select (0 for Sun, 1 for Mon, etc.)
    const selectedDays = Array.from(daysOfWeekFilter.querySelectorAll('.day-box.selected')).map(box => parseInt(box.dataset.day, 10));

    // Date range values will now come from a state variable, not inputs.
    const startDate = selectionStart ? selectionStart.toISOString().split('T')[0] : '';
    const endDate = selectionEnd ? selectionEnd.toISOString().split('T')[0] : '';

    const filteredCampsites = originalCampsites.filter(campsite => {
        // Status filter
        if (campsite.campsite_status !== "Open") {
            return false;
        }
        // Combined availability filter for current week and selected days
        if (isCurrentWeekChecked) {
            const today = new Date();
            const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

            // Consistent Monday-first week calculation in UTC
            const day = todayUTC.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            const offset = (day === 0) ? 6 : day - 1;
            const firstDayOfWeek = new Date(todayUTC);
            firstDayOfWeek.setUTCDate(todayUTC.getUTCDate() - offset);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);

            let availableInWeek = false;
            for (const dateStr in campsite.availability) {
                const availableDate = new Date(dateStr); // dateStr is already UTC
                if (availableDate >= firstDayOfWeek && availableDate <= lastDayOfWeek && campsite.availability[dateStr] === 'Available') {
                    // If days are selected, check if this available day is one of them
                    if (selectedDays.length > 0) {
                        if (selectedDays.includes(availableDate.getUTCDay())) {
                            availableInWeek = true;
                            break; // Found a match, no need to check further
                        }
                    } else {
                        // If no days are selected, any availability in the week is a match
                        availableInWeek = true;
                        break;
                    }
                }
            }
            if (!availableInWeek) {
                return false; // Filter out if no matching availability in the current week
            }
        } else {
            // If current week is not checked, use the original month-based day filter
            if (selectedDays.length === 1) {
                if (!hasDayAvailability(campsite, selectedDays[0], currentStartDate)) {
                    return false;
                }
            } else if (selectedDays.length >= 2) {
                if (!hasConsecutiveAvailability(campsite, selectedDays, currentStartDate)) {
                    return false;
                }
            }
        }

        // Date Range Filter
        if (startDate && endDate) {
            if (!hasAvailabilityForRange(campsite, startDate, endDate)) {
                return false;
            }
        }

        // Type filter
        if (selectedType !== 'all' && campsite.type !== selectedType) {
            return false;
        }

        // Driveway filter
        if (selectedDriveway !== 'all') {
            const drivewayAttribute = campsite.attributes.find(attr => attr.attribute_name === 'Driveway Entry');
            if (!drivewayAttribute || drivewayAttribute.attribute_value !== selectedDriveway) {
                return false;
            }
        }

        // Waterfront filter
        if (isWaterfrontChecked) {
            if (!isWaterfront(campsite)) {
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
    drivewayFilter.value = 'all';
    waterfrontFilter.checked = false;
    currentWeekFilter.checked = false;
    // Clear all selected options in the days of week filter
    Array.from(daysOfWeekFilter.querySelectorAll('.day-box')).forEach(box => {
        box.classList.remove('selected');
    });
    // Reset campground ID and month to initial defaults
    campgroundSelect.value = '232702';
    currentCampgroundId = '232702';
    applyDaysFilterButton.disabled = true; // Add this line
    dateRangeDisplay.value = '';
    selectionStart = null;
    selectionEnd = null;
    currentStartDate = new Date();
    currentStartDate.setDate(1);

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
    // This logic is now obsolete. The `currentStartDate` will be managed by the new calendar modal state.
    // For now, the initial value set at the top of the file will be used for the first load.

    // Fetch and display initial data
    const data = await fetchCombinedData(currentCampgroundId, currentStartDate);
    if (data && data.campsites) {
        originalCampsites = data.campsites; // Store the original data
        populateTypeFilter(originalCampsites); // Populate type filter based on new data
        populateDrivewayFilter(originalCampsites); // Populate driveway filter
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
// The 'change' event on the old month input is no longer needed.
typeFilter.addEventListener('change', applyFilters);
drivewayFilter.addEventListener('change', applyFilters);
waterfrontFilter.addEventListener('change', applyFilters);
currentWeekFilter.addEventListener('change', applyFilters);
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

// All old date range picker logic is removed.
// This will be replaced by the new calendar modal logic in Phase 2.

// Initial load logic
window.onload = async function() {
    // Set default values for inputs on load
    campgroundSelect.value = currentCampgroundId;
    // Format currentStartDate to YYYY-MM for the month input
    // The date range display is now a placeholder, it will be updated by the modal
    dateRangeDisplay.placeholder = "Select a date range";

    await handleApiParamsChange(); // Trigger initial data fetch and display

    // Set the Type filter to "Standard Electric"
    typeFilter.value = "Standard Electric";
    applyFilters();
};
// Sticky filter section logic
const filterSection = document.getElementById('filter-section');
const cardsWrapper = document.querySelector('.cards-wrapper');
let filterSectionOffsetTop = filterSection.offsetTop;

window.addEventListener('scroll', () => {
    if (window.scrollY >= filterSectionOffsetTop) {
        if (!filterSection.classList.contains('sticky')) {
            const filterHeight = filterSection.offsetHeight;
            filterSection.classList.add('sticky');
            cardsWrapper.style.paddingTop = `${filterHeight}px`;
        }
    } else {
        if (filterSection.classList.contains('sticky')) {
            filterSection.classList.remove('sticky');
            cardsWrapper.style.paddingTop = '0';
        }
    }
});

// Recalculate offset on window resize
window.addEventListener('resize', () => {
    // Temporarily remove sticky to get correct offset
    const isSticky = filterSection.classList.contains('sticky');
    if (isSticky) {
        filterSection.classList.remove('sticky');
        cardsWrapper.style.paddingTop = '0';
    }
    
    filterSectionOffsetTop = filterSection.offsetTop;

    // Re-apply if it was sticky before
    if (isSticky) {
        filterSection.classList.add('sticky');
        const filterHeight = filterSection.offsetHeight;
        cardsWrapper.style.paddingTop = `${filterHeight}px`;
    }
});
dateRangeDisplay.addEventListener('click', openCalendarModal);