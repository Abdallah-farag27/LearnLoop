const commentController = require("../controller/commentController");
const Auth = require("../middleware/auth");
const router = require("express").Router({ mergeParams: true });

router.use(Auth.auth);

router.route('/')
.get (commentController.getTaskComments)
.post(commentController.createComment);

router.route('/:commentId')
.get(commentController.getCommentbyId)
.patch(commentController.updateComment)
.delete(Auth.HasPersmissions,commentController.deleteComment);

module.exports = router;
