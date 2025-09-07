const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  rating: { 
    type: Number,
    min: 1, max: 5 
  },
  text: {
    type: String
  },
  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Task" 
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" }
  },
  {timstamps : true}
);

//rating text taskid reveiwerid user 

const Reviews = mongoose.model("Reviews",reviewSchema);
module.exports = Reviews;
