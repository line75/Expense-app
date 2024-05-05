// This defines the route for user update, delete, readUser and getUsersById.
const User = require('../models/users.js');
const validateUser = require('../middleware/validation.js');

const readUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            res.status(200).json({users});
        } else {
            res.status(404).json({message: 'Users not found'});
        }
    } catch (err) {
        next(err);
    }
};

const readUserById = async (req, res, next) => {
    try {
        const user = await User.findOne({id: req.params.id});
        if (user) {
            res.status(200).json({user: user});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (err) {
        next(err);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'Missing id parameter' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true } 
        );
        if (updatedUser) {
            res.status(200).json({updatedUser: updatedUser});
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'Missing id parameter.' });
        }
        const delUser = await User.findByIdAndDelete(id);

        if (delUser) {
            res.setHeader('Content-Type', 'application/json');
            res.status(204).json({delUser: delUser});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    readUsers,
    readUserById,
    updateUserById,
    deleteUser
};
