var multiparty = require('multiparty');
var util = require('util');
var fs = require("fs");
var express = require('express');
var router = express.Router();
var Axure = require('../model/axure.js')
var unzip = require("unzip2");
var path = require("path");
var iconv = require('iconv-lite');

const PATH = path.resolve(__dirname, '../public/files/')
const RELA = 'http:\/\/10.23.40.194:8080\/files\/'

router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {

    var inputFile = files.file[0];
    var uploadedPath = inputFile.path;
    var dstPath = PATH + '\/' + inputFile.originalFilename;
    var resPath = RELA + '\/' + inputFile.originalFilename;

    fs.rename(uploadedPath, dstPath, function(err) {
      if (err) {
        console.log('rename error: ' + err);
      } else {
        fs.unlinkSync(uploadedPath)
        console.log('rename ok');
      }
      res.send({ fields: fields, resPath: resPath });
    });
  });
});

router.post('/find', function(req, res, next) {
  var whereStr = {}
  if (req.body._id) whereStr = { _id: req.body._id }
  Axure.find(whereStr, (err, result) => {
    if (err) res.send({ code: 50000 })
    if (result.length === 1) result = result[0]
    res.send({
      code: 0,
      data: result
    })
  })
});

router.post('/insert', function(req, res, next) {
  var _axure = new Axure(req.body.data)
  _axure.cdate = new Date().valueOf()
  _axure.save((err, result) => {
    if (err) return res.send({ code: 50000 })
    res.send({
      code: 0,
      data: result
    })
    return
  })
});

router.post('/update', function(req, res, next) {
  var whereStr = { _id: req.body.data._id }
  Axure.update(whereStr, { $set: req.body.data }, function(err, result) {
    if (err) res.send({ code: 50000 })
    res.send({
      code: 0,
      data: result
    })
  })
});

router.post('/remove', function(req, res, next) {
  Axure.remove({ _id: req.body._id }, function(err, result) {
    if (err || er) return res.send({ code: 50000 })
    res.send({
      code: 0,
      data: result
    })
  })
});


router.post('/zip', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });
  var entrance;

  form.parse(req, function(err, fields, files) {
    // 获取参数
    var inputFile = files.file[0];
    var type = 'axure';
    var name = fields.cuser[0];
    console.log(name)
    var dstName = name + '.zip'
    var uploadedPath = inputFile.path; //上传路径

    // 路径配置
    var absDir = path.join(PATH, type, name) //绝对路径
    var dstPath = path.join(absDir, dstName) //目标路径

    // 相对路径
    var relDir = RELA + type + '\/' + name //相对路径
    var relPath = relDir + '\/' + dstName

    // 如果有文件则删除再新建
    deleteFolder(absDir)
    fs.mkdirSync(absDir)

    // 上传的zip文件移动到目标文件夹
    fs.renameSync(uploadedPath, dstPath)

    // 解压到当前文件夹
    var exractor = unzip.Extract({ path: absDir })
    exractor.on('close', ev => {
      // 解压完成后读取目标目录
      var zipFiles = fs.readdirSync(absDir)
      if (zipFiles.length > 2) return
      zipFiles.forEach(filename => {
        var stat = fs.statSync(path.join(absDir, filename))
        if (stat.isDirectory()) moveUpper(filename, absDir)
      })
      entrance = relDir + '\/' + entrance
      res.send({ resPath: relPath, entrance: entrance })
    })
    fs.createReadStream(dstPath).pipe(exractor)
  });

  var deleteFolder = (url) => {
    if (!fs.existsSync(url)) return
    var files = fs.readdirSync(url)
    files.forEach(function(file, index) {
      var curPath = path.join(url, file)
      if (fs.statSync(curPath).isDirectory()) deleteFolder(curPath);
      else fs.unlinkSync(curPath);
    });
    fs.rmdirSync(url);
  }

  var moveUpper = (filename, absDir) => {
    var files = fs.readdirSync(path.join(absDir, filename))
    files.forEach(child => {
      var oPath = path.join(absDir, filename, child)
      var nPath = path.join(absDir, child)
      if (child === 'index.html') entrance = 'index.html'
      else if (child === 'start.html') entrance = 'start.html'
      fs.renameSync(oPath, nPath)
    })
  }
});


module.exports = router;