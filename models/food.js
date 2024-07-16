// models/food.js

const mongoose = require("mongoose");


const foodSchema = new mongoose.Schema({
  name: String,
  isHotCold: Boolean,
});

const Food = mongoose.model("Food", foodSchema); // create model

module.exports = Food;
