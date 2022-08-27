import {Session} from "./session";
import {NotificationsAPI} from "./net";
import {NotificationDTO} from "../models/notification";

export function notify(sess: Session, toSend: NotificationDTO) {
    const api = new NotificationsAPI(sess);
    api.post('/api/1/notifications', toSend).catch(err => {
        console.log(`cannot create notification: ${err}`);
    });
}