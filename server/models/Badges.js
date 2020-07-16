const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BadgeSchema = Schema({
  name: String,
  status: String,

})

const LevelSchema = Schema({
  level: Number,
  prerequisites: [{ type: Schema.Types.ObjectId, ref: 'badge'}]
})

const UserSchema = Schema({
  name: String,
  level: Number,
  badges: [{ type: Schema.Types.ObjectId, ref: 'badge'}],
  intervalAccuracy: [{ interval: Number, accuracy: Number}]
})