const Ticket = require("../models/ticketModel");

const ticketController = {
  showCreateForm: (req, res) => {
    res.render("tickets/create", {
      title: "Create Ticket",
      error: req.query.error,
    });
  },

  createTicket: async (req, res) => {
    try {
      const { priority, ...ticketData } = req.body;
      if (!ticketData.title || !ticketData.description) {
        return res.redirect(
          "/tickets/create?error=Title and description are required"
        );
      }

      const ticket = new Ticket({
        ...ticketData,
        creator: req.user.id,
      });
      await ticket.save();

      res.redirect("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.redirect("/tickets/create?error=Problemer med å lage sak");
    }
  },

  listTickets: async (req, res) => {
    try {
        let tickets;
        
        if (req.user.role === 'admin') {
            // Admin sees all tickets
            tickets = await Ticket.find().populate('creator', 'email');
        } else if (req.user.role === 'first-line') {
            // First line sees tickets assigned to first-line
            tickets = await Ticket.find({ supportLevel: 'first-line' }).populate('creator', 'email');
        } else if (req.user.role === 'second-line') {
            // Second line sees tickets assigned to second-line
            tickets = await Ticket.find({ supportLevel: 'second-line' }).populate('creator', 'email');
        } else {
            // Regular users see their own tickets
            tickets = await Ticket.find({ creator: req.user.id }).populate('creator', 'email');
        }

        res.render(req.user.role === 'admin' ? 'dashboard/index' : 'tickets/list', {
            title: "Tickets",
            tickets,
            user: res.locals.user
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.render("tickets/list", { error: "Failed to load tickets" });
    }
},

  viewTicket: async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('creator', 'email')
            .populate('comments.author', 'email')
            .populate('history.performedBy', 'email');

        if (!ticket) {
            throw new Error("Ticket ble ikke funnet");
        }

        res.render("tickets/view", {
            title: `Ticket #${ticket._id}`,
            ticket,
            user: res.locals.user
        });
    } catch (error) {
        console.error("Problemer med å se ticket:", error);
        res.redirect("/tickets?error=" + encodeURIComponent(error.message));
    }
},

  updateStatus: async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check if user has permission to update this ticket
        if (req.user.role === 'first-line' && ticket.supportLevel !== 'first-line' ||
            req.user.role === 'second-line' && ticket.supportLevel !== 'second-line') {
            return res.redirect(`/tickets/${req.params.id}?error=Not authorized for this support level`);
        }

        ticket.status = req.body.status;
        ticket.history.push({
            action: `Status updated to ${req.body.status}`,
            performedBy: req.user.id
        });

        await ticket.save();
        res.redirect(`/tickets/${req.params.id}?message=Status updated`);
    } catch (error) {
        console.error("Error updating status:", error);
        res.redirect(`/tickets/${req.params.id}?error=${error.message}`);
    }
},

  updatePriority: async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check if user has permission to update this ticket
        if (req.user.role === 'first-line' && ticket.supportLevel !== 'first-line' ||
            req.user.role === 'second-line' && ticket.supportLevel !== 'second-line') {
            return res.redirect(`/tickets/${req.params.id}?error=Not authorized for this support level`);
        }

        ticket.priority = req.body.priority;
        ticket.history.push({
            action: `Priority changed to ${req.body.priority}`,
            performedBy: req.user.id
        });

        await ticket.save();
        res.redirect(`/tickets/${req.params.id}?message=Priority updated`);
    } catch (error) {
        console.error("Error updating priority:", error);
        res.redirect(`/tickets/${req.params.id}?error=${error.message}`);
    }
},

  addComment: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket ble ikke funnet" });
      }

      ticket.comments.push({
        text: req.body.text,
        author: req.user.id,
      });

      await ticket.save();

      res.redirect(`/tickets/${req.params.id}`);
    } catch (error) {
      console.error("Problemer med å legge til kommentar:", error);
      res.redirect(
        `/tickets/${req.params.id}?error=` + encodeURIComponent(error.message)
      );
    }
  },

  markAsResolved: async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket ble ikke funnet" });
        }

        // Update the ticket status to "resolved"
        ticket.status = "resolved";
        ticket.history.push({
            action: "Ticket marked as resolved",
            performedBy: req.user.id,
        });

        await ticket.save();

        res.redirect(`/tickets/${req.params.id}`);
    } catch (error) {
        console.error("Error marking ticket as resolved:", error);
        res.redirect(
            `/tickets/${req.params.id}?error=` + encodeURIComponent(error.message)
        );
    }
},

// Add this new method to ticketController
assignTicket: async (req, res) => {
    try {
        const { supportLevel } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.redirect(`/tickets/${req.params.id}?error=Saken ble ikke funnet`);
        }

        // Update the ticket's support level
        ticket.supportLevel = supportLevel;
        ticket.history.push({
            action: `Assigned to ${supportLevel} support`,
            performedBy: req.user.id
        });

        await ticket.save();
        res.redirect(`/tickets/${req.params.id}?message=Support nivå oppdatert`);
    } catch (error) {
        console.error('Error assigning ticket:', error);
        res.redirect(`/tickets/${req.params.id}?error=Kunne ikke tildele saken`);
    }
}
};

module.exports = ticketController;
