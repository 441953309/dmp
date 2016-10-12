const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

let ClickFilterSchema = new Schema({
  ad_id:{type: Schema.Types.ObjectId, ref: 'Ad'},
  ip: String,
  updatedAt: {type: Date, default: Date.now}
});

ClickFilterSchema.plugin(timestamps);
ClickFilterSchema.index({ad_id: 1, ip: 1});
mongoose.model('ClickFilter', ClickFilterSchema);
