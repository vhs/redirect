var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { check } = require('express-validator')

const config = require('./config.json')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res, next) {
    res.redirect(config.default)
});

app.get('/:marker', [check('marker').isString().trim().escape()], function (req, res, next) {
    let marker = req.params.marker

    if (marker !== undefined && typeof marker === 'string' && config.redirects[marker] !== undefined)
        res.redirect(config.redirects[req.params.marker])
    else
        res.json({ result: "ERROR", message: "Missing or invalid marker" })
});

module.exports = app;
