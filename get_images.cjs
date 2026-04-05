const https = require('https');

function search(query) {
  const url = `https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.images && json.images.length > 0) {
          console.log(`Query: ${query}`);
          console.log(`URL: ${json.images[0].src}`);
        }
      } catch (e) {
        console.error('Error parsing JSON');
      }
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}

search('mountain bike photography');
search('motor scooter photography');
search('delivery motorcycle photography');
