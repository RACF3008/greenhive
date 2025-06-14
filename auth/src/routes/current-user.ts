import express from "express";

import { currentUser } from "@greenhive/common";
import { User } from "../models/user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  if (!req.currentUser?.verified) {
    res.send({ currentUser: null });
    return;
  }

  const user = await User.findById(req.currentUser.id);

  res.send({ currentUser: user || null });
});

export { router as currentUserRouter };
