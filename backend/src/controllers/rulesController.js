import { query } from '../db.js';

export const getRules = async (req, res) => {
    try {
        const result = await query(`
            SELECT r.id, r.keyword, r.event_type, r.template_id, r.active, t.label as template_label
            FROM automation_rules r
            LEFT JOIN email_templates t ON r.template_id = t.id
            ORDER BY r.id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ error: 'Error al obtener reglas' });
    }
};

export const createRule = async (req, res) => {
    const { keyword, event_type, template_id } = req.body;
    try {
        const result = await query(
            'INSERT INTO automation_rules (keyword, event_type, template_id) VALUES ($1, $2, $3) RETURNING *',
            [keyword, event_type, template_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(500).json({ error: 'Error al crear regla' });
    }
};

export const deleteRule = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM automation_rules WHERE id = $1', [id]);
        res.json({ message: 'Regla eliminada' });
    } catch (error) {
        console.error('Error deleting rule:', error);
        res.status(500).json({ error: 'Error al eliminar regla' });
    }
};
