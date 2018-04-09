var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var Staff = require('../model/staff.js')
var util = require('../public/src/util.js');
const JWT_SECRET = 'ued';
const PSWD_INIT = '123456';

router.post('/find', (req, res, next) => {
    var _id = req.body._id;
    var whereStr = _id ? { _id: _id } : {}
    Staff.find(whereStr, (err, result) => {
        if (err) return next(Error('未查到'))
        util.send(res, result)
    })
});

router.post('/insert', (req, res, next) => {
    req.body.data.password = PSWD_INIT
    new Staff(req.body.data).save((err, result) => {
        if (err) return next(Error('未查到'))
        util.send(res, result)
    })
});

router.post('/remove', (req, res, next) => {
    Staff.remove({ _id: req.body._id }, (err, result) => {
        if (err) return next(Error('未查到'))
        util.send(res, result)
    })
});

router.post('/update', (req, res, next) => {
    Staff.update({ _id: req.body._id }, req.body.data, (err, result) => {
        if (err) return next(Error('未查到'))
        util.send(res, result)
    })
});

router.post('/modify-pswd', (req, res, next) => {

    var user = jwt.decode(req.headers.token, JWT_SECRET);

    Staff.findOne({ uid: user.uid }, (err, user) => {
        if (err) return next(Error('未查到'))

        user.comparePassword(req.body.data.old, (err, isMatch) => {
            if (err) return next(Error('密码解析错误'))
            if (!isMatch) return util.send(res, false)

            user.save((err, result) => {
                if (err) return next(Error('保存错误'))
                util.send(res, result)
            })
        });
    });
});

router.post('/login', (req, res, next) => {
    Staff.findOne({ uid: req.body.uid }, (err, user) => {
        if (err) return next(Error('未查到'))
        if (!user) return util.send(res, false)

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return next(Error('密码解析错误'))
            if (!isMatch) return util.send(res, false)
            var token = jwt.encode(user, JWT_SECRET);
            res.send({
                code: 0,
                data: token,
                user: user,
            })
        });
    });
});

module.exports = router;