const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authController = {
  showLogin: (req, res) => {
    res.render("auth/login", {
      title: "Login",
      error: req.query.error,
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.redirect("/login?error=Email and password are required");
      }

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.redirect("/login?error=Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Store token in a cookie
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/login?error=Server error occurred");
    }
  },

  showRegister: (req, res) => {
    res.render("auth/register", {
      title: "Register",
      error: req.query.error,
    });
  },

  register: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.redirect("/register?error=All fields are required");
    }

    try {
      const user = new User(req.body);
      await user.save();

      res.redirect("/login?message=Registration successful");
    } catch (error) {
      console.error(error);
      res.redirect("/register?error=Server error occurred");
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  },
};

module.exports = authController;
