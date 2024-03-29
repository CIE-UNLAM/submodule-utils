import {Response} from "express"
import httpStatus from "http-status-codes";
import Logger from "./logger"

export class CustomResponse {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }

    send(res: Response) {
        res.status(this.status).json({status: this.status, message: this.message});
    }
}

export class CustomError extends CustomResponse {
    public original: Error | CustomError | undefined;

    constructor(status: number, message: string, originalError?: Error | CustomError) {
        super(status, message);
        if (originalError instanceof CustomError) {
            this.status = originalError.status;
            this.message = originalError.message;
        }
        this.original = originalError;
    }
}

export function sendHTTPError(res: Response, err: unknown) {
    let error;
    if (err instanceof CustomError) {
        error = <CustomError> err;
    } else {
        // Generic exception
        error = new CustomError(httpStatus.INTERNAL_SERVER_ERROR, (<Error>err).message, <Error>err);
    }
    Logger.error('Origin error -->', error.original);
    error.send(res);
}

export function sendHTTPSuccessMessage(res: Response, message: string) {
    new CustomResponse(httpStatus.OK, message).send(res);
}

export function sendHTTPSuccessWithPayload(res: Response, payload: any) {
    res.status(httpStatus.OK).json(payload);
}