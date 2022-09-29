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
    async send(input: Email): Promise<boolean | void> {
        return await transporter.sendMail({
            from: `"Hospital Favaloro" <${input.from}>`,
            to: input.to, // list of receivers
            subject: input.subject,
            text: input.text,
            html: input.html,
        }).then(_ => {
            return true;
        }).catch((err) => {
            console.log('an error occurred while sending the email:');
            console.log(err);
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
                                        <p> Hola ${fullName}:</p>
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
                                        <p>Te damos la bienvenida al programa de Control Remoto Integral del Embarazo (CRIE) del hospital Dr. René Favaloro. 
                                            Tu participación activa en esto es muy importante y queremos contarte que estamos cuidándote a vos y a tu beba/e.
                                            Esta aplicación no reemplaza los controles presenciales, sino que buscan darte información elaborada especialmente por nuestro equipo de profesionales sobre el estado de tu gestación y hacer un seguimiento mediante los reportes semanales que debes completar de manera periódica y que puedas recibir a partir de ello recomendaciones y alertas sobre situaciones que requieran que asistas a una guardia</p>
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
        const html = `<body style="font-family: Arial, Helvetica, sans-serif">
                        <table style="width:410px;height:310px;padding-left:5%;border-spacing: 0px;">
                            <tbody>
                                <tr>
                                    <td
                                        style="height:60px;color:white;text-align:center;font-size:13pt;font-weight:bold;background-color:#0E5E88;border-radius:16px 16px 0px 0px!important;padding-left:2%;padding-right:2%;">
                                        ¡Nuevo turno asignado!
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:5%;color:#707070;font-family:Arial;font-size:11pt;border-spacing:0px;background-color:#F1F5F8;"
                                        valign="top">
                                        <p> Hola ${fullName}: </p>
                                        <p> Tenes un nuevo turno asignado el dia ${appointment.date} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:7% 0;text-align:center;background-color:#F1F5F8;">
                                        <image width="25%" height="auto"
                                            src="https://crie.unlam.edu.ar/static/media/icon-gestar.eea6d78549107f11598a.png"
                                            style="max-width: 150px;" />
                                        <p style="color:#0E5E88;font-weight: 600;font-size:12pt;margin-top: 5px;">
                                            <svg width="25%" height="auto" viewBox="0 0 227 49" fill="none"
                                                xmlns="http://www.w3.org/2000/svg" style="max-width: 150px;">
                                                <path
                                                    d="M32.3466 16.5C32.0284 15.3939 31.5814 14.4167 31.0057 13.5682C30.4299 12.7045 29.7254 11.9773 28.892 11.3864C28.0739 10.7803 27.1345 10.3182 26.0739 10C25.0284 9.68182 23.8693 9.52273 22.5966 9.52273C20.2178 9.52273 18.1269 10.1136 16.3239 11.2955C14.536 12.4773 13.142 14.197 12.142 16.4545C11.142 18.697 10.642 21.4394 10.642 24.6818C10.642 27.9242 11.1345 30.6818 12.1193 32.9545C13.1042 35.2273 14.4981 36.9621 16.3011 38.1591C18.1042 39.3409 20.233 39.9318 22.6875 39.9318C24.9148 39.9318 26.8163 39.5379 28.392 38.75C29.983 37.947 31.1951 36.8182 32.0284 35.3636C32.8769 33.9091 33.3011 32.1894 33.3011 30.2045L35.3011 30.5H23.3011V23.0909H42.7784V28.9545C42.7784 33.0455 41.9148 36.5606 40.1875 39.5C38.4602 42.4242 36.0814 44.6818 33.0511 46.2727C30.0208 47.8485 26.5511 48.6364 22.642 48.6364C18.2784 48.6364 14.4451 47.6742 11.142 45.75C7.83902 43.8106 5.26326 41.0606 3.41477 37.5C1.58144 33.9242 0.664773 29.6818 0.664773 24.7727C0.664773 21 1.21023 17.6364 2.30114 14.6818C3.4072 11.7121 4.95265 9.19697 6.9375 7.13636C8.92235 5.07576 11.233 3.50757 13.8693 2.43182C16.5057 1.35606 19.3617 0.81818 22.4375 0.81818C25.0739 0.81818 27.5284 1.20454 29.8011 1.97727C32.0739 2.73485 34.089 3.81061 35.8466 5.20454C37.6193 6.59848 39.0663 8.25757 40.1875 10.1818C41.3087 12.0909 42.0284 14.197 42.3466 16.5H32.3466ZM65.8977 48.6818C62.3068 48.6818 59.2159 47.9545 56.625 46.5C54.0492 45.0303 52.0644 42.9545 50.6705 40.2727C49.2765 37.5758 48.5795 34.3864 48.5795 30.7045C48.5795 27.1136 49.2765 23.9621 50.6705 21.25C52.0644 18.5379 54.0265 16.4242 56.5568 14.9091C59.1023 13.3939 62.0871 12.6364 65.5114 12.6364C67.8144 12.6364 69.9583 13.0076 71.9432 13.75C73.9432 14.4773 75.6856 15.5758 77.1705 17.0455C78.6705 18.5152 79.8371 20.3636 80.6705 22.5909C81.5038 24.803 81.9205 27.3939 81.9205 30.3636V33.0227H52.4432V27.0227H72.8068C72.8068 25.6288 72.5038 24.3939 71.8977 23.3182C71.2917 22.2424 70.4508 21.4015 69.375 20.7955C68.3144 20.1742 67.0795 19.8636 65.6705 19.8636C64.2008 19.8636 62.8977 20.2045 61.7614 20.8864C60.6402 21.553 59.7614 22.4545 59.125 23.5909C58.4886 24.7121 58.1629 25.9621 58.1477 27.3409V33.0455C58.1477 34.7727 58.4659 36.2652 59.1023 37.5227C59.7538 38.7803 60.6705 39.75 61.8523 40.4318C63.0341 41.1136 64.4356 41.4545 66.0568 41.4545C67.1326 41.4545 68.1174 41.303 69.0114 41C69.9053 40.697 70.6705 40.2424 71.3068 39.6364C71.9432 39.0303 72.428 38.2879 72.7614 37.4091L81.7159 38C81.2614 40.1515 80.3295 42.0303 78.9205 43.6364C77.5265 45.2273 75.7235 46.4697 73.5114 47.3636C71.3144 48.2424 68.7765 48.6818 65.8977 48.6818ZM117.284 23.0455L108.42 23.5909C108.269 22.8333 107.943 22.1515 107.443 21.5455C106.943 20.9242 106.284 20.4318 105.466 20.0682C104.663 19.6894 103.701 19.5 102.58 19.5C101.08 19.5 99.8144 19.8182 98.7841 20.4545C97.7538 21.0758 97.2386 21.9091 97.2386 22.9545C97.2386 23.7879 97.572 24.4924 98.2386 25.0682C98.9053 25.6439 100.049 26.1061 101.67 26.4545L107.989 27.7273C111.383 28.4242 113.913 29.5455 115.58 31.0909C117.246 32.6364 118.08 34.6667 118.08 37.1818C118.08 39.4697 117.405 41.4773 116.057 43.2045C114.723 44.9318 112.89 46.2803 110.557 47.25C108.239 48.2045 105.564 48.6818 102.534 48.6818C97.9129 48.6818 94.2311 47.7197 91.4886 45.7955C88.7614 43.8561 87.1629 41.2197 86.6932 37.8864L96.2159 37.3864C96.5038 38.7955 97.2008 39.8712 98.3068 40.6136C99.4129 41.3409 100.83 41.7045 102.557 41.7045C104.254 41.7045 105.617 41.3788 106.648 40.7273C107.693 40.0606 108.223 39.2045 108.239 38.1591C108.223 37.2803 107.852 36.5606 107.125 36C106.398 35.4242 105.277 34.9848 103.761 34.6818L97.7159 33.4773C94.3068 32.7955 91.7689 31.6136 90.1023 29.9318C88.4508 28.25 87.625 26.1061 87.625 23.5C87.625 21.2576 88.2311 19.3258 89.4432 17.7045C90.6705 16.0833 92.3902 14.8333 94.6023 13.9545C96.8295 13.0758 99.4356 12.6364 102.42 12.6364C106.83 12.6364 110.299 13.5682 112.83 15.4318C115.375 17.2955 116.86 19.8333 117.284 23.0455ZM142.744 13.0909V20.3636H121.722V13.0909H142.744ZM126.494 4.72727H136.176V37.2727C136.176 38.1667 136.313 38.8636 136.585 39.3636C136.858 39.8485 137.237 40.1894 137.722 40.3864C138.222 40.5833 138.797 40.6818 139.449 40.6818C139.903 40.6818 140.358 40.6439 140.812 40.5682C141.267 40.4773 141.616 40.4091 141.858 40.3636L143.381 47.5682C142.896 47.7197 142.214 47.8939 141.335 48.0909C140.456 48.303 139.388 48.4318 138.131 48.4773C135.797 48.5682 133.752 48.2576 131.994 47.5455C130.252 46.8333 128.896 45.7273 127.926 44.2273C126.956 42.7273 126.479 40.8333 126.494 38.5455V4.72727ZM154.71 48.5909C153.21 48.5909 151.922 48.0606 150.847 47C149.786 45.9242 149.256 44.6364 149.256 43.1364C149.256 41.6515 149.786 40.3788 150.847 39.3182C151.922 38.2576 153.21 37.7273 154.71 37.7273C156.165 37.7273 157.438 38.2576 158.528 39.3182C159.619 40.3788 160.165 41.6515 160.165 43.1364C160.165 44.1364 159.907 45.053 159.392 45.8864C158.892 46.7045 158.233 47.3636 157.415 47.8636C156.597 48.3485 155.695 48.5909 154.71 48.5909ZM178.068 48.6591C175.841 48.6591 173.856 48.2727 172.114 47.5C170.371 46.7121 168.992 45.553 167.977 44.0227C166.977 42.4773 166.477 40.553 166.477 38.25C166.477 36.3106 166.833 34.6818 167.545 33.3636C168.258 32.0455 169.227 30.9848 170.455 30.1818C171.682 29.3788 173.076 28.7727 174.636 28.3636C176.212 27.9545 177.864 27.6667 179.591 27.5C181.621 27.2879 183.258 27.0909 184.5 26.9091C185.742 26.7121 186.644 26.4242 187.205 26.0455C187.765 25.6667 188.045 25.1061 188.045 24.3636V24.2273C188.045 22.7879 187.591 21.6742 186.682 20.8864C185.788 20.0985 184.515 19.7045 182.864 19.7045C181.121 19.7045 179.735 20.0909 178.705 20.8636C177.674 21.6212 176.992 22.5758 176.659 23.7273L167.705 23C168.159 20.8788 169.053 19.0455 170.386 17.5C171.72 15.9394 173.439 14.7424 175.545 13.9091C177.667 13.0606 180.121 12.6364 182.909 12.6364C184.848 12.6364 186.705 12.8636 188.477 13.3182C190.265 13.7727 191.848 14.4773 193.227 15.4318C194.621 16.3864 195.72 17.6136 196.523 19.1136C197.326 20.5985 197.727 22.3788 197.727 24.4545V48H188.545V43.1591H188.273C187.712 44.25 186.962 45.2121 186.023 46.0455C185.083 46.8636 183.955 47.5076 182.636 47.9773C181.318 48.4318 179.795 48.6591 178.068 48.6591ZM180.841 41.9773C182.265 41.9773 183.523 41.697 184.614 41.1364C185.705 40.5606 186.561 39.7879 187.182 38.8182C187.803 37.8485 188.114 36.75 188.114 35.5227V31.8182C187.811 32.0152 187.394 32.197 186.864 32.3636C186.348 32.5152 185.765 32.6591 185.114 32.7955C184.462 32.9167 183.811 33.0303 183.159 33.1364C182.508 33.2273 181.917 33.3106 181.386 33.3864C180.25 33.553 179.258 33.8182 178.409 34.1818C177.561 34.5455 176.902 35.0379 176.432 35.6591C175.962 36.2652 175.727 37.0227 175.727 37.9318C175.727 39.25 176.205 40.2576 177.159 40.9545C178.129 41.6364 179.356 41.9773 180.841 41.9773ZM205.239 48V13.0909H214.625V19.1818H214.989C215.625 17.0152 216.693 15.3788 218.193 14.2727C219.693 13.1515 221.42 12.5909 223.375 12.5909C223.86 12.5909 224.383 12.6212 224.943 12.6818C225.504 12.7424 225.996 12.8258 226.42 12.9318V21.5227C225.966 21.3864 225.337 21.2652 224.534 21.1591C223.731 21.053 222.996 21 222.33 21C220.905 21 219.633 21.3106 218.511 21.9318C217.405 22.5379 216.527 23.3864 215.875 24.4773C215.239 25.5682 214.92 26.8258 214.92 28.25V48H205.239Z"
                                                    fill="#0E5E88" />
                                            </svg>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>`;
        super(to, subject, '', html);
    }
}