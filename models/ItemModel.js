const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    email: { type: String, required: true },
    itemName: { type: String, required: true },
    itemContain: { type: String, required: true },
}, { collection: 'items' });

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;
