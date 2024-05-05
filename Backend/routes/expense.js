const express = require('express');
const expenseController = require('../controller/expenseController.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/user', authenticate, expenseController.readExpenses); //* */ testing {{url}}/expense
router.get('/:id', authenticate, expenseController.readExpenseById);//* */ testing {{url}}/expense/:id -> get
router.delete('/', authenticate, expenseController.deleteExpense); // testing {{url}}/expense/id={{id}} -> delete
router.post('/:id', authenticate, expenseController.createExpense) //* */ testing: {{url}}/expenses/id -> create 
router.put('/', authenticate, expenseController.updateExpense) //* * testing: {{url}}/expenses/id={{id}} -> update

module.exports = router;
