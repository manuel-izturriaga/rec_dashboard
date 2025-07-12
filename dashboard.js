import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// The API data provided by the user
const apiData = [response from fetchReservations in frontend/js/reservations.js];

// Colors for the pie chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [reservationsByDate, setReservationsByDate] = useState([]);
  const [reservationsByPark, setReservationsByPark] = useState([]);
  const [nightsDistribution, setNightsDistribution] = useState([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedState, setSelectedState] = useState('All');
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    if (apiData && apiData.data) {
      // Get unique states for the filter
      const uniqueStates = [...new Set(apiData.data.map(res => res.facility_state))].sort();
      setAvailableStates(['All', ...uniqueStates]);

      // Filter data based on selectedState
      const currentFilteredData = selectedState === 'All'
        ? apiData.data
        : apiData.data.filter(res => res.facility_state === selectedState);

      setFilteredData(currentFilteredData);

      // Process data for reservations by date
      const dateCounts = currentFilteredData.reduce((acc, reservation) => {
        const date = reservation.start_date.split('T')[0]; // Get YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const sortedDates = Object.keys(dateCounts).sort();
      const processedDateData = sortedDates.map(date => ({
        date: date,
        count: dateCounts[date],
      }));
      setReservationsByDate(processedDateData);

      // Process data for reservations by park
      const parkCounts = currentFilteredData.reduce((acc, reservation) => {
        const parkName = reservation.park;
        acc[parkName] = (acc[parkName] || 0) + 1;
        return acc;
      }, {});

      const processedParkData = Object.keys(parkCounts).map(park => ({
        name: park,
        value: parkCounts[park],
      }));
      setReservationsByPark(processedParkData);

      // Process data for nights distribution
      const nightsCounts = currentFilteredData.reduce((acc, reservation) => {
        const nights = reservation.nights;
        acc[nights] = (acc[nights] || 0) + 1;
        return acc;
      }, {});

      const processedNightsData = Object.keys(nightsCounts).map(nights => ({
        name: nights,
        count: nightsCounts[nights],
      })).sort((a, b) => {
        // Simple numeric sort for "X day(s)"
        const numA = parseInt(a.name.split(' ')[0]);
        const numB = parseInt(b.name.split(' ')[0]);
        return numA - numB;
      });
      setNightsDistribution(processedNightsData);

      // Calculate total reservations
      setTotalReservations(currentFilteredData.length);

      // Calculate total paid revenue
      const sumPaid = currentFilteredData.reduce((sum, reservation) => {
        // Ensure total_paid is a number, handle potential empty strings or non-numeric values
        const paid = parseFloat(reservation.total_paid);
        return sum + (isNaN(paid) ? 0 : paid);
      }, 0);
      setTotalRevenue(sumPaid.toFixed(2)); // Format to 2 decimal places
    }
  }, [selectedState]); // Recalculate when selectedState changes

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <header className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservation Dashboard</h1>
        <p className="text-gray-600">Overview of camping reservations from the API data.</p>

        {/* Filter Section */}
        <div className="mt-4">
          <label htmlFor="state-filter" className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Facility State:
          </label>
          <select
            id="state-filter"
            className="shadow border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto"
            value={selectedState}
            onChange={handleStateChange}
          >
            {availableStates.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Reservations Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Reservations</h2>
          <p className="text-5xl font-bold text-indigo-600">{totalReservations}</p>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Revenue</h2>
          <p className="text-5xl font-bold text-green-600">${totalRevenue}</p>
        </div>

        {/* Reservations by Date Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reservations by Start Date</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={reservationsByDate}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nights Distribution Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nights Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={nightsDistribution}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reservations by Park Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Distribution Across Parks</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reservationsByPark}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {reservationsByPark.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default App;
