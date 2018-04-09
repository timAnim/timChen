var multiparty = require('multiparty');
var fs = require("fs");
var path = require('path');
var express = require('express');
var router = express.Router();
var output = require('better-xlsx');
var officegen = require('officegen');
var http = require("http");
var sizeOf = require('image-size');
var jwt = require('jwt-simple');

router.post('/generate-prd-excel', (req, res, next) => {
  const PATH = path.resolve(__dirname, '../public/files/')
  const RELA = 'http://10.23.40.194:8080/files/'
  var dstPath, resPath, excel, reqData;

  var border = function(cell) {
    cell.style.border.top = 'thin'
    cell.style.border.topColor = 'ff9e9e9e'
    cell.style.border.left = 'thin'
    cell.style.border.leftColor = 'ff9e9e9e'
    cell.style.border.bottom = 'thin'
    cell.style.border.bottomColor = 'ff9e9e9e'
    cell.style.border.right = 'thin'
    cell.style.border.rightColor = 'ff9e9e9e'
  }

  var h2Style = new output.Style()
  h2Style.align.v = 'center'
  h2Style.font.color = 'ff9e9e9e'
  h2Style.font.bold = true
  h2Style.align.wrapText = true
  h2Style.align.shrinkToFit = true

  var pStyle = new output.Style()
  pStyle.align.v = 'center';
  pStyle.align.wrapText = true
  pStyle.align.shrinkToFit = true

  var getDataSync = function() {
    var getData = new Promise((resolve, reject) => {
      dstPath = path.join(PATH, req.body.name)
      resPath = RELA + req.body.name
      reqData = req.body.data
      resolve()
    })
    return getData
  }

  var generateFile = function() {
    var printDoc = new Promise((resolve, reject) => {
      excel = new output.File()
      // 下面是excel

      for (var i = reqData.length - 1; i >= 0; i--) {
        var indexUrl = 'http://dev.yutong.com/zentao/story-view-' + reqData[i].id['#text'] + '.html'
        const nsheet = excel.addSheet(reqData[i].id['#text'])
        const row_1 = nsheet.addRow()
        const row_2 = nsheet.addRow()
        const row_2_2 = nsheet.addRow()
        const row_3 = nsheet.addRow()
        const row_4 = nsheet.addRow()
        const row_5 = nsheet.addRow()
        const row_6 = nsheet.addRow()
        const row_7 = nsheet.addRow()
        row_1.setHeightCM(1.2)
        row_2.setHeightCM(1.2)
        row_2_2.setHeightCM(0.8)
        row_3.setHeightCM(0.8)
        row_4.setHeightCM(0.8)
        row_5.setHeightCM(0.8)
        row_6.setHeightCM(1.2)

        // 第一行
        const cell_1_1 = row_1.addCell()
        cell_1_1.value = '需求基本信息'
        cell_1_1.hMerge = 3
        cell_1_1.style = h2Style

        // 第二行
        const cell_2_1 = row_2.addCell()
        cell_2_1.value = '需求名称'
        cell_2_1.style = pStyle

        const cell_2_2 = row_2.addCell()
        cell_2_2.value = reqData[i].title['#text']
        cell_2_2.hMerge = 2
        cell_2_2.style = pStyle

        // 第二行
        const cell_2_2_1 = row_2_2.addCell()
        cell_2_2_1.value = '禅道地址'
        cell_2_2_1.style = pStyle

        const cell_2_2_2 = row_2_2.addCell()
        cell_2_2_2.value = indexUrl
        cell_2_2_2.hMerge = 2
        cell_2_2_2.style = pStyle

        // 第三行
        const cell_3_1 = row_3.addCell()
        cell_3_1.value = '需求部门'
        cell_3_1.style = pStyle

        const cell_3_2 = row_3.addCell()
        // cell_3_2.value = reqData[i]['需求部门']
        cell_3_2.style = pStyle

        const cell_3_3 = row_3.addCell()
        cell_3_3.value = '所属产品'
        cell_3_3.style = pStyle

        const cell_3_4 = row_3.addCell()
        cell_3_4.value = reqData[i].product['#text']
        cell_3_4.style = pStyle

        // 第四行
        const cell_4_1 = row_4.addCell()
        cell_4_1.value = '由谁创建'
        cell_4_1.style = pStyle

        const cell_4_2 = row_4.addCell()
        cell_4_2.value = reqData[i].openedBy['#text']
        cell_4_2.style = pStyle

        const cell_4_3 = row_4.addCell()
        cell_4_3.value = '指派给'
        cell_4_3.style = pStyle

        const cell_4_4 = row_4.addCell()
        cell_4_4.value = reqData[i].assignedTo['#text']
        cell_4_4.style = pStyle

        // 第五行
        const cell_5_1 = row_5.addCell()
        cell_5_1.value = '创建日期'
        cell_5_1.style = pStyle

        const cell_5_2 = row_5.addCell()
        cell_5_2.value = reqData[i].openedDate['#text']
        cell_5_2.style = pStyle

        const cell_5_3 = row_5.addCell()
        cell_5_3.value = '优先级'
        cell_5_3.style = pStyle

        const cell_5_4 = row_5.addCell()
        cell_5_4.value = reqData[i].pri['#text']
        cell_5_4.style = pStyle

        // 第6行
        const cell_6_1 = row_6.addCell()
        cell_6_1.value = '需求描述'
        cell_6_1.hMerge = 3
        cell_6_1.style = h2Style

        // 第7行
        var des = reqData[i].spec['#text']
        if (des) {
          var lines = 3
          const cell_7_1 = row_7.addCell()

          var item = reqData[i].spec['#text'].replace(/<[^>]+>/g, '')
          cell_7_1.value = item
          cell_7_1.hMerge = 3
          cell_7_1.style = pStyle
          for (var m = des.length - 1; m >= 0; m--) {
            if (des.charAt(m) == '\n') lines++
          }
          row_7.setHeightCM(0.625 * lines)
        }

        var cols = nsheet.cols
        var rows = nsheet.rows
        for (var c = cols.length - 1; c >= 0; c--) {
          nsheet.col(c).width = 15
          for (var r = rows.length - 1; r >= 0; r--) {
            border(nsheet.cell(r, c))
          }
        }
      }

      resolve()
    })
    return printDoc
  }

  var writeXlsxSync = () => {
    var writeXlsx = new Promise((resolve, reject) => {
      excel
        .saveAs()
        .pipe(fs.createWriteStream(dstPath + '.xlsx'))
        .on('finish', () => {
          resolve()
        });
    })
    return writeXlsx
  }

  getDataSync()
    .then(() => {
      return generateFile()
    })
    .then(() => {
      return writeXlsxSync()
    })
    .then(() => {
      res.send({ resPath: resPath + '.xlsx' })
    })
})

