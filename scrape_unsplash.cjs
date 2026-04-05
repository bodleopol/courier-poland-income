const https = require('https');

function scrape(query) {
  const options = {
    hostname: 'unsplash.com',
    port: 443,
    path: `/s/photos/${encodeURIComponent(query)}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (d) => { data += d; });
    res.on('end', () => {
      const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^\s"&?]+/g;
      const matches = data.match(regex);
      if (matches) {
        // Find unique bases
        const unique = [...new Set(matches.map(m => m.split('?')[0]))].slice(0, 3);
        console.log(`\nQuery: ${query}`);
        unique.forEach(u => console.log(u));
      } else {
        console.log(`No matches for ${query}`);
      }
    });
  });
  req.end();
}

scrape('mountain-bike');
scrape('motor-scooter');
scrape('delivery-motorcycle');
