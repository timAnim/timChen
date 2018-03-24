var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require("formidable")

// 移动文件需要使用fs模块
router.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var tmp_path = files.file.path;
        var target_path = './public/images/' + files.file.name;
        var res_path = 'http://111.230.237.156/images/' + files.file.name;
        console.log(res_path)
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.send(res_path);
            });
        });
    });
});

module.exports = router;