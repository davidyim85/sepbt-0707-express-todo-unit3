const mongoose = require('mongoose'); //import the mongooes package

//schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const Users = mongoose.model('user', UserSchema);

module.exports = Users;
