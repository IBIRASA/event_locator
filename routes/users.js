const express = require("express");
const router = express.Router();
const {
  createUser,
  findUserByUsername,
  generateToken,
} = require("../models/user");
const bcrypt = require("bcrypt");
const i18next = require("../utils/i18n");

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      latitude,
      longitude,
      preferredCategories,
      language,
    } = req.body;
    console.log(req.i18n);
    const user = await createUser(
      username,
      password,
      latitude,
      longitude,
      preferredCategories,
      req.i18n.language
    ); // use chosen language or header
    res.status(201).json({
      message: i18next.t("userRegistered", { lng: req.i18n.language }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = generateToken(user);
      res.json({
        message: i18next.t("loginSuccessful", { lng: req.i18n.language }),
        token,
      });
    } else {
      res.status(401).json({
        message: i18next.t("invalidCredentials", { lng: req.i18n.language }),
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
