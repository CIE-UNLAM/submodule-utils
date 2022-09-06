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
    });
    console.log("FCM initialized");
  }

  public static async sendPushNotification(
    title: string,
    body: string,
    device_token: string
  ): Promise<any> {
    if (!FCM.getInstance()) {
      throw "FCM not initialized";
    }

    const message: Message = {
      notification: {
        title,
        body,
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/cie-develop.appspot.com/o/CRIE-icon.png?alt=media",
      },
      token: device_token,
      android: {
        notification: {
          icon: "@mipmap/ic_launcher_foreground",
        },
      },
    };

    return fireabaseAdmin.messaging().send(message);
  }
}
