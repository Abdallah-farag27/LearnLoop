const Comment = require("../model/comment.model");

exports.createComment = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const {author,description} = req.body;
    const comment = {
      taskId,author,description
    };    
    const commentadded = await Comment.create(comment);

    res.status(201).json({  status: "success",data: { commentadded }});
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getCommentbyId = async (req,res) => {
  try{
    const commentId = req.params.commentId; 
    const comment = await Comment.findById(commentId);
    if (!comment){
      return res.status(400).json({status: "fail",message: "Comment not found",});
    }
    return res.status(200).json({  status: "success",data: { comment }});
  }
  catch (err) {
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
    .populate('author','username')
    res.status(200).json({
      status: "success",
      length: comments.length,
      data: { comments}});
  }
  catch (err) {
    res.status(500).json({status: "Fail",message: err.message});
  }
};

exports.updateComment = async (req,res) => {
  try {
  const commentId = req.params.commentId;
  if (!commentId) {
    return res.status(400).json({status: "fail", message: "commentId is required"});}

  const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, {new: true,runValidators: true})
  
  if (!updatedComment) {
    return res.status(404).json({
      status: "fail",
      message: "Comment not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {updatedComment}
  });
} catch (err) {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
}
}

exports.deleteComment = async (req, res) => {
try {
  const id = req.params.commentId;

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
