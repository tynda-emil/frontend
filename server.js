const { frontendIp, frontendPort } = require('./public/js/config');
const express = require('express');
const path = require('path');

const app = express();
const PORT = frontendPort;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'pages', 'main.html'));
});

const localIp = frontendIp;
app.listen(PORT, '0.0.0.0', () => {
 console.log(`Server is running on http://${localIp}:${PORT}`);
});
