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

/**
 * Creates an HTML element for a single campsite card.
 * @param {Object} campsite - The campsite object.
 * @param {Date} currentStartDate - The start date for the availability calendar.
 * @param {Array} selectedDays - Array of numbers representing selected days of the week (0-6).
 * @returns {HTMLElement} The campsite card element.
 */
export function createCampsiteCard(campsite, currentStartDate, selectedDays = []) {
    const card = document.createElement('div');
    card.classList.add('campsite-card');

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
    let availabilityHtml = '<div class="daily-availability">';
    const startDate = currentStartDate;
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < daysInMonth; i++) {
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 6 for Saturday
        const dayOfMonth = currentDate.getDate();
        const isoDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

        // Only show if selectedDays is empty (show all) OR if the current day of week is in selectedDays
        if (selectedDays.length === 0 || selectedDays.includes(dayOfWeek)) {
            const dailyStatus = campsite.availability && campsite.availability[isoDate] ? campsite.availability[isoDate] : 'Unknown';
            let statusClass = '';
            let statusText = '';

            switch (dailyStatus) {
                case 'Available':
                    statusClass = 'bg-green-700 text-white';
                    statusText = 'A'; // Available
                    break;
                case 'Not Available':
                case 'Reserved':
                    statusClass = 'bg-red-700 text-white';
                    statusText = 'X'; // Not Available / Reserved
                    break;
                default:
                    statusClass = 'bg-gray-700 text-gray-400';
                    statusText = '?'; // Unknown
                    break;
            }
            availabilityHtml += `
                <div class="day-cell ${statusClass} text-white">
                    <span class="day-num">${dayOfMonth}</span>
                    <span class="day-status">${statusText}</span>
                </div>
            `;
        }
    }
    availabilityHtml += '</div>';
    // --- End Availability Display Logic ---

    card.innerHTML = `
        <div class="type-badge">${campsite.type ? campsite.type.split(' ')[0].toUpperCase() : 'UNKNOWN'}</div>
        <div class="card-header">
            <h2>${campsite.name || 'Campsite'}</h2>
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
        campsitesToDisplay.forEach(campsite => {
            // Filter notices for the global section (only SEWER_NOTICE)
            if (campsite.notices && campsite.notices.length > 0) {
                campsite.notices.forEach(notice => {
                    if (notice.text === SEWER_NOTICE) {
                        uniqueNotices.add(notice.text);
                    }
                });
            }

            const card = createCampsiteCard(campsite, currentStartDate, selectedDays);

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