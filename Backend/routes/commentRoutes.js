const express = require("express");
const commentController = require("../controller/commentController");
const authentication = require("../middleware/auth");
const router = express.Router();

// // All routes require authentication
// router.use(authentication.auth);

// // Comment routes
router.get("/tasks/:taskId", commentController.getTaskComments);
router.post("/tasks/:taskId", commentController.createComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
