const app = require("./app");
const port = process.env.PORT || 3002;
const { initializeWebSocket } = require("./websocket");
const http = require("http");

const server = http.createServer(app);
initializeWebSocket(server);

server.listen(port, () => console.log(`Listening on port ${port}...`));
