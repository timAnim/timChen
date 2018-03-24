var mongoose = require('mongoose');

var blog = mongoose.Schema({
    title: { type: String },
    cuser: { type: String },
    cname: { type: String },
    ctime: { type: Date },
    content: { type: String },
    cover: { type: String },
})

module.exports = mongoose.model('Blog',blog);