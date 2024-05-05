const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const userRoute = require('./routes/user.js');
const expenseRoute = require('./routes/expense.js');
const authRoute = require('./routes/auth.js');
const query1Route = require('./routes/query1.js');
const query2Route = require('./routes/query2.js');
const query3Route = require('./routes/query3.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 4000;

async function connect() {
    try { 
        await mongoose.connect(process.env.URL)
        console.log('connected to Mongodb database');   
    } catch (err) {
        console.log(`No Mongoose connection: ${err.message}`);
    }
}

mongoose.connection.on('error', (err) => {
    console.log(`Error connecting to Mongodb: ${err.message}`)
});

// pasrse JSON.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// user and expense endpoints.
app.use('/profile', userRoute)
app.use('/expense', expenseRoute)

// expense query endpoint.
app.use('/expenses/category', query1Route);

// expense query endpoint for keywords.
app.use('/expenses/keyword', query2Route);

app.use('/expenses/date', query3Route);

// login and register.
app.use('/auth', authRoute);

// Start the server
connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to start server: ${err.message}`);
});

module.exports = app;
