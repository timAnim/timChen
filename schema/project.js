var mongoose = require('./db.js')
var Schema = mongoose.Schema

var stageSchema = new Schema({
  "title": { type: String },
  "date": { type: Date },
});


var prios = ['high', 'regular', 'low']

var planSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  pname: { type: String },
  puid: { type: String },
  prio: { type: String, enum: prios },
  name: { type: String, required: true },
});


var ProjectSchema = new Schema({
  "name": { type: String, required: true },
  "start": { type: Date, required: true },
  "end": { type: Date, required: true },
  "code": { type: String, unique: true, required: true },
  "cuser": { type: String, required: true },
  "cuid": { type: String, required: true },
  "cover": { type: String },

  "desktop": { type: Boolean, default: false },
  "pad": { type: Boolean, default: false },
  "mobile": { type: Boolean, default: false },

  "material": { type: String },
  "proto": { type: String },
  "design": { type: String },
  "develop": { type: String },
  "product": { type: String },

  "interface": { type: String, default: null },
  "prd": { type: String, default: null },

  stage: [stageSchema],
  plan: [planSchema],
  staff: { type: Array },
});

var ProjectSchemaPlan = {
  // 基本信息
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
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
  cuid: {
    type: String,
    required: true,
  },
  cover: {
    type: String
  },
  staff: { type: Array },
  // 资料
  material: {
    url: {
      type: String,
      default: null,
    },
  },
  // 原型 时间 结果
  prototype: {
    url: {
      type: String,
      default: null,
    },
    end: { type: Date, required: true },
  },
  // 设计：时间 结果
  design: {
    url: {
      type: String,
      default: null,
    },
    end: { type: Date, required: true, },
  },
  // 开发：时间 结果
  develop: {
    url: {
      type: String,
      default: null,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  // 产品：结果 
  product: {
    url: {
      type: String,
      default: null,
    },
  }
}

module.exports = mongoose.model('projects', ProjectSchema, 'projects');