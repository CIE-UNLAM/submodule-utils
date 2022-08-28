import {Request} from "express";
import {validationResult} from "express-validator";
import {CustomError} from "./http-response";
import httpStatus from "http-status-codes";

export function validateInput(req: Request) {
    if (!validationResult(req).isEmpty()) {
        throw new CustomError(httpStatus.INTERNAL_SERVER_ERROR,
            "Error de validación de tipos para "
            + validationResult(req).array().map((x: { param: any; }) => x.param).join(', ')
            + ". Asegúrese de que haya ingresado los valores correctamente");
    }
}