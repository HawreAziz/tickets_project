import { Message, Stan } from "node-nats-streaming";
import { Subjects } from './subjects';


interface Event {
    subject: Subjects;
    data: {
        title: string;
        id: string;
        price: number;
    }
}

export abstract class Listener<T extends Event> {
    protected abstract subject: T['subject'];
    protected abstract queueName: string;
    protected abstract onMessage(parsedData: T['data'], msg: Message): void;
    private stan: Stan;
    protected ackWait = 5 * 1000;


    constructor(stan: Stan) {
        this.stan = stan;
    }

    subscriptionOptions() {
        return this.stan.subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setDurableName(this.queueName)
            .setAckWait(this.ackWait);
    }

    listen() {
        const subscription = this.stan.subscribe(
            this.subject,
            this.queueName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }


    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }

}