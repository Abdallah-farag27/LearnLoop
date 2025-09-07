const projectController = require("../controller/projectController");
const Auth = require("../middleware/auth");
const router = require("express").Router();

router.use(Auth.auth);

router.route("/")
.get(projectController.getAllProjects)
.post(Auth.HasPersmissions,projectController.createProject);

router.route('/:projectId')
.get(projectController.getProjectById)
.delete(Auth.HasPersmissions,projectController.deleteProject)
.patch(Auth.HasPersmissions,projectController.updateProject);

router.route('/:projectId/users')
.post(Auth.HasPersmissions,projectController.addMember)
.delete(Auth.HasPersmissions,projectController.removeMember)


module.exports = router;
