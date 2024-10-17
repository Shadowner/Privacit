interface ResolveReject {
    resolve: (value: any | PromiseLike<any>) => void;
    reject: (reason?: any) => void;
}

interface QueuedMessage {
    message: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    retryCount: number;
}

export class MainSocket {
    private socket: WebSocket | null = null;
    private WaitingForReponses: Record<string, ResolveReject> = {};
    private MessageQueue: QueuedMessage[] = [];
    private activeRequests: number = 0;
    private readonly MAX_PARALLEL_REQUESTS = 3; // Nombre maximum de requêtes parallèles
    private readonly MAX_RETRY_ATTEMPTS = 3; // Nombre maximum de tentatives de renvoi
    private connecting: boolean = false;

    constructor(public url: string = "ws://localhost:8765") {
    }

    public connect() {
        return new Promise<void>((resolve, reject) => {
            if (this.connecting) {
                return;
            }
            this.connecting = true;
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                resolve();
                this.connecting = false;
                return;
            }
            this.socket?.close();
            this.socket = null;
            this.socket = new WebSocket(this.url);
            this.socket.onopen = () => {
                this.connecting = false;
                console.log("Connected");
                resolve();
                this.processQueue(); // Commencer à traiter la file d'attente après la connexion
            };
            this.socket.onmessage = (event) => {
                try {
                    console.log("Message received", event);
                    const message = JSON.parse(event.data);
                    this.receiveMessage(message);
                } catch (error) {
                    console.error("Error while parsing message", error);
                }
            };

            this.socket.onclose = () => {
                console.log("Socket closed");
            }
        });
    }


    public async sendMessage<T extends any>(message: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.MessageQueue.push({ message, resolve, reject, retryCount: 0 });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            await this.connect();
        }

        while (this.MessageQueue.length > 0 && this.activeRequests < this.MAX_PARALLEL_REQUESTS) {
            const queuedMessage = this.MessageQueue.shift()!;
            this.activeRequests++;

            this.sendQueuedMessage(queuedMessage).finally(() => {
                this.activeRequests--;
                this.processQueue(); // Continuer à traiter la file d'attente
            });
        }
    }

    private async sendQueuedMessage(queuedMessage: QueuedMessage) {
        const { message, resolve, reject, retryCount } = queuedMessage;

        if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
            reject(new Error("Max retry attempts reached"));
            return;
        }

        try {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                await this.connect();
            }

            console.log("Sending message", message);
            const __id = crypto.getRandomValues(new Uint32Array(1))[0].toString();
            const messageToSend = { ...message, __id };

            this.socket!.send(JSON.stringify(messageToSend));
            this.WaitingForReponses[__id] = { resolve, reject };

            setTimeout(() => {
                if (this.WaitingForReponses[__id]) {
                    delete this.WaitingForReponses[__id];
                    this.MessageQueue.push({ ...queuedMessage, retryCount: retryCount + 1 });
                    this.processQueue();
                }
            }, 150000); // 10 secondes de timeout

        } catch (error) {
            console.error("Error while sending message", error);
            this.MessageQueue.push({ ...queuedMessage, retryCount: retryCount + 1 });
            this.processQueue();
        }
    }

    public receiveMessage(message: any) {
        console.log("Message received", message);
        try {
            const resolveReject = this.WaitingForReponses[message.__id];
            if (!resolveReject) {
                console.error("No resolve/reject found for message", message);
                return;
            }
            if (message.__error) {
                resolveReject.reject(message.__error);
            } else {
                resolveReject.resolve(message);
            }
            delete this.WaitingForReponses[message.__id];
        } catch (error) {
            console.error("Error while parsing message", error);
        }
    }
}