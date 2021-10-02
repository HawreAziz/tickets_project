import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@hacommon/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@hacommon/common';

const route = express.Router();

route.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 32 })
    .withMessage('Password must be valid')
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    const user = User.build({ email, password });
    await user.save();
    const userJwt = jwt.sign({
      email: user.email,
      id: user._id,
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt
    }
    res.status(201).send(user);
  });

export { route as signupUser };
