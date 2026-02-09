import { query } from '../db.js';

export const getTemplates = async (req, res) => {
    try {
        const result = await query('SELECT * FROM email_templates ORDER BY flow_step');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener plantillas' });
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const { flow_step } = req.params;
        const { subject_template, body_template_masculino, body_template_femenino, body_template_empresa } = req.body;

        await query(
            `UPDATE email_templates 
             SET subject_template = $1, body_template_masculino = $2, 
                 body_template_femenino = $3, body_template_empresa = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE flow_step = $5`,
            [subject_template, body_template_masculino, body_template_femenino, body_template_empresa, flow_step]
        );

        res.json({ success: true, message: 'Plantilla actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar plantilla' });
    }
};
