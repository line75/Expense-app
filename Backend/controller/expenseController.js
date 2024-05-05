// This is the route for expense update, delete, create,
// readExpenses, readExpense, filterBycategory, filterByKeywords and filterByDate.
const Expense = require('../models/expense.js');

const createExpense = async (req, res, next) => {
    try {
        const expense = new Expense({
            user_id: req.userData.userId,
            name: req.body.name,
            amount: req.body.amount,
            description: req.body.description,
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
        let query = {};

        // Check if size is provided and valid
        if (req.query.size && parseInt(req.query.size) > 0) {
            query.limit = parseInt(req.query.size);
        }

        // Check if page is provided and valid
        if (req.query.page && parseInt(req.query.page) > 0) {
            const page = parseInt(req.query.page);
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;
            query.skip = skip;
        }

        // Check if sort is provided and valid
        if (req.query.sort) {
            const sortOptions = {};
            if (req.query.sort.includes('date')) {
                sortOptions.date =  parseInt(req.query.sort) === 2 ? 1 : -1;
            }
            if (req.query.sort.includes('name')) {
                sortOptions.name = parseInt(req.query.sort) === 2 ? 1 : -1;
            }

            if (req.query.sort.includes('description') || req.query.sort.includes('desc')) {
                sortOptions.description = parseInt(req.query.sort) === 2 ? 1 : -1;
            }
            query.sort = sortOptions;
        }

        const expenses = await Expense.find({}, {}, query);
        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.status(404).json({ message: 'No expenses found' });
        }
    } catch (err) {
        next(err);
    }
};

const readExpenseById = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            res.status(200).json(expense);
        } else {
            res.status(404).json({ message: 'No expense found' });
        }
    } catch (err) {
        next(err);
    }
}

const filterByCategory = async (req, res, next) => {
    try {
        const category = req.query.category;
        if (!category) {
            return res.status(400).json({ success: false, message: 'No category found' });
        }

        const expenses = await Expense.find({ category: { $regex: new RegExp(category, 'i') }});

        if (expenses.length > 0) {
            res.status(200).json({ success: true, data: expenses });
        } else {
            res.status(404).json({ success: false, message: `No expenses found for the category '${category}'` });
        }
    } catch (err) {
        next(err);
        console.error(err); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const filterByKeyword = async (req, res, next) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).json({ message: 'No keyword found in query parameters' });
        }

        // Construct a regular expression to match the keyword case-insensitively
        const regex = new RegExp(keyword, 'i');

        // Find expenses that match the keyword in the name or description fields
        const expenses = await Expense.find({
            $or: [
                { name: regex },
                { description: regex }
            ]
        });

        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.status(404).json({
                message: `No expenses found matching the keyword '${keyword}' in name or description`,
            });
        }
    } catch (err) {
        next(err);
    }
}

const filterByDate = async (req, res, next) => {
    try {
        // Extract start date and end date from request query
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        // Check if both start date and end date are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Both start date and end date are required in query parameters' });
        }

        // Convert start date and end date strings to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Find expenses that fall within the specified date range
        const expenses = await Expense.find({
            date: { $gte: start, $lte: end }
        });

        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.status(404).json({
                message: `No expenses found within the date range from ${start.toISOString()} to ${end.toISOString()}`,
            });
        }
    } catch (err) {
        next(err);
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
    readExpenseById,
    filterByCategory,
    filterByKeyword,
    filterByDate,
    deleteExpense
}
