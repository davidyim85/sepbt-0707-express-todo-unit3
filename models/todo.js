const mongoose = require('mongoose'); //import the mongooes package

const TodoSchema = mongoose.Schema({
    description: {
        required: true,
        type: String,
    },
    isComplete: {
        required: true,
        type: Boolean,
    },
    duration: {
        required: true,
        type: Number,
        min: 0,
    },
    author: {
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId,
    }
});

const Todo = mongoose.model('todo', TodoSchema);

module.exports = Todo;


