const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 4001;

const APP_PATH = './dist/covid19Tracker';

app.use('/', express.static(path.join(__dirname, APP_PATH)))
    .get('/*', (req, res) => res.sendFile(path.join(__dirname, APP_PATH + '/index.html')))
    .listen(PORT, () => console.log(`Listening on port: ${PORT}`));