const mongoose = require('mongoose');
const { Schema } = mongoose;

const setMyMealSchema = new Schema({
    mealStatus: { type: String, required: true },
    date: { type: Date, required: true },
    riceItem: { type: String },
    items: { type: [String] },
    email: { type: String, required: true }
}, { collection: 'setMyMeal' });

const setMyMealModel = mongoose.model('SetMyMeal', setMyMealSchema);

module.exports = setMyMealModel;
