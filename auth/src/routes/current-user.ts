import express from 'express';

import { currentUser, NotAuthorizedError } from '@greenhive/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  if (!req.currentUser?.verified) {
    res.send({ currentUser: null });
    return;
  }

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
