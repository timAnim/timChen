var fs = require("fs")
var path = require("path")
var express = require('express');
var router = express.Router();
var root = path.join(__dirname, '../views/static/webStudy')

router.post('/list', function(req, res, next) {
    var pa = fs.readdirSync(root);
    var list = []
    pa.forEach(function(ele, index) {
        var info = fs.statSync(root + "/" + ele)
        var reg = /^[a-zA-Z0-9]/g
        if (info.isDirectory() && reg.test(ele)) {
            list.push(ele)
        }
    })
    res.send(list)
});


module.exports = router;