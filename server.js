//all our imports
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./controllers/user');
const todoRouter = require('./controllers/todo');

dotenv.config();
const app = express();


//connection to the db here
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
//


//middleware FOR ALL here
app.use(cors()); //this allows other servers to call our api
app.use(express.json()); //allows JSON data to be sent to our routes
//


////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.use('/users', userRouter); 
app.use('/todos', todoRouter); 
app.get('/', (req, res) => {
    try {
        res.send('hello world')
    } catch (err) {
        res.status(400).json(err)
    }
});
//


app.listen(process.env.PORT, () => {
    console.log(`now listen to port: ${process.env.PORT}`)
})