require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const seedData = require('./utils/seedData');

const connectDB = require('./controllers/databaseController');
connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter);

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main');

app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded; // Set user info in locals for views
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }
    next();
});

app.use(authRoutes);
app.use(ticketRoutes);

app.use(dashboardRoutes);
    
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   // seedData.seedAdmin(); // Seed initial data
  console.log('Server is running on port 3000');
});