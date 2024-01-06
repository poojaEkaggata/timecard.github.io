"use strict";

var express = require('express');

var session = require('express-session');

var app = express();
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false // Configure other options as needed

}));