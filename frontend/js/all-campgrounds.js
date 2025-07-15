document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://www.recreation.gov/api/search?exact=false&fg=camping&start=0&size=50000';
    const tableBody = document.getElementById('campgrounds-table-body');
    const stateFilter = document.getElementById('state-filter');
    const searchBar = document.getElementById('search-bar');
    let campgrounds = [];

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                campgrounds = data.results;
                populateStateFilter();
                renderTable(campgrounds);
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">No campgrounds found.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching campgrounds:', error);
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Error loading data.</td></tr>';
        });

    function populateStateFilter() {
        const states = [...new Set(campgrounds.map(c => c.state_code))].sort();
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    }

    function renderTable(data) {
        let html = '';
        if (data.length > 0) {
            data.forEach(campground => {
                html += `
                    <tr class="border-b">
                        <td class="py-3 px-4">${campground.name}</td>
                        <td class="py-3 px-4">${campground.city || 'N/A'}</td>
                        <td class="py-3 px-4">${campground.state_code}</td>
                        <td class="py-3 px-4">${campground.entity_type}</td>
                        <td class="py-3 px-4">${campground.reservable ? 'Yes' : 'No'}</td>
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
            const inState = !state || campground.state_code === state;
            const matchesSearch = !searchTerm || campground.name.toLowerCase().includes(searchTerm);
            return inState && matchesSearch;
        });

        renderTable(filteredData);
    }

    stateFilter.addEventListener('change', filterAndRender);
    searchBar.addEventListener('input', filterAndRender);
});
