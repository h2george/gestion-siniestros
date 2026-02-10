
import { query } from '../db.js';

// Get all configured mailboxes
export const getMailboxes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM mailboxes ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching mailboxes:', error);
        res.status(500).json({ error: 'Error al obtener buzones' });
    }
};

// Add or Update a mailbox configuration
export const upsertMailbox = async (req, res) => {
    const { email, alias_for, status, filter_rules } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        // Logic to handle existing vs new
        // For simplicity, we'll try insert on conflict update
        const queryText = `
            INSERT INTO mailboxes (email, alias_for, status, filter_rules, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (email) 
            DO UPDATE SET 
                alias_for = EXCLUDED.alias_for,
                status = EXCLUDED.status,
                filter_rules = EXCLUDED.filter_rules,
                updated_at = NOW()
            RETURNING *;
        `;

        const result = await query(queryText, [
            email,
            alias_for || null,
            status || 'active',
            JSON.stringify(filter_rules || {})
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error saving mailbox:', error);
        res.status(500).json({ error: 'Error al guardar configuración del buzón' });
    }
};

// Delete a mailbox config
export const deleteMailbox = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM mailboxes WHERE id = $1', [id]);
        res.json({ message: 'Buzón eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting mailbox:', error);
        res.status(500).json({ error: 'Error al eliminar buzón' });
    }
};
