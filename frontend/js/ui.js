/**
 * Helper function to find an attribute value by name from the attributes array.
 * @param {Array} attributes - The array of attribute objects.
 * @param {string} name - The name of the attribute to find.
 * @returns {string} The attribute value or 'N/A' if not found.
 */
function getAttributeValue(attributes, name) {
    const attribute = attributes.find(attr => attr.attribute_name === name);
    return attribute ? attribute.attribute_value : 'N/A';
}

/**
 * Generates star emojis based on a rating.
 * @param {number} rating - The numerical rating (e.g., 4.5).
 * @returns {string} HTML string of star emojis.
 */
function getStarRating(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) return '';
    const fullStars = '⭐'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '🌟' : ''; // Using a different emoji for half star
    return `<span class="rating-stars">${fullStars}${halfStar}</span>`;
}

/**
 * Determines if a campsite should be categorized as an "SP/Group Site".
 * This logic is a heuristic based on common naming conventions.
 * You may need to adjust this based on the actual data from your API.
 * @param {Object} campsite - The campsite object.
 * @returns {boolean} True if it's an SP/Group site, false otherwise.
 */
function isGroupSite(campsite) {
    const type = campsite.type ? campsite.type.toUpperCase() : '';
    const name = campsite.name ? campsite.name.toUpperCase() : '';
    const reserveType = campsite.campsite_reserve_type ? campsite.campsite_reserve_type.toUpperCase() : '';

    // Common indicators for group sites or special sites
    return type.includes('GROUP') || type.includes('SP') ||
           name.includes('GROUP') || name.includes('SP') ||
           reserveType.includes('GROUP');
}

export function isWaterfront(campsite) {
    const siteNumber = parseInt(campsite.name, 10);
    if (isNaN(siteNumber)) return false;

    // This logic is based on the currently selected campground, which is not ideal.
    // A better approach would be to have this information as part of the campsite data itself.
    // For now, we'll keep the logic as it was in main.js
    const campgroundSelect = document.getElementById('campground-select');
    const selectedCampgroundName = campgroundSelect.options[campgroundSelect.selectedIndex].text;

    if (selectedCampgroundName === "Anderson Road") {
        return siteNumber >= 1 && siteNumber <= 9;
    } else if (selectedCampgroundName === "Seven Points") {
        return siteNumber >= 11 && siteNumber <= 35 && siteNumber % 2 !== 0;
    }
    return false;
}

function generateCalendarGrid(startDate, availability, selectedDays, isCurrentWeek) {
    let html = '<div class="daily-availability">';
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Consistent Monday-first week calculation in UTC
    const day = todayUTC.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const offset = (day === 0) ? 6 : day - 1;
    const firstDayOfWeek = new Date(todayUTC);
    firstDayOfWeek.setUTCDate(todayUTC.getUTCDate() - offset);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);


    // Add headers for days of the week
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayHeaders.forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });

    // Calculate the starting day of the week (0 for Sunday, 6 for Saturday)
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
    // Adjust to make Monday the first day of the week (Monday=0, Sunday=6)
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    // Add empty cells for padding at the beginning of the month
    for (let i = 0; i < startOffset; i++) {
        html += '<div class="day-cell empty-day"></div>';
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(Date.UTC(year, month, i));
        const dayOfWeek = (currentDate.getUTCDay() === 0) ? 6 : currentDate.getUTCDay() - 1; // Monday=0
        const isPastDay = currentDate < todayUTC;

        let dayClass = '';
        if (isCurrentWeek) {
            if (currentDate >= firstDayOfWeek && currentDate <= lastDayOfWeek) {
               // dayClass = 'current-week-day';
            } else {
                dayClass = 'other-week-day';
            }
        }


        if (selectedDays.length === 0 || selectedDays.includes(currentDate.getUTCDay())) {
            const isoDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';
            const dailyStatus = availability && availability[isoDate] ? availability[isoDate] : 'Unknown';

            let statusClass = '';
            let statusText = '';


            switch (dailyStatus) {
                case 'Available':
                    statusClass = 'bg-green-700 text-white';
                    statusText = 'A';
                    break;
                case 'Not Available':
                case 'Reserved':
                    statusClass = 'bg-red-700 text-white';
                    statusText = 'X';
                    break;
                default:
                    statusClass = 'bg-gray-700 text-gray-400';
                    statusText = '?';
                    break;
            }

            const pastDayClass = isPastDay ? 'past-day' : '';

            html += `
                <div class="day-cell ${statusClass} ${pastDayClass} ${dayClass}" title="${dailyStatus}">
                    <span class="day-num">${i}</span>
                    <span class="day-status">${statusText}</span>
                </div>`;
        } else {
            // If the day is filtered out, show it as an empty cell
            html += `<div class="day-cell empty-day ${dayClass}" title="Filtered out"><span class="day-num">${i}</span></div>`;
        }
    }

    // Add empty cells to fill the rest of the grid (total 35 cells for 5 weeks)
    const totalCells = startOffset + daysInMonth;
    const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    const finalCells = (totalCells + remainingCells) > 35 ? 42 : 35; // Use 6 weeks if needed

    for (let i = 0; i < finalCells - totalCells; i++) {
        html += '<div class="day-cell empty-day"></div>';
    }

    html += '</div>';
    return html;
}


