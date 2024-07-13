const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    role: { type: String, required: true },
    status: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'users' });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
