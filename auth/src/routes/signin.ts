import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@hacommon/common';
import { PasswordManager } from '../service/password';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@hacommon/common'

import { User } from '../models/user';


const route = express.Router();


route.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage("Email must be valid"),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be valid')
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const matchPassword = await PasswordManager.compare(existingUser.password, password);
    if (!matchPassword) {
      throw new BadRequestError("Invalid credentials");
    }
    const userToken = jwt.sign({ email: existingUser.email, id: existingUser.id }, process.env.JWT_KEY!);
    req.session = {
      jwt: userToken
    };
    res.status(200).send(existingUser);
  });


export { route as signinUser };
