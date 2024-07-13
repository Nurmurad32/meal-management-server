const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/routes')

const app = express();
const port = process.env.PORT || 8000;

// CORS configuration
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: 'https://office-meal-management.web.app',
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    // methods: 'GET, POST, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionSuccessStatus: 200
}));
app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));


// DB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


app.use('/', routes)

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));