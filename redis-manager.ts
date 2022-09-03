import {RedisClientType} from "@redis/client";
import {createClient} from "redis";
import 'dotenv/config';

export class RedisClientManager {
    private static client : RedisClientType<any>;

    static getInstance() : RedisClientType<any> {
        if (!this.client) {
            this.initDB();
        }
        return this.client;
    }

    static initDB() {
        if (!this.client) {
            const client = createClient({url: process.env.REDIS_CONNECTION_STRING});
            client.on('error', (err) => console.log('Redis Client Error', err));
            client.connect().then(
                // @ts-ignore
                this.client = client)
        }
    }
}