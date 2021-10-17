import { Listener, Subjects, TicketUpdatedEvent } from '@hacommon/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-groups';



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        // fetch the ticket by id
        const ticket = await Ticket.findById(data.id);

        // check existence of ticket
        if (!ticket) {
            throw new Error('Ticket does not exist');
        }

        // it exists update ticket
        const { title, price } = data;
        ticket.set({ title, price });
        ticket.save();
        console.log("TicketUpdated to ", ticket);

        msg.ack();
    }
}