import express, { Request, Response } from 'express';

import { Token } from '../models/token';
import { User } from '../models/user';
import { BadRequestError, NotFoundError } from '@greenhive/common';

const router = express.Router();

router.post(
  '/api/users/verify-account/:id',
  async (req: Request, res: Response) => {
    const tokenValue = req.params.id;
    const token = await Token.findOne({ value: tokenValue });

    if (!token) {
      throw new NotFoundError();
    }
    if (token.used) {
      throw new BadRequestError('Token already used');
    }

    const user = await User.findById(token.userId);
    if (!user) {
      throw new NotFoundError();
    }

    user.verified = true;
    await user.save();

    token.used = true;
    await token.save();

    res.status(200).send();
  }
);

export { router as verifyAccountRouter };
