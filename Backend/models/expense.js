const mongoose = require('mongoose');
const Schema = require('mongoose');
const ModelIncrement = require('./increment.js');


const expenseSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Schema.Types.Decimal128,
        required: true
    },
    category: {
        type: String,
        maxLength: 255,
        required: true
    },
    description: String,
    date: {
        type: 'Date',
    },
}, { timestamps: true });

expenseSchema.pre('save', async function(next) {
    if (this.isNew) {
        const id = await ModelIncrement.getNextId('Expense');
        this.id = id;
        next();
    } else {
        next();
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
