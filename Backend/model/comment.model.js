const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Comment must belong to a task"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must have an author"],
    },
    description: {
      type: String,
      required: [true, "Comment must have content"],
    },
  },
  {
    timestamps: true
  }
);

const Comments = mongoose.model("Comments",commentSchema);
module.exports = Comments;

