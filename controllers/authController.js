const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authController = {
  showLogin: (req, res) => {
    res.render("auth/login", {
      title: "Logg Inn",
      error: req.query.error,
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!email || !emailRegex.test(email)) {
        return res.redirect("/login?error=Ugyldig e-postadresse");
      }

      // Validate password exists
      if (!password) {
        return res.redirect("/login?error=Passord er påkrevd");
      }

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user || !(await user.comparePassword(password))) {
        return res.redirect("/login?error=Ugyldig e-post eller passord");
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.redirect("/");
    } catch (error) {
      console.error("Innloggingsfeil:", error);
      res.redirect("/login?error=Det oppstod en feil ved innlogging");
    }
  },

  showRegister: (req, res) => {
    res.render("auth/register", {
      title: "Registrer Deg",
      error: req.query.error,
    });
  },

  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!email || !emailRegex.test(email)) {
        return res.redirect("/register?error=Ugyldig e-postadresse");
      }

      // Validate password length
      if (!password || password.length < 6) {
        return res.redirect("/register?error=Passord må være minst 6 tegn langt");
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.redirect("/register?error=E-postadressen er allerede i bruk");
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        role: 'user'
      });

      await user.save();

      res.redirect("/login?message=Registrering vellykket! Du kan nå logge inn.");
    } catch (error) {
      console.error("Registreringsfeil:", error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.redirect("/register?error=" + encodeURIComponent(messages.join('. ')));
      }
      res.redirect("/register?error=Det oppstod en feil ved registrering");
    }
  },

  logout: (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.redirect("/");
  },
};

module.exports = authController;
