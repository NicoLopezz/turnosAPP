import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const getHtmlTemplate = async (token) => {
    try {
        const htmlPath = path.join(__dirname, 'verificationEmailTemplate.html');
        const data = await fs.readFile(htmlPath, 'utf8');
        return data.replace('{{token}}', token);
    } catch (err) {
        console.error('Error leyendo el archivo HTML', err);
        throw err;
    }
};

export async function sendEmailVerification(direccion, token) {
    try {
        const htmlContent = await getHtmlTemplate(token);
        const mailOptions = {
            from: `Oxygen Group <${process.env.EMAIL}>`,
            to: direccion,
            subject: 'Bienvenido!',
            html: htmlContent,
            attachments: [
                {
                    filename: 'imgMail.png',
                    path: path.join(__dirname, '../../public/imgs/imgMail.png'),
                    cid: 'imgMail' // Same cid value as in the html img src
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: ' + info.response);
    } catch (error) {
        console.error('Error enviando el correo', error);
    }
}

export default transporter;
