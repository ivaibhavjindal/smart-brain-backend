const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  imageModels: {
    type: Number,
    default: 0,
    min: 0,
  },
  textModels: {
    type: Number,
    default: 0,
    min: 0,
  },
  images: [String],
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);
