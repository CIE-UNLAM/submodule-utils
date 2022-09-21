import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";

// Create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.SPARKPOST_HOST,
    port: process.env.SPARKPOST_PORT || 0,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SPARKPOST_USERNAME || "",
        pass: process.env.SPARKPOST_PASSWORD || "",
    },
} as SMTPTransport.Options);

export class EmailManager {
    async send(input: Email): Promise<boolean> {
        // send mail with defined transport object
        return await transporter.sendMail({
            from: `"Hospital Favaloro" <${input.from}>`, // sender address
            to: input.to,           // list of receivers
            subject: input.subject,
            text: input.text,
            html: input.html,
        }).then(_ => {
            return true;
        }).catch((err) => {
            console.log(err)
            throw err
        });
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