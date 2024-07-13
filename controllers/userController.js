const { hashPassword, comparePassword } = require("../helpers/auth");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json("Office Meal Management is working")
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, status, contact } = req.body.formData;
        console.log(req.body, name, email, password, role, status, contact)
        // Check Password
        if (!password || password.length < 6) {
            return res.json({ error: "Password is required and should be at least 6 characters" })
        }
        // Check Email
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({ error: "Email is taken already" })
        }

        const hahPassword = await hashPassword(password)

        const user = await User.create({ name, email, password: hahPassword, role, status, contact })

        return res.json({ status: "Success", user: user });

    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

const allUserInfo = async (req, res) => {
    const result = await User.find();
    res.json({ status: "Success", data: result });
}

// Backend Controller (e.g., userController.js)
const allUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.search || '';

    try {
        let query = {};
        if (searchQuery) {
            query = {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } }
                ]
            };
        }

        const result = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = await User.countDocuments(query);

        res.json({
            status: "Success",
            data: result,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};


const userDetails = async (req, res) => {
    const id = req.params.id;
    const query = { _id: id }

    const result = await User.findOne(query)
    res.json({ status: "Success", data: result });
}

const editUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, contact, role, status, password } = req.body;
        const filter = { _id: id };

        const updatedUser = {
            name,
            email,
            contact,
            role,
            status,
        };

        // If password is provided, hash it
        if (password) {
            const hashedPassword = await hashPassword(password);
            updatedUser.password = hashedPassword;
        }

        const options = { new: true }; // Return the updated document

        const result = await User.findByIdAndUpdate(filter, { $set: updatedUser }, options);

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ status: "Success", user: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body.formData;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "No user found" })
        }

        // Check if the user is banned
        if (user.status === "Banned") {
            return res.json({ error: "You are banned. Please contact your office admin." });
        }

        const match = await comparePassword(password, user.password)
        if (match) {
            // res.json("Password match")
            jwt.sign(
                { email: user.email, id: user._id, name: user.name },
                process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(user)
                })
        }
        if (!match) {
            return res.json({ error: "Password do not match" })
        }

    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

const getProfile = async (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)

        })
    } else {
        res.json(null)
    }
}

const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
};

const verifyAdmin = async (req, res) => {
    const email = req.params.email;
    console.log(email)
    console.log(req.decoded.email)

    if (req.decoded.email !== email) {
        return res.status(403).json({ admin: false });
    }

    try {
        const user = await User.findOne({ email });
        const isAdmin = user?.role === 'Admin';
        res.json({ admin: isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    verifyAdmin,
    allUser,
    editUser,
    userDetails,
    allUserInfo
}