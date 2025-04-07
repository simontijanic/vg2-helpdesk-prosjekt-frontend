const router = require("express").Router();
const authController = require("../controllers/authController");

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/register", authController.showRegister);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
