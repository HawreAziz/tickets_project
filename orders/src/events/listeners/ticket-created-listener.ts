import { TicketCreatedEvent, Listener, Subjects } from "@hacommon/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { queueGroupName } from './queue-groups';


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log("TicketCreatedListener is listening on ", data);
        const ticket = Ticket.build({
            title: data.title,
            price: data.price,
            id: data.id
        });
        await ticket.save();
        msg.ack();
    }
}