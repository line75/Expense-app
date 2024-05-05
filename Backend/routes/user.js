// This defines the endpoint for user.
const express = require('express');
const UserController = require('../controller/userController.js')
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/', authenticate, UserController.readUsers); //* */ testing: {{url}}/profile -> Get all users.
router.get('/:id', authenticate, UserController.readUserById); //* * testing: {{url}}/profile/id
router.put('/', authenticate, UserController.updateUserById); // testing: {{url}}/profile?id={{id}}
router.delete("/del", authenticate, UserController.deleteUser); // testing: {{url}}/profile/del?id={{id}}

module.exports = router;