/**
 * Creates an HTML element for a single campsite card.
 * @param {Object} campsite - The campsite object.
 * @param {Date} currentStartDate - The start date for the availability calendar.
 * @param {Array} selectedDays - Array of numbers representing selected days of the week (0-6).
 * @returns {HTMLElement} The campsite card element.
 */
export function createInteractiveCalendar(date, selection = {}) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'long' });

    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <i id="prev-month-btn" class="calendar-nav-icon"><</i>
                <h3 id="calendar-month-year">${monthName} ${year}</h3>
                <i id="search-month-btn" class="calendar-nav-icon">&#x1F50D;</i> <!-- Magnifying glass icon -->
                <i id="next-month-btn" class="calendar-nav-icon">></i>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                <div class="calendar-day-header">Sun</div>
    `;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Monday is 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(Date.UTC(year, month, i));
        const dateStr = currentDate.toISOString().split('T')[0];
        let dayClass = '';

        if (selection.start) {
            const startDate = new Date(selection.start.getTime());
            const endDate = selection.end ? new Date(selection.end.getTime()) : null;

            if (currentDate.getTime() === startDate.getTime() && !endDate) {
                dayClass = 'selected';
            } else if (endDate && currentDate.getTime() === startDate.getTime()) {
                dayClass = 'selected range-start';
            } else if (endDate && currentDate.getTime() === endDate.getTime()) {
                dayClass = 'selected range-end';
            } else if (endDate && currentDate > startDate && currentDate < endDate) {
                dayClass = 'in-range';
            }
        }

        html += `<div class="calendar-day ${dayClass}" data-date="${dateStr}">${i}</div>`;
    }

    html += `
            </div>
            <div class="calendar-footer">
                <button id="cancel-calendar-btn">Cancel</button>
                <button id="clear-calendar-btn">Clear</button>
                <button id="apply-calendar-btn" ${!selection.start ? 'disabled' : ''}>Apply</button>
            </div>
        </div>
    `;
    return html;
}

export function createMonthSelectorView(year) {
    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <button id="prev-year-btn"><</button>
                <h3 id="calendar-year">${year}</h3>
                <button id="next-year-btn">></button>
            </div>
            <div class="month-selector-grid">
    `;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((month, index) => {
        html += `<div class="month-selector-month" data-month="${index}">${month}</div>`;
    });

    html += `
            </div>
        </div>
    `;
    return html;
}

