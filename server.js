const http = require("http");

const host = 'localhost';
const port = process.env.PORT || 3000;

const requestListener = function (req, res) {
    res.end('OK');
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(process.env);
    console.log(`Server is running on http://${host}:${port}`);
});