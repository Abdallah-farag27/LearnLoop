const userController = require("../controller/userController");
const router = require("express").Router();


router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
