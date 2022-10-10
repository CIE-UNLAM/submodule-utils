import {Session} from "./session";
import {NotificationsAPI} from "./net";
import {NotificationDTO} from "../models/notification";
import Logger from "./logger"

export function notify(sess: Session, toSend: NotificationDTO) {
    const api = new NotificationsAPI(sess);
    api.post('/', toSend).catch(err => {
        Logger.error(`cannot create notification: ${err}`);
    });
}