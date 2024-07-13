const mongoose = require('mongoose');
const { Schema } = mongoose;

const setMealSchema = new Schema({
    date: { type: Date, required: true },
    riceItem: { type: String, required: true },
    items: { type: [String], required: true },
    email: { type: String, required: true }
}, { collection: 'setMeal' });

const setMealModel = mongoose.model('SetMeal', setMealSchema);

module.exports = setMealModel;
