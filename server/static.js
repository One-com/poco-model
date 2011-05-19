#!/usr/bin/env node

/*global require, console*/

var express = require('express'),
    app = module.exports = express.createServer();

app.use(express.logger());

app.use(express['static'](__dirname + '/..'));

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}

