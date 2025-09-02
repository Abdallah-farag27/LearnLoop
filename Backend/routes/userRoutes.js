const express = require("express");
const userController = require("../controller/userController");
const authentication = require("../middleware/auth");
const router = express.Router();
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.get(
  "/",
  authentication.auth,
  authentication.restrictTo("admin"),
  userController.getAllUser
);
router.get("/:id", authentication.auth, userController.getUserByID);
router.patch("/:id", userController.updateUser);
router.delete(
  "/:id",

  userController.deleteUser
);
module.exports = router;
