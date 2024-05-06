const express = require('express');
const expenseController = require('../controller/ExpenseController.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/', authenticate, expenseController.filterByDate); // testing: {{url}}/expenses/date?date={{date}} -> get
// router.get('/', authenticate, expenseController.filByDate);
module.exports = router;
