 'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')

var data

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPass(),
    server: 'is-hay04.ischool.uw.edu',
    database: 'derryc09'
  }
  return sql.connect(config)
}

function getProduct() {
	console.log("Getting Product")
	return new sql.Request()
		// .query('SELECT db_name()')
		.query('SELECT * FROM hardware')
		//.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = "BASE TABLE" AND TABLE_CATALOG="dbName"')
		// .query('SELECT P.ProductName FROM Product P JOIN Manufacturer M ON P.ManufacturerID = M.ManufacturerID WHERE M.ManfacturerName = "Lenovo")
		.then(function(recordsets) {
			// console.log(recordsets);
      data = recordsets;
		})
}

function makeRouter() {
	// app.use( bodyParser.json() );       // to support JSON-encoded bodies
	// app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies
		
    app.use(cors())  
 
    app.get('/', function (req, res) {
    	res.sendFile('./public/index.html', { root: __dirname })
	})

    app.get('/addForm', function (req, res) {
		res.sendFile('/public/addForm.html', { root: __dirname })
	});

	app.get('/products', function (req, res) {
		res.json(data);
	})

}

function goPlease() {
  connectToDb().then(() => {
  	getProduct();
    makeRouter();
    app.listen(3000);
  })
}

goPlease()