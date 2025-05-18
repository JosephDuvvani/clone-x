import bcrypt from "bcryptjs";
import models from "../models/index.js";
import passport from "passport";

const signup = async (req, res, next) => {
  const { username, password, firstname, lastname } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const data = {
    username,
    password: hashedPassword,
    firstname,
    lastname: lastname.trim() == "" ? null : lastname,
  };

  try {
    await models.User.create(data);
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error signing up new user",
      error: err,
    });
  }
};

const login = (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Authentication error", error: err });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Authentication failed",
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, message: "Login error", error: loginErr });
      }
      return res.json({
        success: true,
        message: "Authentication successful",
        user,
      });
    });
  })(req, res);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Logged out successsfully" });
  });
};

export { signup, login, logout };
