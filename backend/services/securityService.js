import { query } from '../db.js';

/**
 * Servicio de Autenticación y Autorización (E15)
 * Implementa roles y validación de permisos.
 */

export const ROLES = {
    READER: 'READER',
    OPERATOR: 'OPERATOR',
    ADMIN: 'ADMIN'
};

export const checkPermission = (userRole, requiredRole) => {
    const weights = { [ROLES.READER]: 1, [ROLES.OPERATOR]: 2, [ROLES.ADMIN]: 3 };
    return weights[userRole] >= weights[requiredRole];
};

/**
 * Registro de Auditoría (E15.05)
 */
export const logAudit = async (userId, action, details, impact = 'LOW') => {
    try {
        await query(
            'INSERT INTO processing_logs (action, details, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
            [`AUDIT_${action}`, JSON.stringify({ userId, details, impact })]
        );
    } catch (error) {
        console.error('Error logging audit:', error);
    }
};

/**
 * Kill Switch (E15.07)
 */
let automationActive = true;

export const setAutomationStatus = (status) => {
    automationActive = status;
    return automationActive;
};

export const isAutomationActive = () => automationActive;
