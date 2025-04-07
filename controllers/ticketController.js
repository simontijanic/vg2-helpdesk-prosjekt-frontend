const ticketController = {
    showCreateForm: (req, res) => {
        res.render('tickets/create', {
            title: 'Create Ticket',
            error: req.query.error
        });
    },

    createTicket: async (req, res) => {
        try {
            const { title, description, category, priority } = req.body;
            
            // Validate required fields
            if (!title || !description || !category) {
                return res.redirect('/tickets/create?error=All fields are required');
            }

            const response = await fetch('http://localhost:4000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    priority: priority || 'low',
                    status: 'open'
                })
            });

            const data = await response.json();

            if (response.ok) {
                res.redirect('/tickets');
            } else {
                res.redirect('/tickets/create?error=' + encodeURIComponent(data.message));
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            res.redirect('/tickets/create?error=Failed to create ticket');
        }
    },

    listTickets: async (req, res) => {
        try {
            const response = await fetch('http://localhost:4000/api/tickets/my-tickets', {
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });

            const tickets = await response.json();

            res.render('tickets/list', {
                title: 'My Tickets',
                tickets,
                user: req.session.user
            });
        } catch (error) {
            res.render('tickets/list', {
                title: 'My Tickets',
                tickets: [],
                error: 'Failed to load tickets'
            });
        }
    },

    viewTicket: async (req, res) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tickets/${req.params.id}`, {
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });

            const ticket = await response.json();

            if (!response.ok) {
                throw new Error(ticket.message || 'Failed to fetch ticket');
            }

            res.render('tickets/view', {
                title: `Ticket #${ticket._id}`,
                ticket,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error viewing ticket:', error);
            res.redirect('/tickets?error=' + encodeURIComponent(error.message));
        }
    },

    updateStatus: async (req, res) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tickets/${req.params.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: JSON.stringify({ status: req.body.status })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update ticket status');
            }

            res.redirect(`/tickets/${req.params.id}`);
        } catch (error) {
            console.error('Error updating ticket status:', error);
            res.redirect(`/tickets/${req.params.id}?error=` + encodeURIComponent(error.message));
        }
    },

    addComment: async (req, res) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tickets/${req.params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: JSON.stringify({ text: req.body.text })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add comment');
            }

            res.redirect(`/tickets/${req.params.id}`);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.redirect(`/tickets/${req.params.id}?error=` + encodeURIComponent(error.message));
        }
    }
};

module.exports = ticketController;