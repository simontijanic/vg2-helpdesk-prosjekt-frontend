const router = require('express').Router();
const ticketController = require('../controllers/ticketController');
const { auth, isAdmin } = require('../middleware/auth');

// User routes
router.get('/tickets', auth, ticketController.listTickets);
router.get('/tickets/create', auth, ticketController.showCreateForm);
router.post('/tickets/create', auth, ticketController.createTicket);
router.get('/tickets/:id', auth, ticketController.viewTicket);
router.post('/tickets/:id/comments', auth, ticketController.addComment);
router.post("/tickets/:id/resolve", auth, ticketController.markAsResolved); // Ensure this route exists

// Add this new route for status updates (admin only)
router.post('/tickets/:id/status', auth, isAdmin, ticketController.updateStatus);
router.post('/tickets/:id/priority', auth, isAdmin, ticketController.updatePriority);

module.exports = router;