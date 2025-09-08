const mongoose = require("mongoose");



const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task must have a title"],
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      required: true,
    },
    description: {
      type:String
    },
    users:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must have an user"] }],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: [true, "Task must belong to a project"],
    },
    dueDate: {
      type: Date,
      required: [true, "Task must have a due date"],
    },
    createdby: {
      type : mongoose.Schema.Types.ObjectId,
      ref: "User",
      required : [true,"Task must have an admin"]
    },
    filepath:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

const Tasks = mongoose.model("Tasks",taskSchema);
module.exports = Tasks;

