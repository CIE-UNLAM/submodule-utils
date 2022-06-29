import { Client } from "@sendgrid/client";
import SendGrid = require("@sendgrid/mail");
SendGrid.setClient(new Client());
SendGrid.setApiKey(process.env.SENDGRID_API_KEY || "")

export class EmailManager {
    send(input: Email): Promise<boolean> {
        return SendGrid.send(input).then(_ => {
            return true
        }).catch((err) => {
            console.log(err)
            throw err
        })
    }
}

export class Email {
    public to: string
    public from: string
    public subject: string
    public html: string
    public text: string

    constructor(to: string, subject: string, text?: string, html?: string) {
        this.to = to;
        this.subject = subject;
        this.text = text || "";
        this.html = html || "";
        this.from = process.env.SYSTEM_MAIL_ACCOUNT || ""
    }
}