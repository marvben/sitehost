const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/config/.env') });
const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
const rootUrl = `https://api.recruitment.shq.nz`;

app.use(express.static(__dirname + '/public'));

app.get('/customersDomains', async (req, res) => {
  const client_id = req.query.clientId || 100;
  const url = `${rootUrl}/domains/${client_id}?api_key=${process.env.API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.get('/dnsRecordsId', async (req, res) => {
  const zoneAndId = req.query.zoneAndId;
  const url = `${rootUrl + zoneAndId}?api_key=${process.env.API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.get('/', (req, res) => {
  const options = {
    root: path.join(__dirname),
  };

  const fileName = './public/index.html';
  res.status(200).sendFile(fileName, options, function (err) {
    if (err) {
      console.error('Error sending file:', err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on ${port}, http://localhost:${port}`);
});
