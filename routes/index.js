const express = require("express")
const router = express.Router();
const verifyToken = require("../middlewares/auth")
const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController")
const userController = require("../controllers/UserController")
const fieldController = require("../controllers/FieldController")
const { validateRegister, validateLogin } = require("../utils/validators/auth");    
const { validateField } = require("../utils/validators/field");

// define route
router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login)

router.get('/admin/users', verifyToken, userController.findUsers);
router.post('/admin/users', verifyToken, userController.createUser);
router.get('/admin/users/:id', verifyToken, userController.findUserById);
router.put("/admin/users/:id", verifyToken, userController.updateUser)
router.delete("/admin/users/:id", verifyToken, userController.deleteUser)

// fields router
router.get('/admin/fields', verifyToken, fieldController.findFieds)
router.post('/admin/fields', verifyToken, validateField, fieldController.createField)
router.get('/admin/fields/:id', verifyToken, fieldController.findFieldById)
router.put('/admin/fields/:id', verifyToken, fieldController.updateField)
router.delete('/admin/fields/:id', verifyToken, fieldController.deleteField)

module.exports = router