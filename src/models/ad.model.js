const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

let AdSchema = new Schema({
  name: String,
  des: String,
  imgName: String,
  url: String,
  isS: {type: Boolean, default: true},//是否展示
  isA: {type: Boolean, default: true},//是否自动点击
  weight: {type: Number, default: 1},
  disable: {type: Boolean, default: false}
});

AdSchema.plugin(timestamps);
mongoose.model('Ad', AdSchema);
