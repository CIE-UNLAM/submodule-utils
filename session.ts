import {randomUUID} from "crypto";
import {User} from "../models/users";
import {UsersAPIWithoutSession} from "./net";

export class SessionManager {
    static sessions = new Map<String, Session>();

    static getSession(access_token: string) {
        return this.sessions.get(access_token);
    }

    static addSession(user: User): Session {
        let s = new Session(user);
        this.sessions.set(s.access_token, s);
        return s;
    }

    static deleteSession(access_token: string): boolean {
        return this.sessions.delete(access_token);
    }
}

export async function getRootSession(): Promise<Session> {
    const api = new UsersAPIWithoutSession();
    if (process.env.CLIENT_ID_ROOT && process.env.SECRET_KEY_ROOT) {
        return <Session>await api.get(`auth/token?clientID=${process.env.CLIENT_ID_ROOT}&secretKey=${process.env.SECRET_KEY_ROOT}`);
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