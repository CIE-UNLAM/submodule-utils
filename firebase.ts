import { applicationDefault, initializeApp } from 'firebase-admin/app';
import fireabaseAdmin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

/**
 * Firebase Cloud Messaging
 */
export class FCM {
  constructor() {
    initializeApp({
      credential: applicationDefault(),
    //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
  }

  async sendNotification(
    title: string,
    body: string,
    token: string,
    data?: any,
  ): Promise<void> {
    const message: Message = {
      notification: {
        title,
        body,
      },
      token,
      data,
    };

    await fireabaseAdmin.messaging().send(message);
  }
}
