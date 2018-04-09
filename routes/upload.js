var multiparty = require('multiparty');
var util = require('util');
var fs = require("fs");
var express = require('express');
var router = express.Router();
var unzip = require("unzip2");
var path = require("path");
var iconv = require('iconv-lite');
var gm = require('gm')

const PATH = path.resolve(__dirname, '../public/files/image')
const RELA = 'http:\/\/10.23.40.194:8080\/files\/image'

router.post('/file', function(req, res, next) {
  var form = new multiparty.Form({ uploadDir: PATH });

  form.parse(req, function(err, fields, files) {

    var inputFile = files.file[0];
    var size = 240;
    var uploadedPath = inputFile.path;
    var dstPath = PATH + '\/' + inputFile.originalFilename;
    var resPath = RELA + '\/' + inputFile.originalFilename;


    gm(dstPath)
      .resize(20, 20)
      .write(path.resolve(PATH + '\/thumb.jpg'), function(err) {
        if (!err) console.log('done');
      });

    fs.rename(uploadedPath, dstPath, function(err) {
      if (err) {
        console.log('rename error: ' + err);
      } else {
        fs.unlink(path.resolve(uploadedPath), err => {
          console.log('cannot be del');
        })
      }
      res.send({ fields: fields, resPath: resPath });
    });
  });
});


router.post('/zip', function(req, res, next) {

  const fPATH = path.resolve(__dirname, '../public/files')
  const fRELA = 'http:\/\/10.23.40.194:8080\/files'


  var form = new multiparty.Form({ uploadDir: fPATH });
  var entrance;

  form.parse(req, function(err, fields, files) {
    // 获取参数
    var inputFile = files.file[0];
    var type = fields.type[0];
    var code = fields.code[0];
    var dstName = code + '.zip'
    var uploadedPath = inputFile.path; //上传路径

    // 路径配置
    var absDir = path.join(fPATH, type, code) //绝对路径
    var dstPath = path.join(absDir, dstName) //目标路径

    // 相对路径
    var relDir = fRELA + '\/' + type + '\/' + code //相对路径
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