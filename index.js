require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();

const userRoute = require('./routes/userRoute');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main');

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(ticketRoutes);
app.use(userRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});