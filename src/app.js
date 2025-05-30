import express from "express";
import passport from "passport";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cors from "cors";
import prisma from "./db/prisma.js";
import routes from "./routes/index.js";
import initializePassport from "../passport.config.js";
import { configDotenv } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  configDotenv();
}

const app = express();

initializePassport(passport);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    accept: [
      "application/json",
      "application/x-form-urlencoded",
      "multipart/form-data",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", routes.auth);
app.use("/posts", routes.post);
app.use("/users", routes.user);
app.use("/search", routes.search);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
