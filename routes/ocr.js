var fs = require('fs');
var multiparty = require('multiparty')
var express = require('express');
var router = express.Router();
var AipOcrClient = require("baidu-aip-sdk").ocr
var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;
var path = require('path');

// 设置APPID/AK/SK
var APP_ID = "10365123";
var API_KEY = "fQ1GtIsEyQazSyCbByW5yLOS";
var SECRET_KEY = "XmgxETU603nHr1ocpWXYKmSpvRrUnuXP";
const PATH = path.resolve(__dirname, '../public/files/')
const RELA = 'http://10.23.40.194:8080/files/'


var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY)
var imgClient = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);

router.post('/image', function(req, res, next) {
  const PATH = path.resolve(__dirname, '../public/files/')
  const RELA = 'http://10.23.40.194:8080/files/'

  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      client.generalBasic(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
});

router.post('/receipt', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      client.receipt(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
})

router.post('/dish', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      imgClient.dishDetect(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
})

router.post('/car', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      imgClient.carDetect(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
})

router.post('/animal', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      imgClient.animalDetect(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
})

router.post('/plant', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {
    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, err => {
      if (err) return
      var image = fs.readFileSync(dstPath)
      var base64Img = new Buffer(image).toString('base64')

      imgClient.plantDetect(base64Img, { detect_direction: true })
        .then(function(result) {
          fs.unlink(dstPath)
          res.send({ data: JSON.stringify(result) })
        })
    })
  })
})

module.exports = router;