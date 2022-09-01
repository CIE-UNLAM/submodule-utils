import { App, applicationDefault, initializeApp } from "firebase-admin/app";
import fireabaseAdmin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

/**
 * Firebase Cloud Messaging
 */
export class FCM {
  private static instance: App;

  static getInstance() {
    if (!FCM.instance) {
      FCM.init();
    }
    return FCM.instance;
  }

  public static init() {
    FCM.instance = initializeApp({
      credential: applicationDefault(),
      //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
  }

  public static async sendPushNotification(
    title: string,
    body: string,
    device_token: string,
  ): Promise<string> {
    if (!FCM.getInstance()) {
        throw 'FCM not initialized';
    }

    const message: Message = {
      notification: {
        title,
        body,
      },
      token: device_token,
    };

    return fireabaseAdmin.messaging().send(message);
  }
}
