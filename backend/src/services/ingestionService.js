import { query } from '../db.js';
import { classifyEmail } from './classificationService.js';
import { extractClaimData } from './extractionService.js';

/**
 * Servicio para gestionar la ingesta de correos
 */
export const processIncomingEmail = async (rawEmail) => {
    try {
        // Ejecutar motor de clasificación
        const { classification, confidence, reasons, isInsuranceDomain } = classifyEmail({
            sender: rawEmail.sender,
            subject: rawEmail.subject,
            body: rawEmail.body_plain
        });

        // Guardar en base de datos
        const sql = `
            INSERT INTO incoming_emails (
                google_message_id, sender, subject, body_plain, 
                received_at, classification, confidence, 
                classification_reason, is_insurance_domain, raw_json
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id;
        `;

        const values = [
            rawEmail.google_message_id,
            rawEmail.sender,
            rawEmail.subject,
            rawEmail.body_plain,
            rawEmail.received_at,
            classification,
            confidence,
            reasons,
            isInsuranceDomain,
            JSON.stringify(rawEmail)
        ];

        const result = await query(sql, values);
        const emailId = result.rows[0].id;

        // --- NEW: E04 Extracción de Datos ---
        if (classification === 'aviso_siniestro') {
            const extractedData = extractClaimData(`${rawEmail.subject} ${rawEmail.body_plain}`);

            // Crear registro en la tabla de siniestros
            const claimSql = `
                INSERT INTO claims (
                    claim_number, policy_number, license_plate, 
                    insurer, event_type, initial_email_id
                ) VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (claim_number) DO NOTHING;
            `;

            // Generar un correlativo temporal si no hay número de siniestro en el correo
            const tempClaimNumber = `SIN-${Date.now()}`;

            await query(claimSql, [
                tempClaimNumber,
                extractedData.policy_number,
                extractedData.license_plate,
                extractedData.insurer,
                extractedData.event_type,
                emailId
            ]);
        }

        // Registrar log
        await query(
            'INSERT INTO processing_logs (email_id, action, details) VALUES ($1, $2, $3)',
            [emailId, 'INGESTA_EXITOSA', `Clasificado como ${classification}`]
        );

        return { emailId, classification };
    } catch (error) {
        console.error('Error al procesar correo:', error);
        throw error;
    }
};
