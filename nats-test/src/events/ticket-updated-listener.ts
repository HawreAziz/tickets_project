import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./listener";
import { Subjects } from "./subjects";
import { TicketUpdatedEvent } from "./ticket-updated-event";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    queueName = "order-service-app";
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    constructor(stan: Stan) {
        super(stan);
        this.listen()
    }

    onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        console.log('Updated data: ', data);
        msg.ack();
    };
}