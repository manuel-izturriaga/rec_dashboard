document.addEventListener('DOMContentLoaded', () => {
    const FACILITIES_URL = 'data/Facilities_API_v1.json';
    const ADDRESSES_URL = 'data/FacilityAddresses_API_v1.json';
    const tableBody = document.getElementById('campgrounds-table-body');
    const stateFilter = document.getElementById('state-filter');
    const searchBar = document.getElementById('search-bar');
    const campgroundCount = document.getElementById('campground-count');
    let campgrounds = [];

    Promise.all([
        fetch(FACILITIES_URL).then(response => response.json()),
        fetch(ADDRESSES_URL).then(response => response.json())
    ])
    .then(([facilitiesData, addressesData]) => {
        if (facilitiesData.RECDATA && facilitiesData.RECDATA.length > 0) {
            campgrounds = mergeData(facilitiesData.RECDATA, addressesData.RECDATA);
            populateStateFilter();
            renderTable(campgrounds);
            console.log(`Loaded and merged ${campgrounds.length} campgrounds.`);
        } else {
            console.warn('No campgrounds found in the API response.');
            campgroundCount.textContent = '0 campgrounds found.';
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">No campgrounds found.</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching or processing data:', error);
        campgroundCount.textContent = 'Could not retrieve campgrounds.';
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Error loading data.</td></tr>';
    });

    function mergeData(facilities, addresses) {
        const addressMap = new Map(addresses.map(addr => [addr.FacilityID, addr]));
        return facilities.map(facility => {
            const address = addressMap.get(facility.FacilityID);
            return { ...facility, ...address };
        });
    }

    function populateStateFilter() {
        const states = [...new Set(campgrounds.map(c => c.AddressStateCode).filter(Boolean))].sort();
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    }

    function renderTable(data) {
        campgroundCount.textContent = `${data.length} campgrounds found.`;
        let html = '';
        if (data.length > 0) {
            data.forEach(campground => {
                html += `
                    <tr class="border-b">
                        <td class="py-3 px-4">${campground.FacilityName}</td>
                        <td class="py-3 px-4">${campground.City || 'N/A'}</td>
                        <td class="py-3 px-4">${campground.AddressStateCode || 'N/A'}</td>
                        <td class="py-3 px-4">${campground.FacilityTypeDescription}</td>
                        <td class="py-3 px-4">${campground.Reservable ? 'Yes' : 'No'}</td>
                    </tr>
                `;
            });
        } else {
            html = '<tr><td colspan="5" class="text-center py-4">No campgrounds match your criteria.</td></tr>';
        }
        tableBody.innerHTML = html;
    }

    function filterAndRender() {
        const state = stateFilter.value;
        const searchTerm = searchBar.value.toLowerCase();
        
        const filteredData = campgrounds.filter(campground => {
            const inState = !state || campground.AddressStateCode === state;
            const matchesSearch = !searchTerm || (campground.FacilityName && campground.FacilityName.toLowerCase().includes(searchTerm));
            return inState && matchesSearch;
        });

        renderTable(filteredData);
    }

    stateFilter.addEventListener('change', filterAndRender);
    searchBar.addEventListener('input', filterAndRender);
});
