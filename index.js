const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(9009, () => {
    console.log('Servidor funcional');
});