const express = require('express');
const expenseController = require('../controller/ExpenseController.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/', authenticate, expenseController.filterByCategory); //* */ testing: {{url}}/expenses/category?category={{category}} -> get

module.exports = router;
