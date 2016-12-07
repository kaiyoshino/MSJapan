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

function addProduct(Retailer, ProdName, Brand, Price, OS, FormFactor, CPU, CPUSpeed, StorageType, StorageSize, Memory, Touch, GPU, resWidth, resHeight, DispSize, NumUSB2, NumUSB3, NumHDMI, Weight, BatteryLife) {
  console.log("Adding Product")
  return new sql.Request()
    .input('Retailer', sql.VarChar(50), Retailer)
    .input('ProdName', sql.VarChar(50), ProdName)
    .input('Brand', sql.VarChar(50), Brand)
    .input('Price', sql.Money(), Price)
    .input('OS', sql.VarChar(50), OS)
    .input('FormFactor', sql.VarChar(50), FormFactor)
    .input('CPU', sql.VarChar(50), CPU)
    .input('CPUSpeed', sql.Numeric(10,2), CPUSpeed)
    .input('StorageType', sql.VarChar(50), StorageType)
    .input('StorageSize', sql.Float(), StorageSize)
    .input('Memory', sql.Int(), Memory)
    .input('Touch', sql.Bit(), Touch)
    .input('GPU', sql.VarChar(50), GPU)
    .input('resWidth', sql.Int(), resWidth)
    .input('resHeight', sql.Int(), resWidth)
    .input('DispSize', sql.Numeric(5,2), DispSize)
    .input('NumUSB2', sql.Int(), NumUSB2)
    .input('NumUSB3', sql.Int(), NumUSB3)
    .input('NumHDMI', sql.Int(), NumHDMI)
    .input('Weight', sql.Float(), Weight)
    .input('BatteryLife', sql.Numeric(5,2), BatteryLife)
    .execute('dbo.insertProductProc')
}

function makeRouter() {
		
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

  app.post('/productSubmit', function (req, res) {
    connectToDb().then(function () {
    var retailer = req.body.retailer
    var prodName = req.body.prodName
    var brand = req.body.brand
    var price = req.body.price
    var OS = req.body.OS
    var formFactor = req.body.formFactor
    var CPU = req.body.CPU
    var CPUSpeed = req.body.CPUSpeed
    var storageType = req.body. storageType
    var storageSize = req.body.storageSize
    var memory = req.body.memory
    var touch = req.body.touch
    var GPU = req.body.GPU
    var resWidth = req.body.resWidth
    var resHeight = req.body.resHeight
    var dispSize = req.body.dispSize
    var numUSB2 = req.body.numUSB2
    var numUSB3 = req.body.numUSB3
    var numHDMI = req.body.numHDMI
    var weight = req.body.weight
    var batteryLife = req.body.batteryLife
      
      var requestType = req.body.optradio;
      console.log(requestType);
      switch (requestType) {
        case 'create':
          addProduct().then(function () {
            res.redirect('/')
            console.log("success")
          }).catch(function (err) {
            console.log(err);
          });
          break;
        case 'update':
          //updateCustomer(email, phoneNumber, address, city, state, contactFName, contactLName, contactType, relationship).then(function () {
            res.redirect('/')
          }).catch(function (err) {
            console.log(err);
          });
          break;
        case 'delete':
          //deleteCustomer(email).then(function () {
            res.redirect('/')
          }).catch(function (err) {
            console.log(err);
          });
          break;
        default:
          break;
      }
    }).catch(function (error) {
      console.log(error);
    });

}
}

function goPlease() {
  connectToDb().then(() => {
  	getProduct();
    makeRouter();
    app.listen(3000);
  })
}

goPlease()
