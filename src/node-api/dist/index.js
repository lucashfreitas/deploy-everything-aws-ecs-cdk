"use strict";
exports.__esModule = true;
var http = require("http");
var controller_1 = require("./controller");
var createServer = function () {
    var server = http.createServer(controller_1.index);
    server.listen(3000);
    console.log('server listening on port 3000');
};
createServer();
