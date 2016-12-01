 'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

// app.use(express.static(__dirname + '/static/public'));
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// function getPass() {
//   var pass = 'GoHuskies!'
//   if (!pass) {
//     throw new Error('Missing PASSWORD environment variable')
//   }
//   return pass
// }

// function connectToDb() {
//   var config = {
//     user: 'INFO445',
//     password: getPass(),
//     server: 'is-hay04.ischool.uw.edu',
//     database: 'MSJapan'
//   }
//   return sql.connect(config)
// }