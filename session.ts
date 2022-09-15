import {randomUUID} from "crypto";
import {User} from "../models/users";
import {UsersAPIWithoutSession} from "./net";
import {RedisClientManager} from "./redis-manager";
import {CustomError} from "./http-response";
import httpStatus from "http-status-codes";

export class SessionManager {
    private static client = RedisClientManager.getInstance();

    static async getSession(access_token: string) {
        let session;
        const data = await this.client.get(access_token);

        if (data != null) {
            session = JSON.parse(data);
        } else {
            new CustomError(httpStatus.UNAUTHORIZED, 'Session not found');
        }

        return session;
    }

    static async addSession(user: User): Promise<Session> {
        let s = new Session(user);
        let ttl = <number> SessionManager.getRoleTTL(s);
        await this.client.set(s.access_token, JSON.stringify(s), {EX: ttl} );

        return s;
    }

    static async deleteSession(access_token: string): Promise<boolean> {
        const data = await this.client.get(access_token);

        if (data != null) {
            this.client.del(access_token).then((r: number)  => {
                if (r != 1) {
                    throw new CustomError(httpStatus.INTERNAL_SERVER_ERROR, 'No se pudo borrar la sesion');
                }
            });
        }

        return true;
    }

    private static getRoleTTL(s: Session) {
        if(this.isRoot(s))
            return process.env.ROOT_REDIS_TTL;
        if(this.isPatient(s))
            return process.env.PATIENT_REDIS_TTL;
        if(this.isStaff(s))
            return process.env.STAFF_REDIS_TTL;

        return 300; // 5 minutos por default como failsafe
    }

    private static isPatient(s: Session) {
        return s.role.includes(Role.PG);
    }

    private static isStaff(s: Session) {
        return s.role.includes(Role.GDP, Role.OBSTETRICIA, Role.GERENCIA, Role.REDES, Role.ADMIN);
    }

    private static isRoot(s: Session) {
        return s.role.includes(Role.ROOT);
    }
}

export async function getRootSession(): Promise<Session> {
    const api = new UsersAPIWithoutSession();
    if (process.env.CLIENT_ID_ROOT && process.env.SECRET_KEY_ROOT) {
        return <Session>await api.get(`/api/1/auth/token?clientID=${process.env.CLIENT_ID_ROOT}&secretKey=${process.env.SECRET_KEY_ROOT}`);
    } else {
        throw 'root credentials are not set'
    }
}

export const Role = {
    ROOT: -1,
    ADMIN: 1,
    PG: 2,
    OBSTETRICIA: 3,
    REDES: 4,
    MONITOR: 5,
    GERENCIA: 6,
    GDP: 7,
    NO_ROL: 999
}

export class Session {
    public access_token: string = "";
    public username: string = "";
    public active: boolean = false;
    public role = [Role.NO_ROL];

    constructor(user: User) {
        this.access_token = randomUUID();
        this.username = user.username;
        this.active = user.active;
        this.role = user.role;
    }
}