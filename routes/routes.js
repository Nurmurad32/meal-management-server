const express = require('express');
const router = express.Router();

const { test, registerUser, loginUser, getProfile, logoutUser, verifyAdmin, allUser, editUser, userDetails, allUserInfo } = require('../controllers/userController');
const { createAItem, allItem, itemDetails, deleteItem, editItem } = require('../controllers/itemController');
const verifyJWT = require('../middleware/authMiddleware');
const { createSetMeal, allSetMeal, setMealDetails, deleteSetMeal, editSetMeal } = require('../controllers/setDailyMealController');
const { createSetMyMeal, allSetMyMeal, setMyMealDetails, editSetMyMeal, deleteSetMyMeal } = require('../controllers/setMyMealController');


router.get('/', test);

router.post('/register', registerUser)
router.get('/all-user', allUser)
router.get('/all-user-info', allUserInfo)
router.get('/user/:id', userDetails)
router.patch('/edit-user/:id', editUser)

router.post('/login', loginUser)
router.post('/profile', getProfile)
router.post('/logout', logoutUser);

router.get('/users/admin/:email', verifyJWT, verifyAdmin);

router.post('/create-item', createAItem)
router.get('/all-item', allItem)
router.get('/items/:id', itemDetails)
router.patch('/items/:id', editItem)
router.delete('/items/:id', deleteItem)


router.post('/create-set-menu', createSetMeal)
router.get('/all-set-menu', allSetMeal)
router.get('/set-menu/:id', setMealDetails)
router.patch('/set-menu/:id', editSetMeal)
router.delete('/set-menu/:id', deleteSetMeal)


router.post('/create-set-my-menu', createSetMyMeal)
router.get('/all-set-my-menu', allSetMyMeal)
router.get('/set-my-menu/:id', setMyMealDetails)
router.patch('/set-my-menu/:id', editSetMyMeal)
router.delete('/set-my-menu/:id', deleteSetMyMeal)


module.exports = router;
