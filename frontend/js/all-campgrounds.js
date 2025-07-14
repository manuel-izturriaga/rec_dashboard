document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://www.recreation.gov/api/search?exact=false&fg=camping&start=0';
    const tableBody = document.getElementById('campgrounds-table-body');

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(campground => {
                    html += `
                        <tr class="border-b">
                            <td class="py-3 px-4">${campground.name}</td>
                            <td class="py-3 px-4">${campground.type}</td>
                            <td class="py-3 px-4">${campground.address.state_code}</td>
                        </tr>
                    `;
                });
            } else {
                html = '<tr><td colspan="3" class="text-center py-4">No campgrounds found.</td></tr>';
            }
            tableBody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching campgrounds:', error);
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4">Error loading data.</td></tr>';
        });
});
