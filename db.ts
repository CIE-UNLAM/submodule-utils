import {Sequelize} from 'sequelize';
import 'dotenv/config';
import Logger from "./logger"

export class DBManager {
    private static session: Sequelize;

    static getInstance(): Sequelize {
        if (!this.session) {
            this.initDB();
        }
        return this.session;
    }

    static initDB() {
        // https://sequelize.org/docs/v6/getting-started/
        if (!this.session) {
            const url = process.env.DATABASE_URL || "";
            let sess = new Sequelize(url, {logging: true});
            Logger.info(`connecting to ${process.env.DATABASE_URL}`);
            this.session = sess;
        }
    }

    static async validateDB(sync = true, afterSync: () => void = () => {
    }) {
        if (!this.session) {
            this.initDB();
        }
        try {
            await this.session.authenticate();
        } catch (err) {
            Logger.error(err);
            process.exit(1);
        }
        Logger.info('db is connected ok!');
        if (sync) {
            Logger.info('sync db...');
            this.syncDB(afterSync);
        }
    }

    private static syncDB(afterSync: () => void = () => {
    }) {
        if (this.session) {
            this.session.sync({alter: true}).then(ret => {
                Logger.info('db was sync correct!');
                afterSync();
            });
        }
    }
}
