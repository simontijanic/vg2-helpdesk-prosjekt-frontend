const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Admin only routes
router.get('/dashboard', isAuthenticated, isAdmin, dashboardController.showDashboard);

module.exports = router;