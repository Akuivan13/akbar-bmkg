const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/gempa', async (req, res) => {
  try {
    const response = await axios.get("https://warning.bmkg.go.id/");
    const $ = cheerio.load(response.data);

    const gempa = {
      tanggal: $('.center').text().trim().replace(/Gempabumi Dirasakan/g, ''),
      magnitudo: $('.infolindu li:nth-child(1)').text().trim().split('Magnitudo')[0],
      kedalaman: $('.infolindu li:nth-child(2)').text().trim().split('Kedalaman')[0],
      koordinat: $('.infolindu li:nth-child(3)').text().trim().split('LS')[0],
      lokasi: $('.infoext .par:nth-child(1)').text().trim().split('Lokasi Gempa')[1],
      wilayahDirasakan: $('.infoext .par:nth-child(2)').text().trim().split('Wilayah Dirasakan (Skala MMI)')[1],
      arahan: $('.infoext .par:nth-child(3)').text().trim().split('Arahan')[1],
      saran: $('.infoext .par:nth-child(4)').text().trim().split('Saran BMKG')[1],
      linkPeta: $('.infoext a').attr('href'),
      waktuPemutakhiran: $('.infoext small').text().trim().split('Waktu pemutakhiran:')[1]
    };

    res.json(gempa);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam pengambilan data' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
