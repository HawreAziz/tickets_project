import { Message, Stan } from 'node-nats-streaming';
import { Listener } from './listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueName = "order-service-app"

    constructor(stan: Stan) {
        super(stan);
        this.listen();
    }

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('parsed data is', data);
        msg.ack();
    }
}