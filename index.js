const config = require('./utils/config');
const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const PORT = config.PORT || '3000';
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });
