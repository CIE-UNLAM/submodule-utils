import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {Appointment} from "../models/appointment";

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
        return await transporter.sendMail({
            from: `"Hospital Favaloro" <${input.from}>`,
            to: input.to, // list of receivers
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

export class EmailRecovery extends Email {
    constructor(to: string, fullName: string, code: number) {
        const subject = 'Recuperación de contraseña';
        const html = `<body style="font-family: Arial, Helvetica, sans-serif">
                        <table style="width:910px;height:310px;padding-left:5%;border-spacing: 0px;">
                            <tbody>
                                <tr>
                                    <td
                                        style="height:60px;color:white;text-align:center;font-size:13pt;font-weight:bold;background-color:#0E5E88;border-radius:16px 16px 0px 0px!important;padding-left:2%;padding-right:2%;">
                                        ¡Recuperar contraseña!
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:5%;color:#707070;font-family:Arial;font-size:10pt;border-spacing:0px;background-color:#F1F5F8;"
                                        valign="top">
                                        <p> Hola ${fullName}</p>
                                        <p>
                                            Para recuperar tu contraseña, ingresa el siguiente código en la aplicación:
                                            <span style="color:#0E5E88;font-weight:bold">${code}</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0 0 0;text-align:center;background-color:#F1F5F8;">
                                        <img src="https://crie.unlam.edu.ar/gestar.png" alt="Gest.ar" style="width:25%;max-width: 150px;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="text-align:center;padding-bottom:5%;color:#707070;font-family:Arial;font-size:7pt;border-spacing:0px;border-radius: 0px 0px 16px 16px;background-color:#F1F5F8;padding:0 5% 4%;">
                                        <p>
                                            Si no has solicitado recuperar tu contraseña, ignora este mensaje. 
                                            Sólo una persona con acceso a tu cuenta de correo puede cambiar tu contraseña.
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>`;
        super(to, subject, '', html);
    }
}

export class EmailWelcome extends Email {
    constructor(to: string, fullName: string) {
        const subject = '¡Bienvenida a Gest.ar!'
        const html = `<body style="font-family: Arial, Helvetica, sans-serif">
                        <table style="width:410px;height:310px;padding-left:5%;border-spacing: 0px;">
                            <tbody>
                                <tr>
                                    <td
                                        style="height:60px;color:white;text-align:center;font-size:13pt;font-weight:bold;background-color:#0E5E88;border-radius:16px 16px 0px 0px!important;padding-left:2%;padding-right:2%;">
                                        ¡Hola ${fullName}, te damos la bienvenida a Gest.ar!
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:7% 0;text-align:center;background-color:#F1F5F8;">
                                        <img src="https://crie.unlam.edu.ar/gestar.png" alt="Gest.ar" style="width:25%;max-width: 150px;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:5%;color:#707070;font-family:Arial;font-size:10pt;border-spacing:0px;border-radius: 0px 0px 16px 16px;background-color:#F1F5F8;"
                                        valign="top">
                                        <p></p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>`;
        super(to, subject, '', html);
    }
}

export class EmailAppointment extends Email {
    constructor(to: string, fullName: string, appointment: Appointment) {
        const subject = 'Nuevo turno asignado'
        const html = ``;
        super(to, subject, '', html);
    }
}