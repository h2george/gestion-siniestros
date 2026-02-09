import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateClaimResponse } from './responseTemplateService.js';

dotenv.config();

/**
 * Servicio para el envío de correos (E01.05)
 * Configurado para usar SMTP o Gmail API en el futuro.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendClaimEmail = async (to, flowType, personaType, data) => {
    const body = await generateClaimResponse(flowType, personaType, data);

    const mailOptions = {
        from: `"Siniestros - Gerencia de Riesgos" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `Actualización de Siniestro - ${data.license_plate || ''}`,
        text: body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error enviando correo:', error);
        // Aunque falle el envío real (por falta de credenciales), 
        // devolvemos éxito simulado para que el flujo continúe en desarrollo
        return { success: false, error: error.message, simulated: true };
    }
};
