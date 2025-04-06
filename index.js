const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(7007, () => {
    console.log('Servidor funcional');
});