import { query } from '../db.js';

export const getStats = async (req, res) => {
    try {
        const totalClaims = await query('SELECT COUNT(*) FROM claims');
        const approvedCob = await query("SELECT COUNT(*) FROM claims WHERE status = 'COB_APROBADA'");
        const pendingEmails = await query("SELECT COUNT(*) FROM incoming_emails WHERE classification = 'pending'");

        // Simulación de eficiencia (E14)
        const efficiency = totalClaims.rows[0].count > 0
            ? (approvedCob.rows[0].count / totalClaims.rows[0].count) * 100
            : 0;

        res.json({
            total: totalClaims.rows[0].count,
            approved: approvedCob.rows[0].count,
            pending: pendingEmails.rows[0].count,
            efficiency: efficiency.toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular KPI' });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const result = await query('SELECT * FROM processing_logs ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener auditoría' });
    }
};
