const express = require('express');
const expenseController = require('../controller/ExpenseController.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/', authenticate, expenseController.filterByKeyword); // testing: {{url}}/expenses/keyword/?keyword={{keyword}} -> get

module.exports = router;
