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
        

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await user.comparePassword(password))) {
            return res.redirect("/login?error=Ugyldig e-post eller passord");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Add specific cookie settings for VM environment
        res.cookie("token", token, { 
            httpOnly: true,
            secure: false, // Important for HTTP
            sameSite: 'lax',
            path: '/',
            domain: req.hostname // Add this
        });
        
        res.redirect("/");
    } catch (error) {
        console.error("Login error details:", error); // Enhanced error logging
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

  showIndexPage: (req, res) => {
    res.render("index", {
      title: "Hjem",
      user: res.locals.user,
    });
  },

  showGuide: (req, res) => {
    res.render("help/guide", {
      title: "Brukermanual",
      user: res.locals.user,
    });
  },

  logout: (req, res) => {
    // Clear cookie with same settings as when setting it
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        domain: req.hostname
    });
    console.log('Cookie cleared'); // Debug log
    res.redirect("/");
  },
};

module.exports = authController;
