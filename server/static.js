#!/usr/bin/env node

/*global require, console*/

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = module.exports = express.createServer();

app.use(express.logger());

app.get('*', function (req, res, next) {
    var fileName = path.normalize(__dirname + '/..' + req.url.replace(/\?.*$/, ''));

    path.exists(fileName, function (exists) {
        if (!exists) {
            res.send('File not found', 404);
            return;
        }

        if (fs.statSync(fileName).isDirectory()) {
            fileName += '/index.html';
        }

        res.contentType(fileName);
        res.sendfile(fileName);
    });
});

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}

