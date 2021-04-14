"use strict";
exports.__esModule = true;
exports.index = void 0;
var index = function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json");
    res.end("Api is working");
};
exports.index = index;
