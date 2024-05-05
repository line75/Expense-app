// This is the route for expense update, delete, create,
// readExpenses, readExpense, filterBycategory, filterByKeywords and filterByDate.
const User = require('../models/users.js');
const Expense = require('../models/expense.js');

const createExpense = async (req, res, next) => {
    try {
        const expense = new Expense({
            user_id: req.user.id,
            name: req.body.name,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date
        })
        const newExpense = await expense.save();
        if (newExpense) {
            res.status(201).json(newExpense);
        } else {
            res.status(500).json({message: 'Failed to create expense.'});
        }
    } catch (err) {
        next(err);
    }
}

const updateExpense = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({message: 'Missing id parameter'});
        }

        const updateExpense = await Expense.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (updateExpense) {
            res.status(200).json(updateExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (err) {
        next(err);
    }
}

const readExpenses = async (req, res, next) => {
    try {
        let query = {
            ...(req.query.size && { size: req.query.size }),
            ...(req.query.page && { page: req.query.page }),
            ...(req.query.sort && { sort: req.query.sort })
        };

        const expense = await Expense.find(query);
        if (expense.length > 0) {
            res.status(200).json(expense);
        } else {
            res.status(404).json({ message: 'No expense found'})
        }
    } catch (err) {
        next(err);
    }
};

const readExpense = async (req, res, next) => {
    try {
        const expense = await User.findById(req.params.id);
        if (expense) {
            res.status(200).json(expense);
        } else {
            res.status(404).json({ message: 'No expense found' });
        }
    } catch (err) {
        next(err);
    }
}

const filterBycategory = async (req, res, next) => {
    try {
        const category = req.query.category;
        if (!category) {
            return res.status(400).json({ message: 'No category found' });
        }

        const regex = new RegExp('\\bcategory\\b')

        const expenses = await Expense.find({ category: regex})
        if(expenses.length > 0) {
            res.status(200).json(category);
        } else {
            res.status(404).json({
                message: `No expenses found for the category '${category}'`,
            });
        }
    } catch (err) {
        next(err);
    }
}

const filterByKeywords = async (req, res, next) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).json({ message: 'Missing keywords parameter.'});
        }
        const regex = new RegExp(keyword + 'i')
        const expenses = await Expense.find({ expense_name: regex });
        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.status(404).json({ message: `No expenses found for the keyword: '${keywords}'` });
        }
    } catch (err) {
        next(err);
    }
};

const filterByDate = async (req, res, next) => {
    try {
        const date = req.query.date;
        if (!date) {
            return res.status(400).json({ message: 'Missing date parameter.' });
        }
        const inputdate = new Date(data)

        const expenses = await Expense.find({ expense_date: inputdate });
        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.status(404).json({ message: `No expenses found for the date '${date}'` });
        }
    } catch (err) {
        next(err)
    } 
}


const deleteExpense = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'Missing id parameter.' });
        }
        const delExpense = await Expense.findByIdAndDelete(id);

        if (delExpense) {
            res.status(204).json(delExpense);
        } else {
            res.status(404).json({ message: 'Expense not found.' });
        }
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createExpense,
    updateExpense,
    readExpenses,
    readExpense,
    filterBycategory,
    filterByKeywords,
    filterByDate,
    deleteExpense
}
