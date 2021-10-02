import nats, { Stan } from 'node-nats-streaming';


class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Client must be initialized');
        }
        return this._client;
    }

    connect(clusterID: string, clientID: string, url: string) {
        this._client = nats.connect(clusterID, clientID, { url });


        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Event connected to NATS');
                resolve();
            });
            this.client.on('error', (error) => {
                reject(error);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();