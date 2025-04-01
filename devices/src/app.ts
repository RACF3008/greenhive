import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// importar routers
import { registerDeviceRouter } from "./routes/pair";
import { showDeviceRouter } from "./routes/show";
import { indexDeviceRouter } from "./routes/index";
import { updateDeviceRouter } from "./routes/update";

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
app.use(registerDeviceRouter);
app.use(showDeviceRouter);
app.use(indexDeviceRouter);
app.use(updateDeviceRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
