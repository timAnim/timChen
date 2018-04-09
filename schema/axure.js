var mongoose = require('./db.js')
var Schema = mongoose.Schema

var AxureSchema = {
  // 基本信息
  name: {
    type: String,
    required: true,
  },
  cdate: {
    type: Date,
    required: true,
  },
  cuser: {
    type: String,
    required: true,
  },
  cover: {
    type: String
  },
  proto: {
    type: String,
    default: null,
  },
  zip: {
    type: String,
    default: null,
  },
}

module.exports = mongoose.model('axure', AxureSchema, 'axure');