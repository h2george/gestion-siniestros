import { query } from '../db.js';

/**
 * Servicio de Importación de Pólizas (E07)
 */
export const importPoliciesFromJSON = async (policies) => {
    let imported = 0;
    let errors = 0;

    for (const policy of policies) {
        try {
            // Normalización (E07.03)
            const licensePlate = policy.placa?.replace(/\s+/g, '').toUpperCase();
            const email = policy.correo?.toLowerCase().trim();

            if (!email || !licensePlate) {
                throw new Error('Datos incompletos');
            }

            await query(
                `INSERT INTO settings (key, value) 
                 VALUES ($1, $2) 
                 ON CONFLICT (key) DO UPDATE SET value = $2`,
                [`POLICY_${policy.poliza}`, JSON.stringify({ ...policy, placa: licensePlate, correo: email })]
            );
            imported++;
        } catch (err) {
            errors++;
        }
    }

    return { imported, errors };
};

/**
 * Búsqueda de Asegurado (E06)
 */
export const findAsegurado = async (searchParams) => {
    const { policyNumber, licensePlate } = searchParams;

    // Prioridad 1: Póliza (E06.02)
    if (policyNumber) {
        const result = await query("SELECT value FROM settings WHERE key = $1", [`POLICY_${policyNumber}`]);
        if (result.rows.length > 0) return JSON.parse(result.rows[0].value);
    }

    // Prioridad 2: Placa (E06.03)
    if (licensePlate) {
        const normalizedPlate = licensePlate.replace(/\s+/g, '').toUpperCase();
        const result = await query("SELECT value FROM settings WHERE value LIKE $1", [`%${normalizedPlate}%`]);
        if (result.rows.length === 1) return JSON.parse(result.rows[0].value);
        if (result.rows.length > 1) throw new Error('AMBIGUOUS_RESULTS');
    }

    return null;
};
