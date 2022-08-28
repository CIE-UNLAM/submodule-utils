import {Session} from "./session";
import axios from "axios";
import {CustomError} from "./http-response";

export class API {
    private readonly session: Session | undefined;
    protected baseURL: string;

    constructor(sess: Session | undefined, baseURL: string) {
        this.session = sess;
        this.baseURL = baseURL;
    }

    get(path: string, query_params: Map<string, string> = new Map<string, string>()): Promise<any> {
        return axios.get(this.prepareURL(path, query_params)).then(response => {
            return response.data;
        }).catch(err => {
            if (axios.isAxiosError(err) && err.response) {
                let local = <CustomError>err.response.data;
                if (!local.status || !local.message) {
                    throw err;
                }
                throw new CustomError(local.status, `HTTP GET request error ${path}: ${local.message}`);
            } else {
                throw err;
            }
        });
    }

    post(path: string, body: any, query_params: Map<string, string> = new Map<string, string>()): Promise<any> {
        return axios.post(this.prepareURL(path, query_params), body).then(response => {
            return response.data;
        }).catch(err => {
            if (axios.isAxiosError(err) && err.response) {
                let local = <CustomError>err.response.data;
                if (!local.status || !local.message) {
                    throw err;
                }
                throw new CustomError(local.status, `HTTP POST request error ${path}: ${local.message}`);
            } else {
                throw err;
            }
        });
    }

    put(path: string, body: any, query_params: Map<string, string> = new Map<string, string>()): Promise<any> {
        return axios.put(this.prepareURL(path, query_params), body).then(response => {
            return response.data;
        }).catch(err => {
            if (axios.isAxiosError(err) && err.response) {
                let local = <CustomError>err.response.data;
                if (!local.status || !local.message) {
                    throw err;
                }
                throw new CustomError(local.status, `HTTP POST request error ${path}: ${local.message}`);
            } else {
                throw err;
            }
        });
    }

    private prepareURL(path: string, query_params: Map<string, string>): string {
        let ret = `${this.baseURL}${path}`;
        if (this.session) {
            ret = ret.concat(`?access_token=${this.session.access_token}`);
        }
        query_params.forEach((v, k) => {
            ret = ret.concat(`&${k}=${v}`);
        });
        return ret;
    }
}

export class UsersAPI extends API {
    constructor(sess: Session) {
        let baseURL = process.env.USERS_SERVICE || '';
        super(sess, baseURL);
    }
}

export class UsersAPIWithoutSession extends API {
    constructor() {
        let baseURL = process.env.USERS_SERVICE || '';
        super(undefined, baseURL);
    }
}

export class WebAPI extends API {
    constructor(sess: Session) {
        let baseURL = process.env.WEB_SERVICE || '';
        super(sess, baseURL);
    }
}

export class MobileAPI extends API {
    constructor(sess: Session) {
        let baseURL = process.env.MOBILE_SERVICE || '';
        super(sess, baseURL);
    }
}

export class NotificationsAPI extends API {
    constructor(sess: Session) {
        let baseURL = process.env.NOTIFICATIONS_SERVICE || '';
        super(sess, baseURL);
    }
}