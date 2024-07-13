const Item = require("../models/ItemModel");
const User = require("../models/userModel");

const createAItem = async (req, res) => {
    try {
        const { email, itemName, itemContain } = req.body.formData;
        console.log(itemName, itemContain)

        const userEmail = await User.findOne({ email });
        if (userEmail.role !== "Admin") {
            return res.json({ error: "You are not an Admin. You cannot add Item." })
        }

        const result = await Item.create({ email, itemName, itemContain })

        return res.json({ status: "Success", data: result });

    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

const allItem = async (req, res) => {
    const result = await Item.find();
    res.json({ status: "Success", data: result });
}

const itemDetails = async (req, res) => {
    const id = req.params.id;
    const query = { _id: id }

    const result = await Item.findOne(query)
    res.json({ status: "Success", data: result });
}

const deleteItem = async (req, res) => {
    const id = req.params.id;
    const query = { _id: id }

    const result = await Item.deleteOne(query)
    res.send(result)
}

const editItem = async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: id };

        const updatedJob = req.body; // Assume the body contains the fields to update
        const jobUpdate = {
            $set: updatedJob
        };

        const options = { new: true }; // Return the updated document

        const result = await Job.findByIdAndUpdate(filter, jobUpdate, options);

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ status: "Success", job: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    createAItem,
    allItem,
    itemDetails,
    deleteItem,
    editItem
}