const express = require('express');
const expenseController = require('../controller/expenseController.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

// router.get('/', expenseController.readExpenses);
router.get('/:id', authenticate, expenseController.readExpense);
router.delete('/', authenticate, expenseController.deleteExpense); // testing {{url}}/expense/id={{id}} -> delete
router.post('/:id', authenticate, expenseController.createExpense) // testing: {{url}}/expenses/user_id -> create 
router.put('/', authenticate, expenseController.updateExpense) // testing: {{url}}/expenses/id={{id}} -> update
router.get('/category', authenticate, expenseController.filterBycategory); // testing: {{url}}/expenses/category?category={{category}} -> get
router.get('/name', authenticate, expenseController.filterByKeywords); // testing: {{url}}/expenses/name?keyword={{keyword}} -> get
router.get('/date', authenticate, expenseController.filterByDate); // testing: {{url}}/expenses/date?date={{date}} -> get


module.exports = router;
