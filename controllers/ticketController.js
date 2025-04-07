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
      res.redirect("/tickets/create?error=Failed to create ticket");
    }
  },

  listTickets: async (req, res) => {
    try {
        // Query the database for tickets created by the logged-in user
        const tickets = await Ticket.find({ creator: req.user.id });

        res.render("tickets/list", {
            title: "My Tickets",
            tickets,
            user: res.locals.user, // Pass user info from middleware
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.render("tickets/list", {
            title: "My Tickets",
            tickets: [],
            error: "Failed to load tickets",
        });
    }
  },

  viewTicket: async (req, res) => {
    try {
      const token = req.cookies.token; // Get token from cookies
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await fetch(
        `http://localhost:4000/api/tickets/${req.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ticket");
      }

      const ticket = await response.json();

      res.render("tickets/view", {
        title: `Ticket #${ticket._id}`,
        ticket,
        user: res.locals.user, // Pass user info from middleware
      });
    } catch (error) {
      console.error("Error viewing ticket:", error);
      res.redirect("/tickets?error=" + encodeURIComponent(error.message));
    }
  },

  updateStatus: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      ticket.status = req.body.status;
      ticket.history.push({
        action: `Status changed to ${req.body.status}`,
        performedBy: req.user.id,
      });

      await ticket.save();

      res.redirect(`/tickets/${req.params.id}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      res.redirect(
        `/tickets/${req.params.id}?error=` + encodeURIComponent(error.message)
      );
    }
  },

  updatePriority: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Update the priority
      ticket.priority = req.body.priority;
      ticket.history.push({
        action: `Priority changed to ${req.body.priority}`,
        performedBy: req.user.id,
      });

      await ticket.save();

      res.redirect(`/tickets/${req.params.id}`);
    } catch (error) {
      console.error("Error updating ticket priority:", error);
      res.redirect(
        `/tickets/${req.params.id}?error=` + encodeURIComponent(error.message)
      );
    }
  },

  addComment: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      ticket.comments.push({
        text: req.body.text,
        author: req.user.id,
      });

      await ticket.save();

      res.redirect(`/tickets/${req.params.id}`);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.redirect(
        `/tickets/${req.params.id}?error=` + encodeURIComponent(error.message)
      );
    }
  },

  markAsResolved: async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
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
};

module.exports = ticketController;