router.post('/generate-prd-word', (req, res, next) => {
  const PATH = path.resolve(__dirname, '..\/public\/files\/')
  const RELA = 'http:\/\/10.23.40.194:8080\/files\/'

  var dstPath, resPath, docx, reqData, images = []

  var addHeader = (txtObj, text) => {
    txtObj.addText(
      text, { font_size: 20, font_face: 'Microsoft YaHei' }
    )
    txtObj.options.align = 'center'
    txtObj.addLineBreak()
  }

  var addH1 = function(txtObj, text) {
    txtObj.addText(
      text, { font_size: 20, font_face: 'Microsoft YaHei' }
    )
    txtObj.addLineBreak()
  }

  var addH2 = function(txtObj, text) {
    txtObj.addText(
      text, { font_size: 16, font_face: 'Microsoft YaHei', bold: true }
    )
    txtObj.addLineBreak()
  }

  var addPara = function(txtObj, text) {
    txtObj.addText(
      text, { font_size: 13, font_face: 'Microsoft YaHei' }
    )
  }

  var cellStyle = {
    cellColWidth: 2200,
    b: true,
    sz: 24,
    shd: {
      align: "left",
      vAlign: "center",
    },
    borders: 'single',
    fontFamily: "Microsoft YaHei"
  }

  var tableStyle = {
    tableColWidth: 4400,
    tableSize: 18,
    tableColor: "#212121",
    tableAlign: "left",
    borders: true,
  }

  var getDataSync = function() {
    var getData = new Promise((resolve, reject) => {
      dstPath = path.join(PATH, req.body.name)
      resPath = RELA + req.body.name
      reqData = req.body.data
      resolve()
    })
    return getData
  }

  var getImageSync = () => {
    var reg = /(<img.*src=["|'].*["|'].*\/>)/ig
    var src = /src=['|"]([^\'\"]*)['|"]/i
    for (var i = reqData.length - 1; i >= 0; i--) {
      if (!reqData[i].spec['#text']) {
        continue
      }
      reqData[i].desArr = reqData[i].spec['#text'].split(reg)
      var arr = reqData[i].desArr
      // 说明里的描述，将图片都取出来
      for (var j = arr.length - 1; j >= 0; j--) {
        var res = arr[j].match(src)
        if (res) {
          var _str = res[1].split('/')
          var name = _str[_str.length - 1]
          var imgObj = {
            origin: res[1],
            name: name,
            local: path.join(PATH, name)
          }
          arr[j] = imgObj
          images.push(imgObj)
        }
      }
    }

    var promiseArr = []
    for (var i = images.length - 1; i >= 0; i--) {
      var imgPromise = new Promise((resolve, reject) => {
        var url = 'http://dev.yutong.com/zentao/' + images[i].origin
        http.get(url, function(getImg) {
          var urlRes = url.split('/')
          var name = urlRes[urlRes.length - 1]
          var imgData = "";
          getImg.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
          getImg.on("data", function(chunk) {
            imgData += chunk;
          });
          getImg.on("end", function() {
            fs.writeFile(path.join(PATH, name), imgData, "binary", function(err) {
              if (err) console.log(err)
              resolve()
            });
          });
        });
      })
      promiseArr.push(imgPromise)
    }
    return Promise.all(promiseArr)
  }

  var generateFile = function() {
    var printDoc = new Promise((resolve, reject) => {
      var docxFile = officegen('docx')
      var pObj = docxFile.createP()
      pObj.addImage(path.join(PATH, 'yutong_logo.png'))
      pObj.addLineBreak()
      pObj.addLineBreak()
      addHeader(pObj, reqData[0].product['#text'] + '需求文档')
      var date = new Date()
      date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
      var table = [
        [{ val: "信息分类:", opt: cellStyle }, { val: '系统设计', opt: cellStyle }],
        [{ val: "责任人:", opt: cellStyle }, { val: '陈峥', opt: cellStyle }],
        [{ val: "起草:", opt: cellStyle }, { val: '陈峥', opt: cellStyle }],
        [{ val: "创建时间:", opt: cellStyle }, { val: date, opt: cellStyle }],
      ]
      docxFile.createTable(table, tableStyle)
      docxFile.putPageBreak()
      var pObj = docxFile.createP()
      addH1(pObj, '一、变更履历')
      addH1(pObj, '二、项目背景')
      var table = [
        [{ val: "所属产品", opt: cellStyle }, { val: reqData[0].product['#text'], opt: cellStyle }],
        [{ val: "所属模块", opt: cellStyle }, { val: reqData[0].module['#text'], opt: cellStyle }],
      ]
      docxFile.createTable(table, tableStyle)

      var pObj = docxFile.createP()
      addH1(pObj, '三、名词解释')
      addH1(pObj, '四、系统功能')
      // 下面是excel

      for (var i = 0; i < reqData.length; i++) {
        // 下面是word
        var indexUrl = 'http://dev.yutong.com/zentao/story-view-' + reqData[i].id['#text'] + '.html'
        var pObj = docxFile.createP()
        pObj.addHorizontalLine()
        pObj.addText(
          '#' + reqData[i].id['#text'], {
            font_size: 16,
            font_face: 'Microsoft YaHei',
            link: indexUrl,
            color: '#8bc34a',
            underline: true,
          })
        addH2(pObj, reqData[i].title['#text'])
        var table = [
          [{ val: "需求来源", opt: cellStyle }, { val: reqData[i].source['#text'], opt: cellStyle }],
          [{ val: "优先级", opt: cellStyle }, { val: reqData[i].pri['#text'], opt: cellStyle }],
          [{ val: "相关需求", opt: cellStyle }, { val: reqData[i].linkStories['#text'], opt: cellStyle }],
        ]
        docxFile.createTable(table, tableStyle)

        var pObj = docxFile.createP()
        var desArr = reqData[i].desArr
        var txt = ''
        if (!desArr) {
          continue
        }
        for (var j = 0; j < desArr.length; j++) {
          if (desArr[j].local) {
            var dimensions = sizeOf(desArr[j].local)
            var height = Math.floor(320 / dimensions.width * dimensions.height)
            pObj.addImage(path.resolve(desArr[j].local), {
              cx: 320,
              cy: height,
              align: 'center'
            })
            pObj.addLineBreak()
          } else {
            var ar = desArr[j].split(/<br*.\/>|\&nbsp;/)
            ar.forEach(item => {
              if (item) {
                item = item.replace(/<[^>]+>/g, '')
                addPara(pObj, item)
                pObj.addLineBreak()
                pObj.addLineBreak()
              }
            })
          }

        }
      }

      docx = fs.createWriteStream(dstPath + '.docx')
      docxFile.generate(docx)

      resolve()
    })
    return printDoc
  }

  var writeDocxSync = () => {
    var writeDocx = new Promise((resolve, reject) => {
      docx.on('close', ev => {
        resolve()
      });
    })
    return writeDocx
  }

  var delImages = () => {
    var reg = /(<img.*src=["|'].*["|'].*\/>)/ig
    for (var i = reqData.length - 1; i >= 0; i--) {
      if (!reqData[i].spec['#text']) {
        continue
      }
      reqData[i].desArr = reqData[i].spec['#text'].split(reg)
      var desArr = reqData[i].desArr
      for (var j = desArr.length - 1; j >= 0; j--) {
        if (desArr[j].local) {
          fs.unlinksync(path.resolve(desArr[j].local), err => {
            console.log(err)
          })
        }
      }
    }
  }

  getDataSync()
    .then(() => {
      return getImageSync()
    })
    .then(() => {
      console.log('图片都拿到了')
      return generateFile()
    })
    .then(() => {
      console.log('文件已经生成了')
      return writeDocxSync()
    })
    .then(() => {
      console.log('写到doc里面了')
      delImages()
      res.send({ resPath: resPath + '.docx' })
    })
})

router.post('/generate-week-report', (req, res, next) => {
  const PATH = path.resolve(__dirname, '../public/files/')
  const RELA = 'http://10.23.40.194:8080/files/'
  var dstPath, resPath, excel, reqData, filename

  var border = function(cell) {
    cell.style.border.top = 'thin'
    cell.style.border.topColor = 'ff9e9e9e'
    cell.style.border.left = 'thin'
    cell.style.border.leftColor = 'ff9e9e9e'
    cell.style.border.bottom = 'thin'
    cell.style.border.bottomColor = 'ff9e9e9e'
    cell.style.border.right = 'thin'
    cell.style.border.rightColor = 'ff9e9e9e'
  }

  var h1Style = new output.Style()
  h1Style.align.v = 'center'
  h1Style.align.h = 'center'
  h1Style.font.size = 18

  var h2Style = new output.Style()
  h2Style.align.v = 'center'
  h1Style.align.h = 'center'
  h2Style.font.color = 'ffffff'
  h2Style.font.bold = true
  h2Style.fill.patternType = 'solid'
  h2Style.fill.bgColor = 'ff000000'
  h2Style.fill.fgColor = '009e9e9e'

  var pStyle = new output.Style()
  pStyle.align.v = 'center';
  pStyle.align.h = 'left';

  var getDataSync = function() {
    var getData = new Promise((resolve, reject) => {
      var filename = 'W' + req.body.week + '_' + req.body.start + '至' + req.body.end + '_周工作总结_陈峥.xlsx'
      dstPath = path.join(PATH, filename)
      resPath = RELA + filename
      reqData = req.body.data
      resolve()
    })
    return getData
  }

  var generateFile = function() {
    var printDoc = new Promise((resolve, reject) => {
      excel = new output.File()
      const nsheet = excel.addSheet('第' + req.body.week + '周')
      // 下面是excel
      const row_1 = nsheet.addRow()
      const row_2 = nsheet.addRow()
      const row_3 = nsheet.addRow()
      row_1.setHeightCM(1)
      row_2.setHeightCM(1)
      row_3.setHeightCM(1)

      const cell_1_1 = row_1.addCell()
      const cell_1_2 = row_1.addCell()
      const cell_1_3 = row_1.addCell()
      const cell_1_4 = row_1.addCell()

      cell_1_1.value = req.body.start + '至' + req.body.end + '周工作总结'
      cell_1_1.hMerge = 2
      cell_1_1.vMerge = 1
      cell_1_1.style = h1Style

      cell_1_4.value = '第' + req.body.week + '周'
      cell_1_4.style = pStyle

      const cell_2_1 = row_2.addCell()
      const cell_2_2 = row_2.addCell()
      const cell_2_3 = row_2.addCell()
      const cell_2_4 = row_2.addCell()

      var token = req.headers.token
      var cuser
      if (token) {
        var payload = jwt.decode(token, 'ued');
        cuser = payload.name
      }

      cell_2_4.value = cuser
      cell_2_4.style = pStyle

      const cell_3_1 = row_3.addCell()
      const cell_3_2 = row_3.addCell()
      const cell_3_3 = row_3.addCell()
      const cell_3_4 = row_3.addCell()

      cell_3_1.value = '本周项目'
      cell_3_2.value = '完成状态'
      cell_3_3.value = '下周计划'
      cell_3_4.value = '存在问题'

      cell_3_1.style = h2Style
      cell_3_2.style = h2Style
      cell_3_3.style = h2Style
      cell_3_4.style = h2Style

      for (var i = reqData.length - 1; i >= 0; i--) {
        const row_task = nsheet.addRow()
        row_task.setHeightCM(1)

        const cell_1 = row_task.addCell()
        cell_1.value = reqData[i].project
        cell_1.style = pStyle

        // 第二行
        const cell_2 = row_task.addCell()
        cell_2.value = reqData[i].state
        cell_2.style = pStyle

        // 第二行
        const cell_3 = row_task.addCell()
        cell_3.value = reqData[i].plan
        cell_3.style = pStyle

        const cell_4 = row_task.addCell()
        cell_4.value = reqData[i].problem
        cell_4.style = pStyle

        var cols = nsheet.cols
        var rows = nsheet.rows
        for (var c = cols.length - 1; c >= 0; c--) {
          nsheet.col(c).width = 30
          if (c === 1 || c === 3) nsheet.col(c).width = 15
          for (var r = rows.length - 1; r >= 0; r--) {
            border(nsheet.cell(r, c))
          }
        }
      }
      resolve()
    })
    return printDoc
  }

  var writeXlsxSync = () => {
    var writeXlsx = new Promise((resolve, reject) => {
      excel
        .saveAs()
        .pipe(fs.createWriteStream(dstPath))
        .on('finish', () => {
          resolve()
        });
    })
    return writeXlsx
  }

  getDataSync()
    .then(() => {
      return generateFile()
    })
    .then(() => {
      return writeXlsxSync()
    })
    .then(() => {
      res.send({ resPath: resPath })
    })
})

module.exports = router;