"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var app = (0, express_1.default)();
var port = process.env.PORT || 8080;
// Serve static files from the build output (usually 'dist')
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
// For SPAs: send all other requests to index.html
app.get('*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'dist', 'index.html'));
});
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
