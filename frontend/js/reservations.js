document.addEventListener('DOMContentLoaded', () => {
    // Global state
    let allReservations = [];
    let chartInstances = {};

    // DOM Elements
    const monthInput = document.getElementById('month-select');
    const stateFilter = document.getElementById('state-filter');
    const totalReservationsEl = document.getElementById('total-reservations');
    const totalRevenueEl = document.getElementById('total-revenue');

    // --- Initialization ---
    function initialize() {
        // Set default month to current month
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        monthInput.value = `${year}-${month}`;

        // Initialize charts once with empty data
        initializeCharts();

        // Add event listeners
        monthInput.addEventListener('change', handleMonthChange);
        stateFilter.addEventListener('change', renderDashboard);

        // Initial fetch
        fetchDataForMonth(monthInput.value);
    }

    function initializeCharts() {
        const initialData = { labels: [], datasets: [{ data: [] }] };
        const chartOptions = { responsive: true, maintainAspectRatio: false };

        chartInstances.reservationsByDate = new Chart(document.getElementById('reservationsByDateChart').getContext('2d'), {
            type: 'line',
            data: initialData,
            options: chartOptions
        });
        chartInstances.nightsDistribution = new Chart(document.getElementById('nightsDistributionChart').getContext('2d'), {
            type: 'bar',
            data: initialData,
            options: chartOptions
        });
        chartInstances.reservationsByPark = new Chart(document.getElementById('reservationsByParkChart').getContext('2d'), {
            type: 'pie',
            data: initialData,
            options: chartOptions
        });
    }

    // --- Data Fetching ---
    async function fetchDataForMonth(selectedMonth) {
        if (!selectedMonth) return;

        const [year, month] = selectedMonth.split('-');
        const dateFrom = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0);
        const dateTo = new Date(year, month - 1, endDate.getDate()).toISOString().split('T')[0];

        const apiUrl = `/api/reservations?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100&offset=0`;
        console.log(`Fetching data from: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }
            const apiData = await response.json();

            allReservations = apiData.data || [];
            populateStateFilter(allReservations);
            renderDashboard();

        } catch (error) {
            console.error("Failed to load reservations:", error);
            allReservations = [];
            renderDashboard();
        }
    }

    function handleMonthChange() {
        fetchDataForMonth(monthInput.value);
    }

    // --- UI Population ---
    function populateStateFilter(data) {
        const currentFilterValue = stateFilter.value;
        while (stateFilter.options.length > 1) {
            stateFilter.remove(1);
        }

        const uniqueStates = [...new Set(data.map(res => res.facility_state))].sort();
        uniqueStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
        // Preserve the selected filter if it still exists
        if (uniqueStates.includes(currentFilterValue)) {
            stateFilter.value = currentFilterValue;
        }
    }

    // --- Rendering ---
    function renderDashboard() {
        const selectedState = stateFilter.value;
        const filteredData = selectedState === 'All'
            ? allReservations
            : allReservations.filter(res => res.facility_state === selectedState);

        updateSummaryCards(filteredData);
        updateAllCharts(filteredData);
    }

    function updateSummaryCards(data) {
        totalReservationsEl.textContent = data.length;
        const totalRevenue = data.reduce((sum, reservation) => {
            const paid = parseFloat(reservation.total_paid);
            return sum + (isNaN(paid) ? 0 : paid);
        }, 0);
        totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
    }

    function updateAllCharts(data) {
        updateReservationsByDateChart(data);
        updateNightsDistributionChart(data);
        updateReservationsByParkChart(data);
    }

    function updateChart(chartInstance, labels, datasets) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets = datasets;
        chartInstance.update();
    }

    function updateReservationsByDateChart(data) {
        const dateCounts = data.reduce((acc, reservation) => {
            const date = reservation.start_date.split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const sortedDates = Object.keys(dateCounts).sort();
        const datasets = [{
            label: 'Reservations',
            data: sortedDates.map(date => dateCounts[date]),
            borderColor: '#4c51bf',
            backgroundColor: 'rgba(76, 81, 191, 0.1)',
            fill: true,
            tension: 0.1
        }];
        updateChart(chartInstances.reservationsByDate, sortedDates, datasets);
    }

    function updateNightsDistributionChart(data) {
        const nightsCounts = data.reduce((acc, reservation) => {
            const nights = reservation.nights;
            acc[nights] = (acc[nights] || 0) + 1;
            return acc;
        }, {});

        const sortedNights = Object.keys(nightsCounts).sort((a, b) => parseInt(a) - parseInt(b));
        const labels = sortedNights.map(n => `${n} night(s)`);
        const datasets = [{
            label: 'Number of Stays',
            data: sortedNights.map(nights => nightsCounts[nights]),
            backgroundColor: '#38a169'
        }];
        updateChart(chartInstances.nightsDistribution, labels, datasets);
    }

    function updateReservationsByParkChart(data) {
        const parkCounts = data.reduce((acc, reservation) => {
            const parkName = reservation.park;
            acc[parkName] = (acc[parkName] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(parkCounts);
        const datasets = [{
            data: Object.values(parkCounts),
            backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'],
        }];
        updateChart(chartInstances.reservationsByPark, labels, datasets);
    }

    // --- Start the application ---
    initialize();
});