const userController = require("../controller/userController");
const router = require("express").Router();
const { uploadImage } = require("../middleware/upload");
const { auth } = require("../middleware/auth");


router.route("/")
  .get(userController.getAllUsers)
  .patch(auth, uploadImage.single("user_img"), userController.updateUser);


router.route('/:id')
  .get(userController.getUserByID)
  .delete(auth, userController.deleteUser);


router.post("/signup", uploadImage.single("user_img"), userController.signup);
router.post('/login', userController.login);
router.post('/refreshtoken', userController.refreshToken)


module.exports = router;
