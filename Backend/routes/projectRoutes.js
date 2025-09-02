const express = require("express");
const projectController = require("../controller/projectController");
const authentication = require("../middleware/auth");
const app = require("../app");
const router = express.Router();

// router.use(authentication.auth);
router.use(authentication.auth);
router.get("/:id", projectController.getProjectById);

router.use(authentication.restrictTo("admin"));

router.post("/", projectController.createProject);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.get("/", projectController.getAllProjects);
router.post("/:id/addmembers", projectController.addMember);
router.delete("/:id/members/:memberId", projectController.removeMember);

module.exports = router;
