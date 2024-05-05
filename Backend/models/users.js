const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ModelIncrement = require('./increment.js');

const userSchema = new mongoose.Schema({
    id: {
        type: Number, 
        unique: true,
        // autoIncrement: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255
    },
    age: Number,
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255,
        validate: {
            validator: (value) => {
                // Validating email addresses using regex.
                return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address! Please enter a valid email address.`
        }
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isNew) {
        const id = await ModelIncrement.getNextId('User');
        this.id = id; // Incremented
        next();
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
