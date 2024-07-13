const SetMyMeal = require("../models/setMyMealModel");
const User = require("../models/userModel");

const createSetMyMeal = async (req, res) => {
    try {
        const { mealData, email } = req.body;

        console.log(mealData, email)


        // Validate constraints
        const { date, riceItem, items, mealStatus } = mealData;

        // Check if the date is in the past
        const currentDate = new Date();
        const mealDate = new Date(date);
        if (mealDate < currentDate.setHours(0, 0, 0, 0)) {
            return res.json({ error: "Cannot set meal for a past date." });
        }

        // Check if the day is Friday or Saturday
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) { // 5 is Friday, 6 is Saturday
            return res.json({ error: "Friday and Saturday are off days. Meals cannot be set for these days." });
        }

        const existingMeal = await SetMyMeal.findOne({ date, email });
        if (existingMeal) {
            return res.json({ error: `You already created your meal for ${date}.` });
        }


        if (mealStatus === "Yes") {
            if (!riceItem) {
                return res.json({ error: "A meal must have a rice item to be complete." });
            }
            if (items.length < 2) {
                return res.json({ error: "A meal must have at least 3 items to be complete." });
            }

            const itemCategories = items.map(item => item.split('=')[1]);

            const proteinCount = itemCategories.filter(item => item === 'Protein').length;
            if (proteinCount > 1) {
                return res.json({ error: "A meal cannot have two protein sources at a time." });
            }

            // Check if the meal can be scheduled
            const startOfWeek = new Date(date);
            const endOfWeek = new Date(date);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            console.log(startOfWeek, endOfWeek)

            const weekMeals = await SetMyMeal.find({ email, date: { $gte: startOfWeek, $lte: endOfWeek } });

            // Count occurrences of each item within the week
            const itemCounts = {};
            weekMeals.forEach(meal => {
                meal.items.forEach(item => {
                    const [itemName] = item.split('=');
                    if (itemCounts[itemName]) {
                        itemCounts[itemName]++;
                    } else {
                        itemCounts[itemName] = 1;
                    }
                });
            });

            // Check each item against the weekly limit of 2
            const newMealItems = items.map(item => item.split('=')[0]);
            for (const item of newMealItems) {
                if (itemCounts[item] && itemCounts[item] >= 2) {
                    return res.json({ error: `The item "${item}" can only be repeated a maximum of two days in a week.` });
                }
            }
        }


        // Save the meal
        const newMeal = new SetMyMeal({ ...mealData, email });
        await newMeal.save();

        return res.json({ status: "Success", data: newMeal });

    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

const allSetMyMeal = async (req, res) => {
    const result = await SetMyMeal.find().sort({ date: -1 });;
    res.json({ status: "Success", data: result });
}

const setMyMealDetails = async (req, res) => {
    const id = req.params.id;
    const query = { _id: id }

    const result = await SetMyMeal.findOne(query)
    res.json({ status: "Success", data: result });
}

const deleteSetMyMeal = async (req, res) => {
    const id = req.params.id;

    const existingMeal = await SetMyMeal.findOne({ _id: id });

    console.log(existingMeal)

    const currentDate = new Date();
    const mealDate = new Date(existingMeal.date);
    if (mealDate < currentDate.setHours(0, 0, 0, 0)) {
        return res.json({ error: "Cannot delete meal for a past date." });
    }

    const query = { _id: id }

    const result = await SetMyMeal.deleteOne(query)
    res.send(result)
}

const editSetMyMeal = async (req, res) => {
    try {
        const { mealData, email } = req.body;
        const { id } = req.params;

        console.log(mealData, email, id, req.params);

        // Find the existing meal by id
        const existingMeal = await SetMyMeal.findById(id);
        if (!existingMeal) {
            return res.json({ error: "Meal not found." });
        }

        // Check if the email matches
        if (existingMeal.email !== email) {
            return res.json({ error: "You are not authorized to edit this meal." });
        }

        // Validate constraints
        const { date, riceItem, items, mealStatus } = mealData;

        const currentDate = new Date();
        const mealDate = new Date(date);
        if (mealDate < currentDate.setHours(0, 0, 0, 0)) {
            return res.json({ error: "Cannot edit meal for a past date." });
        }


        // Check if the meal status is 'Yes'
        if (mealStatus === "Yes") {
            if (!riceItem) {
                return res.json({ error: "A meal must have a rice item to be complete." });
            }
            if (items.length < 2) {
                return res.json({ error: "A meal must have at least 3 items to be complete." });
            }

            const itemCategories = items.map(item => item.split('=')[1]);

            const proteinCount = itemCategories.filter(item => item === 'Protein').length;
            if (proteinCount > 1) {
                return res.json({ error: "A meal cannot have two protein sources at a time." });
            }

            // Check if the meal can be scheduled
            const startOfWeek = new Date(date);
            const endOfWeek = new Date(date);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            const weekMeals = await SetMyMeal.find({ email, date: { $gte: startOfWeek, $lte: endOfWeek } });

            // Count occurrences of each item within the week
            const itemCounts = {};
            weekMeals.forEach(meal => {
                meal.items.forEach(item => {
                    const [itemName] = item.split('=');
                    if (itemCounts[itemName]) {
                        itemCounts[itemName]++;
                    } else {
                        itemCounts[itemName] = 1;
                    }
                });
            });

            // Check each item against the weekly limit of 2
            const newMealItems = items.map(item => item.split('=')[0]);
            for (const item of newMealItems) {
                if (itemCounts[item] && itemCounts[item] >= 2) {
                    return res.json({ error: `The item "${item}" can only be repeated a maximum of two days in a week.` });
                }
            }
        }

        // Update the meal items and status
        existingMeal.mealStatus = mealStatus;
        existingMeal.riceItem = riceItem;
        existingMeal.items = items;

        // Save the updated meal
        await existingMeal.save();

        return res.json({ status: "Success", data: existingMeal });

    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}


module.exports = {
    createSetMyMeal,
    allSetMyMeal,
    setMyMealDetails,
    editSetMyMeal,
    deleteSetMyMeal,

}