import express, { Request, Response } from 'express';
import { currentUser } from '@hacommon/common';

const route = express.Router();

route.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser || null });
});


export { route as currentUserRouter };
