const router = require('express').Router();
const ticketController = require('../controllers/ticketController');
const { isAuthenticated, isUser, isAdmin } = require('../middleware/auth');

// User routes
router.get('/tickets', isAuthenticated, isUser, ticketController.listTickets);
router.get('/tickets/create', isAuthenticated, isUser, ticketController.showCreateForm);
router.post('/tickets/create', isAuthenticated, isUser, ticketController.createTicket);
router.get('/tickets/:id', isAuthenticated, ticketController.viewTicket); // New route
router.post('/tickets/:id/comments', isAuthenticated, ticketController.addComment);

module.exports = router;