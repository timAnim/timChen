var express = require('express');
var router = express.Router();
var Blog = require('./../schema/blog.js')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
var db = mongoose.connection

router.post('/list', function(req, res, next) {
    Blog.find((err, list) => {
        if (err) return console.log(err);
        res.send(list)
    });
});

router.post('/find', function(req, res, next) {
    var where = { _id: req.body._id }
    Blog.findOne(where, (err, list) => {
        if (err) return console.log(err);
        res.send(list)
    });
});

router.post('/upadd', function(req, res, next) {
    if (!req.body.blog._id) req.body.blog._id = new mongoose.Types.ObjectId()
    var where = { _id: req.body.blog._id }
    Blog.update(where, req.body.blog, { upsert: true }, err => {
        if (err) return console.log(err);
        res.send({ data: '操作成功' });
    })
});

router.post('/remove', function(req, res, next) {
    var where = { _id: req.body._id }
    Blog.remove(where, err => {
        if (err) return
        res.send({ data: '删除成功' });
    })
});

module.exports = router;