import { App, applicationDefault, initializeApp } from "firebase-admin/app";
import fireabaseAdmin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import Logger from "./logger"

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
    Logger.info("FCM initialized");
  }

  public static async sendPushNotification(
    title: string,
    body: string,
    deviceToken: string,
  ): Promise<string> {
    if (!FCM.getInstance()) {
      throw "FCM not initialized";
    }

    const message: Message = {
      notification: {
        title,
        body,
        imageUrl: process.env.DEFAULT_ICON_FIREBASE_URL,
      },
      token: deviceToken,
      android: {
        notification: {
          icon: "@mipmap/ic_launcher_foreground",
        },
      },
    };

    return fireabaseAdmin.messaging().send(message);
  }
}
