const express = require("express")
const router = express.Router();
const verifyToken = require("../middlewares/auth")
const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController")
const userController = require("../controllers/userController")
const { validateRegister, validateLogin } = require("../utils/validators/auth");    

// define route
router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login)

router.get('/admin/users', verifyToken, userController.findUsers);
router.post('/admin/users', verifyToken, userController.createUser);

module.exports = router