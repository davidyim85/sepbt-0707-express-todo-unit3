const express = require('express');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');

const router = express.Router();

// 1. create a middle validates the token
function verifyToken(req, res, next) {
    try {
        // split out the authorization header. Remember its bearer token. This means there is a string "Bearer " in front of the token
        const token = req.headers.authorization.split(' ')[1];
        // verify the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach the verified token to the req.user object
        req.user = decoded;
        // move on to the routes
        next();
    } catch (error) {
        res.token(401).json({ error: 'invalid auth token' });
    }
}

// use that middleware
router.use(verifyToken);

///////////////////////////////////////////////
//////// routes                       ///////// 
///////////////////////////////////////////////

// create a route to get all todos by user
router.get('/', async (req, res) => {
    try {
        const todoList = await Todo.find({ author: req.user._id }); //gets all todos in the db by author
        res.status(200).json(todoList);
    }  catch (error) {
        res.status(400).json({ error: error })
    }
});


//create a route that creates a todo
router.post('/', async (req, res) => {
    try {
        //1. add to the request body object, the author property. The author property needs to be req.user._id. 
        //  Remember the req.user is defined in verifyToken (the middleware)
        req.body.author = req.user._id;
        console.log(req.body)
        //2. create the record in the DB 
        const createdTodo = await Todo.create(req.body);

        //3. send the response
        res.status(201).json(createdTodo);

    }  catch (error) {
        res.status(400).json({ error: error })
    }
});

//create a route that get a todos by id
router.get('/:todoId', async (req, res) => {
    try{
        const foundTodo = await Todo.findById(req.params.todoId);
        if(!foundTodo){
            res.status(404).json({ error: 'todo not found' });
        }
         res.status(200).json(foundTodo);
    }  catch (error) {
        res.status(400).json({ error: error })
    }
});


//create a route to delete by id
router.delete('/:todoId', async (req, res) => {
    try{
        const deletedTodo = await Todo.findByIdAndDelete(req.params.todoId);
        res.status(200).json(deletedTodo);
    }  catch (error) {
        res.status(400).json({ error: error })
    }
});

//create a route to update by id
router.put('/:todoId', async (req, res) => {
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.todoId, req.body);
        res.status(200).json(updatedTodo);
    }  catch (error) {
        res.status(400).json({ error: error })
    }
});

module.exports = router;