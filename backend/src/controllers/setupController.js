
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

export const getSetupStatus = async (req, res) => {
    try {
        const result = await query('SELECT COUNT(*) FROM users');
        const userCount = parseInt(result.rows[0].count);

        // Setup is required if there are no users
        res.json({
            isSetupRequired: userCount === 0,
            userCount
        });
    } catch (error) {
        console.error('Error checking setup status:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

export const initializeSystem = async (req, res) => {
    const client = await query('BEGIN');
    // Note: 'query' helper usually uses pool.query directly, not a client connection for transactions easily.
    // If we need transactions we should export pool from db.js or strictly use sequential awaits if slightly less safe is ok for this MVP.
    // For now, let's just do sequential checks.

    try {
        // 1. Double check no users exist to prevent hijack
        const check = await query('SELECT COUNT(*) FROM users');
        if (parseInt(check.rows[0].count) > 0) {
            return res.status(403).json({ error: 'System already initialized' });
        }

        const {
            adminName,
            adminEmail,
            adminPassword,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            googleClientId,
            googleClientSecret
        } = req.body;

        if (!adminEmail || !adminPassword) {
            return res.status(400).json({ error: 'Admin credentials required' });
        }

        // 2. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPassword, salt);

        const userRes = await query(
            `INSERT INTO users (email, password_hash, role, full_name, active) 
             VALUES ($1, $2, 'admin', $3, true) 
             RETURNING id, email`,
            [adminEmail, hash, adminName]
        );

        // 3. Save Settings
        const settingsToSave = [
            { key: 'SMTP_HOST', value: smtpHost },
            { key: 'SMTP_PORT', value: smtpPort },
            { key: 'SMTP_USER', value: smtpUser },
            { key: 'SMTP_PASS', value: smtpPass }, // Reminder: Encrypt this in real app
            { key: 'GOOGLE_CLIENT_ID', value: googleClientId },
            { key: 'GOOGLE_CLIENT_SECRET', value: googleClientSecret }
        ];

        for (const setting of settingsToSave) {
            if (setting.value) {
                await query(
                    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
                    [setting.key, setting.value]
                );
            }
        }

        res.json({
            success: true,
            message: 'System initialized successfully',
            user: userRes.rows[0]
        });

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: 'Initialization failed: ' + error.message });
    }
};
