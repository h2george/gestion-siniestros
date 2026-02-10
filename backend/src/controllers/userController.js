import bcrypt from 'bcryptjs';
import { query } from '../db.js';

export const getUsers = async (req, res) => {
    try {
        const result = await query('SELECT id, email, full_name, role, active, last_login, created_at FROM users ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const createUser = async (req, res) => {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
    }

    try {
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'analyst';

        const result = await query(
            'INSERT INTO users (email, password_hash, full_name, role, active) VALUES ($1, $2, $3, $4, true) RETURNING id, email, full_name, role, active, created_at',
            [email, hashedPassword, full_name, userRole]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, role, active, password } = req.body;

    try {
        let queryText = 'UPDATE users SET full_name = COALESCE($1, full_name), role = COALESCE($2, role), active = COALESCE($3, active)';
        const queryParams = [full_name, role, active];
        let paramIndex = 4;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            queryText += `, password_hash = $${paramIndex}`;
            queryParams.push(hashedPassword);
            paramIndex++;
        }

        queryText += ` WHERE id = $${paramIndex} RETURNING id, email, full_name, role, active`;
        queryParams.push(id);

        const result = await query(queryText, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Prevent deleting the last admin or yourself could be a check here, but simplified for now
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
