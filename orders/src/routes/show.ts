import { NotFoundError, requireAuth, AuthorizationError } from "@hacommon/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/order";


const router = Router();


router.get('/api/orders/:orderId', requireAuth, async (request: Request, response: Response) => {
    const order = await Order.findById(request.params.orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== request.currentUser!.id) {
        throw new AuthorizationError("User not authorized");
    }
    response.status(201).send(order);
});

export { router as showOrderRouter };