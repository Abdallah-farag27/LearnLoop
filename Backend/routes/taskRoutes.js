const taskController = require("../controller/taskController");
const Auth = require("../middleware/auth");
const router = require("express").Router({ mergeParams: true });

router.use(Auth.auth);

router.route('/')
.get (taskController.getProjectTasks)
.post(Auth.HasPersmissions,taskController.createTask);

router.route('/:taskId')
.get(taskController.getTaskById)
.patch(Auth.HasPersmissions,taskController.updateTask)
.delete(Auth.HasPersmissions,taskController.deleteTask);

module.exports = router;
