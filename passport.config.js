import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import models from "./src/models/index.js";

function initialize(passport) {
  const LocalStrategy = Strategy;

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await models.User.find(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const clientData = {
          id: user.id,
          username,
          profile: user.profile,
        };

        return done(null, clientData);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await models.User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

export default initialize;
