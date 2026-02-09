import { query } from '../db.js';

/**
 * Servicio de Generación de Respuestas (E05)
 * Ahora lee las plantillas dinámicamente desde la base de datos.
 */

export const generateClaimResponse = async (flowStep, personaType, data) => {
    try {
        const result = await query(
            'SELECT * FROM email_templates WHERE flow_step = $1',
            [flowStep]
        );

        if (result.rows.length === 0) {
            return `Estimados, procedemos con el paso ${flowStep} para su atención.`;
        }

        const template = result.rows[0];
        let body = '';

        if (personaType === 'femenino') body = template.body_template_femenino;
        else if (personaType === 'empresa') body = template.body_template_empresa;
        else body = template.body_template_masculino;

        // Reemplazo simple de variables
        const finalBody = body
            .replace(/{{license_plate}}/g, data.license_plate || '')
            .replace(/{{policy_number}}/g, data.policy_number || '')
            .replace(/{{claim_id}}/g, data.claim_id || '')
            .replace(/{{date}}/g, data.date || '');

        return finalBody;
    } catch (error) {
        console.error('Error al generar respuesta dinámica:', error);
        return 'Mensaje de confirmación estándar (error en plantillas).';
    }
};
