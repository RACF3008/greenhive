import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// importar routers
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { verifyRouter } from "./routes/verify";
import { sendVerificationRouter } from "./routes/send-verification";
import { resetPasswordRouter } from "./routes/reset-password";
import { changePasswordRouter } from "./routes/change-password";
import { updateRouter } from "./routes/update";

import { errorHandler, NotFoundError, currentUser } from "@greenhive/common";

const app = express();

app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// Conectar los routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(verifyRouter);
app.use(changePasswordRouter);
app.use(resetPasswordRouter);
app.use(sendVerificationRouter);
app.use(updateRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