export function createCampsiteCard(campsite, currentStartDate, selectedDays = [], isCurrentWeek, index = -1) {
    const card = document.createElement('a');
    card.classList.add('campsite-card');
    card.href = `https://www.recreation.gov/camping/campsites/${campsite.campsite_id}`;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const isWaterfrontSite = isWaterfront(campsite);
    if (isWaterfrontSite) {
        card.classList.add('waterfront');
    }

    // Extract common attributes using the helper function
    const electricHookup = getAttributeValue(campsite.attributes, 'Electric Hookup');
    const waterHookup = getAttributeValue(campsite.attributes, 'Water Hookup');
    const checkinTime = getAttributeValue(campsite.attributes, 'Checkin Time');
    const checkoutTime = getAttributeValue(campsite.attributes, 'Checkout Time');
    const siteLength = getAttributeValue(campsite.attributes, 'Site Length');
    const maxVehicleLength = getAttributeValue(campsite.attributes, 'Max Vehicle Length');
    const drivewaySurface = getAttributeValue(campsite.attributes, 'Driveway Surface');
    const drivewayEntry = getAttributeValue(campsite.attributes, 'Driveway Entry');
    const accessible = campsite.accessible === 'true' ? 'Yes' : 'No';

    // Collect amenities from the 'amenities' category in attributes
    const amenities = campsite.attributes
        .filter(attr => attr.attribute_category === 'amenities' && attr.attribute_value === 'Y')
        .map(attr => attr.attribute_name.replace(' Hookup', '')); // Clean up name for display

    // Add other relevant attributes as amenities if they are 'Yes'
    if (getAttributeValue(campsite.attributes, 'Campfire Allowed') === 'Yes') amenities.push('Campfire');
    if (getAttributeValue(campsite.attributes, 'Shade') === 'Yes') amenities.push('Shade');
    if (getAttributeValue(campsite.attributes, 'Pets Allowed') === 'Yes') amenities.push('Pets Allowed');
    if (accessible === 'Yes') amenities.push('Accessible');

    // --- Availability Display Logic ---
    const availabilityHtml = generateCalendarGrid(currentStartDate, campsite.availability, selectedDays, isCurrentWeek);
    // --- End Availability Display Logic ---

    const headerClass = isWaterfrontSite ? 'card-header waterfront-header' : 'card-header';
    const headerContent = `<h2>${isWaterfrontSite ? '🌊 ' : ''}${campsite.name || 'Campsite'}</h2>`;

    card.innerHTML = `
        <div class="type-badge">${campsite.type ? campsite.type.split(' ')[0].toUpperCase() : 'UNKNOWN'}</div>
        <div class="${headerClass}">
            ${headerContent}
            <span class="campsite-id">ID: ${campsite.campsite_id || 'N/A'}</span>
        </div>

        ${campsite.preview_image_url ? `<img src="${campsite.preview_image_url}" alt="Campsite Image" class="campsite-image" onerror="this.onerror=null;this.src='https://placehold.co/700x140/2d3748/a0aec0?text=Image+Not+Available';">` : `<img src="https://placehold.co/700x140/2d3748/a0aec0?text=Image+Not+Available" alt="Placeholder Image" class="campsite-image">`}
        
        <div class="card-meta">
            <p><strong>Status:</strong> <span class="status-indicator ${campsite.campsite_status === 'Open' ? 'status-open' : 'status-closed'}">${campsite.campsite_status || 'N/A'}</span></p>
            <p class="rating-display">
                ${getStarRating(campsite.average_rating)} 
                <strong>${campsite.average_rating ? campsite.average_rating.toFixed(1) : 'N/A'}</strong> (${campsite.number_of_ratings || 0})
            </p>
        </div>

        <div class="stats-section">
            <div class="stats-item">⚡️ <strong>Electric:</strong> ${electricHookup}</div>
            <div class="stats-item">💧 <strong>Water:</strong> ${waterHookup}</div>
            <div class="stats-item">📏 <strong>Site Length:</strong> ${siteLength} ft</div>
            <div class="stats-item">🚗 <strong>Max Vehicle:</strong> ${maxVehicleLength} ft</div>
            <div class="stats-item full-width">🛣️ <strong>Driveway:</strong> ${drivewaySurface} (${drivewayEntry})</div>
        </div>

        ${amenities.length > 0 ? `
            <div class="abilities-section">
                <h3>Features:</h3>
                <ul>
                    ${amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <p class="checkin-checkout">
            <span><strong>Check-in:</strong> ${checkinTime}</span>
            <span><strong>Check-out:</strong> ${checkoutTime}</span>
        </p>
        <p class="text-sm text-gray-400"><strong>Reservable:</strong> ${campsite.reservable ? 'Yes' : 'No'}</p>
        
        ${availabilityHtml}
    `;
    return card;
}

/**
 * Displays the campsite details in structured card formats and global notices.
 * @param {Array} campsitesToDisplay - The array of campsite objects to render.
 * @param {Date} currentStartDate - The start date for the availability calendar.
 * @param {Array} selectedDays - Array of numbers representing selected days of the week (0-6).
 */
export function displayCampsites(campsitesToDisplay, currentStartDate, selectedDays = []) {
    const spGroupSitesDisplay = document.getElementById('sp-group-sites-display');
    const otherCampsitesDisplay = document.getElementById('other-campsites-display');
    const isCurrentWeek = document.getElementById('current-week-filter').checked;
    const noticesList = document.getElementById('notices-list');
    const globalNoticesDiv = document.getElementById('global-notices');
    const SEWER_NOTICE = "Please note that there are no sewer hook ups at the campground.";

    spGroupSitesDisplay.innerHTML = ''; // Clear previous content
    otherCampsitesDisplay.innerHTML = ''; // Clear previous content
    noticesList.innerHTML = ''; // Clear previous notices

    const uniqueNotices = new Set(); // Use a Set to store unique notice texts

    let spGroupSitesFound = false;
    let otherCampsitesFound = false;

    if (campsitesToDisplay && Array.isArray(campsitesToDisplay) && campsitesToDisplay.length > 0) {
        campsitesToDisplay.forEach((campsite, index) => {
            // Filter notices for the global section (only SEWER_NOTICE)
            if (campsite.notices && campsite.notices.length > 0) {
                campsite.notices.forEach(notice => {
                    if (notice.text === SEWER_NOTICE) {
                        uniqueNotices.add(notice.text);
                    }
                });
            }

            const card = createCampsiteCard(campsite, currentStartDate, selectedDays, isCurrentWeek, index);

            if (isGroupSite(campsite)) {
                spGroupSitesDisplay.appendChild(card);
                spGroupSitesFound = true;
            } else {
                otherCampsitesDisplay.appendChild(card);
                otherCampsitesFound = true;
            }
        });

        // Populate global notices after processing all campsites
        if (uniqueNotices.size > 0) {
            uniqueNotices.forEach(noticeText => {
                const li = document.createElement('li');
                li.textContent = noticeText;
                noticesList.appendChild(li);
            });
            globalNoticesDiv.classList.remove('hidden'); // Show the global notices section
        } else {
            globalNoticesDiv.classList.add('hidden'); // Hide if no notices
        }

        // Display messages if no campsites found in a category
        if (!spGroupSitesFound) {
            spGroupSitesDisplay.innerHTML = '<p class="text-gray-600 w-full text-center">No SP/Group sites found matching filters.</p>';
        }
        if (!otherCampsitesFound) {
            otherCampsitesDisplay.innerHTML = '<p class="text-gray-600 w-full text-center">No other campsites found matching filters.</p>';
        }

    } else {
        // If no campsites are returned at all after filtering
        spGroupSitesDisplay.innerHTML = `
            <div class="message-box info w-full">
                <p>No campsites found matching the current filters.</p>
            </div>
        `;
        otherCampsitesDisplay.innerHTML = ''; // Clear any loading message from other section
        globalNoticesDiv.classList.add('hidden'); // Ensure notices are hidden if no data
    }
}
