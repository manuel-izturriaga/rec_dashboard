const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/reservations', async (req, res) => {
  try {
    const { dateFrom, dateTo, limit, page } = req.query;
    const apiUrl = new URL('https://ridb.recreation.gov/api/v1/reservations');

    if (dateFrom) apiUrl.searchParams.append('dateFrom', dateFrom);
    if (dateTo) apiUrl.searchParams.append('dateTo', dateTo);
    if (limit) apiUrl.searchParams.append('limit', limit);
    if (page) apiUrl.searchParams.append('page', page);

    const response = await axios.get(apiUrl.toString(), {
      headers: {
        'apikey': '7196ee32-e25b-4786-bdc7-261550823f49'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching reservations:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      message: 'Error fetching reservations',
      error: error.response ? error.response.data : error.message
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000 for all network interfaces');
});