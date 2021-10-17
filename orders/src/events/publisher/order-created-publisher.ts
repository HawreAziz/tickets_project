import { Publisher, OrderCreatedEvent, OrderStatus, Subjects } from '@hacommon/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}


