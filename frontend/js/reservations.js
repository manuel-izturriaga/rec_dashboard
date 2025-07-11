let cachedReservationsData = null;

document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('month-select');

    // Set default to current month
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    monthInput.value = `${year}-${month}`;
    
    // Initial fetch
    handleMonthChange({ target: { value: monthInput.value } });

    monthInput.addEventListener('change', handleMonthChange);
});

async function handleMonthChange(event) {
    const selectedMonth = event.target.value;
    if (!selectedMonth) return;

    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const dateFrom = startDate.toISOString().split('T')[0];
    const dateTo = endDate.toISOString().split('T')[0];

    await fetchReservations(dateFrom, dateTo);
}

async function fetchReservations(dateFrom, dateTo) {
    const summaryDiv = document.getElementById('reservations-summary');
    summaryDiv.innerHTML = '<p>Loading reservations...</p>';
    const apiUrl = `/api/reservations?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=5000&offset=0`;

    try {
        const response = await fetch(apiUrl);

        if (response.status === 200) {
            const data = await response.json();
            cachedReservationsData = data.data;
            const aggregatedData = aggregateReservations(cachedReservationsData);
            renderSummary(aggregatedData);
        } else if (response.status === 304) {
            if (cachedReservationsData) {
                const aggregatedData = aggregateReservations(cachedReservationsData);
                renderSummary(aggregatedData);
            } else {
                renderSummary({});
            }
        } else if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }
    } catch (error) {
        summaryDiv.innerHTML = `<p class="text-red-500">Failed to load reservations.</p>`;
    }
}

function aggregateReservations(reservations) {
    if (!Array.isArray(reservations)) {
        return {};
    }
    return reservations.reduce((acc, reservation) => {
        const locationId = reservation.parent_location_id;
        if (!acc[locationId]) {
            acc[locationId] = {
                // Assuming 'parent_location' holds the name.
                name: reservation.parent_location || `Location ID: ${locationId}`,
                count: 0
            };
        }
        acc[locationId].count++;
        return acc;
    }, {});
}

function renderSummary(aggregatedData) {
    const summaryDiv = document.getElementById('reservations-summary');
    summaryDiv.innerHTML = '';

    if (Object.keys(aggregatedData).length === 0) {
        summaryDiv.innerHTML = '<p>No reservations found for the selected month.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'min-w-full bg-white';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th class="py-2 px-4 border-b">Location Name</th>
            <th class="py-2 px-4 border-b">Total Reservations</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const locationId in aggregatedData) {
        const locationData = aggregatedData[locationId];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border-b text-center">${locationData.name}</td>
            <td class="py-2 px-4 border-b text-center">${locationData.count}</td>
        `;
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    summaryDiv.appendChild(table);
}