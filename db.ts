import {Sequelize} from 'sequelize';
import 'dotenv/config';

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
            let sess = new Sequelize(url, {logging: true, timezone: '-03:00', dialectOptions: {useUTC: false}});
            console.log("connecting to " + process.env.DATABASE_URL);
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
            console.log(err);
            process.exit(1);
        }
        console.log('db is connected ok!');
        if (sync) {
            console.log('sync db...');
            this.syncDB(afterSync);
        }
    }

    private static syncDB(afterSync: () => void = () => {
    }) {
        if (this.session) {
            this.session.sync({alter: true}).then(ret => {
                console.log('db was sync correct!');
                afterSync();
            });
        }
    }
}
