const app = require('../server')
const server = require('http').Server(app);

const port = (3000);
server.listen(port);
console.log(`server is running on port ${port}`);