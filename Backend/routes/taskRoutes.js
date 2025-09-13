const taskController = require("../controller/taskController");
const Auth = require("../middleware/auth");
const router = require("express").Router({ mergeParams: true });
const {uploadDocument} = require("../middleware/upload");

router.use(Auth.auth);

router.route('/')
.get (taskController.getProjectTasks)
.post(Auth.HasPersmissions,uploadDocument.single("file"),taskController.createTask);

router.route('/:taskId')
.get(taskController.getTaskById)
.patch(Auth.HasPersmissions,uploadDocument.single("file"),taskController.updateTask)
.delete(Auth.HasPersmissions,taskController.deleteTask);


//show file or download it
router.get("/:taskId/file",taskController.gettaskfile);

module.exports = router;
