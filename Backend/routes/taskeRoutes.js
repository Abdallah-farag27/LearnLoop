const express = require("express");
const taskController = require("../controller/taskController");
const authentication = require("../middleware/auth");
const router = express.Router();

// All routes require authentication
// router.use(authentication.auth);

// Task routes
router.get("/projects/:projectId", taskController.getProjectTasks);
router.post("/projects/:projectId", taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
