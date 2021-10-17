import { AuthorizationError, NotFoundError, OrderStatus, requireAuth } from "@hacommon/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/order";


const router = Router();


router.delete('/api/orders/:orderId', requireAuth, async (request: Request, response: Response) => {
    // fetch order from the database
    const order = await Order.findById(request.params.orderId).populate('ticket');

    // if it does not exist return notfound
    if (!order) {
        throw new NotFoundError();
    }

    // make sure it is correct user
    if (request.currentUser!.id !== order.userId) {
        throw new AuthorizationError("User not authorized");
    }

    // cancel the order
    order.status = OrderStatus.Cancelled;
    await order.save()

    // publish that the order was cancelled
    response.status(204).send(order);
});


export { router as cancelOrderRouter };