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
    database: 'MSJAPAN'
  }
  return sql.connect(config)
}

function getProduct() {
	console.log("Getting Product")
	return new sql.Request()
		.execute('uspGetAllProducts')
		.then(function(recordsets) {
			// console.log(recordsets);
      data = recordsets[0];
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
    .input('CPUSpeed', sql.Float(), CPUSpeed)
    .input('StorageType', sql.VarChar(50), StorageType)
    .input('StorageSize', sql.Float(), StorageSize)
    .input('Memory', sql.Int(), Memory)
    .input('Touch', sql.Bit(), Touch)
    .input('GPU', sql.VarChar(50), GPU)
    .input('resWidth', sql.Int(), resWidth)
    .input('resHeight', sql.Int(), resWidth)
    .input('DispSize', sql.Float(), DispSize)
    .input('NumUSB2', sql.Int(), NumUSB2)
    .input('NumUSB3', sql.Int(), NumUSB3)
    .input('NumHDMI', sql.Int(), NumHDMI)
    .input('Weight', sql.Float(), Weight)
    .input('BatteryLife', sql.Float(), BatteryLife)
    .execute('insertProductProc')
}

function addJSON() {
  var data = require('./yamada.json');
  var product;
  var brand;
  var price;
  var os;
  var display;
  var type;
  var cpu;
  var cpuSpeed;
  var storageType;
  var storageSize;
  var memory;
  var touch;
  var gpu;
  var resolutionWidth;
  var resolutionHeight;
  var usb2; 
  var usb3;
  var hdmi;
  var weight;
  var battery;

  for(var i = 0; i < data.length; i++) {
    product = data[i]["Product"];
    brand = data[i]["Brand"];
    price = data[i]["Price(Yen)"];
    os = data[i]["Operating System"];
    display = data[i]["Display Size"];
    type = data[i]["Type"];
    cpu = data[i]["CPU"];
    cpuSpeed = data[i]["CPU Speed"];
    storageType = data[i]["Storage Type (SSD, HDD, SSHD)"];
    storageSize = data[i]["Storage Size (GB)"];
    memory = data[i]["Memory (GB)"];
    touch = data[i]["Touch (Y or N)"];
    gpu = data[i]["GPU"];
    resolutionWidth = data[i]["Resolution Width"];
    resolutionHeight = data[i]["Resolution Height"];
    usb2 =  data[i]["Number USB2"];
    usb3 = data[i]["Number USB3"];
    hdmi = data[i]["Number HDMI"];
    weight = data[i]["Weight"];
    battery = data[i]["Battery Life"];
    console.log(product);
    addProduct("Yamada", product, brand, price, os, type, cpu, cpuSpeed, storageType, storageSize, memory, touch, gpu, resolutionWidth, resolutionHeight, display, usb2, usb3, hdmi, weight, battery);
    console.log("done");
  }
}

function makeRouter() {
		
  app.use(cors())  

  app.get('/', function (req, res) {
  	res.sendFile('./public/index.html', { root: __dirname })
    .then(getProduct())
  })

  app.get('/addForm', function (req, res) {
		res.sendFile('/public/addForm.html', { root: __dirname })
	});

	app.get('/products', function (req, res) {
		res.json(data);
	})

  app.get('/addJSON', function(req, res) {
    addJSON();
    console.log("added JSON")
	  res.redirect('/')
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
        
      addProduct(retailer, prodName, brand, price, OS, formFactor, CPU, CPUSpeed, storageType, storageSize, memory, touch, GPU, resWidth, resHeight, dispSize, numUSB2, numUSB3, numHDMI, weight, batteryLife).then(function () {
        res.redirect('/')
        console.log("success")
      }).catch(function (err) {
        console.log(err);
      });

    }).catch(function (error) {
        console.log(error);
    })
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
