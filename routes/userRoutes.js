const express = require('express');
const app = express();
app.use(express.json()); //middleware
 
const controller = require('../controllers/userController') 
const authController = require('../controllers/authController') 

const router  = express.Router();
 router.route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);   
    
    
router.route('/:id')
    .get(controller.getUserById)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);
//
//
router.route('/login')
    .post(authController.login)
 
module.exports = router;
