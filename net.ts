import {Session} from "./session";
import axios, {AxiosResponse} from "axios";
import {CustomError} from "./http-response";

export class API {
    private session: Session;
    protected baseURL: string;
    constructor(sess: Session, baseURL: string) {
        this.session = sess;
        this.baseURL = baseURL;
    }

    get(path: string, query_params: Map<string, string> = new Map<string, string>()): Promise<any> {
        return axios.get(this.prepareURL(path, query_params)).then(response => {
            return response;
        }).catch(err => {
            if (axios.isAxiosError(err) && err.response) {
                let local = <CustomError>err.response.data;
                throw new CustomError(local.status, local.message);
            } else {
                throw err;
            }
        });
    }

    private prepareURL(path: string, query_params: Map<string, string>): string {
        let ret = `${this.baseURL}${path}`;
        ret = ret.concat(`?this.access_token=${this.session.access_token}`);
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