const userController = require("../controller/userController");
const router = require("express").Router();
const {uploadImage}  = require("../middleware/upload");


router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refreshtoken',userController.refreshToken)
router.post("/:id/uploadimg",uploadImage.single("user_img"), userController.uploadPersonalImg);

module.exports = router;
