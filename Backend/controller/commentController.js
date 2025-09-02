const Comment = require("../model/comment.model");

exports.createComment = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const comment = {
      taskId,
      author: req.body.author,
      content: req.body.content,
    };
    const newComment = await Comment.create(comment);

    const populatedComment = await Comment.findById(newComment._id)
      .populate("author", "username")
      .populate("taskId", "title");

    res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      data: { comment: populatedComment },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTaskComments = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(400).json({
        status: "fail",
        message: "taskId is required",
      });
    }
    const comments = await Comment.find({ taskId })
      .populate("author", "username")
      .populate("taskId", "title");
    res.status(200).json({
      status: "success",
      length: comments.length,
      data: {
        comments,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Comment ID is required",
      });
    }

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({
        status: "fail",
        message: "Comment not found",
      });
    }

    res.status(204).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
