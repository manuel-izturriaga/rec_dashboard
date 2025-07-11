import { join } from "path";

const port = 3000;
const projectRoot = import.meta.dir;
const publicDir = join(projectRoot, "..", "frontend");

console.log(`Bun server starting on http://localhost:${port}...`);
console.log(`Serving files from: ${publicDir}`);

Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);
    
    // API Route
    if (url.pathname === '/api/campsites') {
      const campgroundId = url.searchParams.get('campgroundId');
      const month = url.searchParams.get('month'); // Expects YYYY-MM-DD format

      if (!campgroundId || !month) {
        return new Response('Missing required query parameters: campgroundId and month', { status: 400 });
      }

      try {
        const [availabilityRes, sitesRes] = await Promise.all([
          fetch(`https://www.recreation.gov/api/camps/availability/campground/${campgroundId}/month?start_date=${month}T00%3A00%3A00.000Z`),
          fetch(`https://www.recreation.gov/api/search/campsites?fq=asset_id%3A${campgroundId}&agg=type&size=1000`)
        ]);

        if (!availabilityRes.ok || !sitesRes.ok) {
          console.error('Error fetching from external APIs:', availabilityRes.statusText, sitesRes.statusText);
          return new Response('Failed to fetch data from external APIs', { status: 502 });
        }

        const availabilityData = await availabilityRes.json();
        const sitesData = await sitesRes.json();
        const combinedData = {};

        for (const campsite of Object.values(availabilityData.campsites)) {
          const campsiteId = campsite.campsite_id;
          combinedData[campsiteId] = { ...campsite, availabilities: {} };
        }

        for (const campsite of Object.values(sitesData.campsites)) {
          const campsiteId = campsite.campsite_id;
          if (combinedData[campsiteId]) {
            combinedData[campsiteId].availabilities = campsite.availabilities;
          }
        }

        return new Response(JSON.stringify(Object.values(combinedData)), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }

    // Static File Server
    let filePath = join(publicDir, url.pathname);
    if (url.pathname === '/') {
      filePath = join(publicDir, 'index.html');
    }

    const file = Bun.file(filePath);
    const fileExists = await file.exists();

    if (fileExists) {
      return new Response(file);
    }

    return new Response('Not Found', { status: 404 });
  },
  error() {
    return new Response(null, { status: 404 });
  }
});