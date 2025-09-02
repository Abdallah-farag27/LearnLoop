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
    content: {
      type: String,
      required: [true, "Comment must have content"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
