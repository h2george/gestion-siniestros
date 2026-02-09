import { query } from '../db.js';
import { updateClaimStatus } from '../services/flowService.js';
import { sendClaimEmail } from '../services/emailService.js';

/**
 * Controlador de Correos e Ingesta
 */
export const getEmails = async (req, res) => {
    try {
        const { classification, status } = req.query;
        let sql = 'SELECT * FROM incoming_emails';
        const params = [];

        if (classification) {
            sql += ' WHERE classification = $1';
            params.push(classification);
        }

        sql += ' ORDER BY received_at DESC LIMIT 50';

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener correos' });
    }
};

/**
 * Controlador de Siniestros (Claims)
 */
export const getClaims = async (req, res) => {
    try {
        const result = await query('SELECT * FROM claims ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener siniestros' });
    }
};

export const getClaimById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM claims WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Siniestro no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el siniestro' });
    }
};

/**
 * Actualizar Estado y Notificar
 */
export const patchClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusKey, details, clientEmail, personaType, data } = req.body;

        // 1. Actualizar en Base de Datos
        await updateClaimStatus(id, statusKey, details);

        // 2. Notificar por Correo (según el paso del flujo)
        // Ejemplo: Si el paso requiere notificación automática
        const notificationSteps = [1, 31, 32, 8, 9];
        if (notificationSteps.includes(Number(statusKey)) && clientEmail) {
            await sendClaimEmail(clientEmail, getFlowTypeByKey(statusKey), personaType, data);
        }

        res.json({ success: true, message: 'Estado actualizado y cliente notificado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper interno
const getFlowTypeByKey = (key) => {
    if (key == 1) return 'aviso_inicial';
    if (key == 31) return 'cobertura_aprobada';
    if (key == 32) return 'siniestro_rechazado';
    if (key == 8) return 'recordatorio_taller';
    if (key == 9) return 'fin_atencion';
    return null;
};
