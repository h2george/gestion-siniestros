/**
 * Definición del Flujo de Atención de Siniestro (E06+)
 * Basado en los 9 pasos proporcionados por el cliente.
 */

export const CLAIM_STATUS = {
    1: { id: 1, label: 'Registro', internal: 'REGISTRADO' },
    2: { id: 2, label: 'Aviso', internal: 'AVISADO' },
    3: { id: 3, label: 'Análisis de cobertura', internal: 'EN_ANALISIS' },
    31: { id: 3, sub: 'a', label: 'Cobertura aprobada', internal: 'COB_APROBADA' },
    32: { id: 3, sub: 'b', label: 'Cobertura Rechazada', internal: 'COB_RECHAZADA' },
    33: { id: 3, sub: 'c', label: 'Solicitud de documentos', internal: 'DOCS_PENDIENTES' },
    4: { id: 4, label: 'Notificación del estado de su cobertura', internal: 'NOTIFICADO' },
    41: { id: 4, sub: 'a', label: 'Ingresa a taller', internal: 'INGRESA_TALLER' },
    42: { id: 4, sub: 'b', label: 'Desestimiento', internal: 'DESESTIMIENTO' },
    5: { id: 5, label: 'Notificación de ingreso al taller', internal: 'VH_EN_TALLER' },
    6: { id: 6, label: 'Asignación de taller / Presupuesto', internal: 'EN_PRESUPUESTO' },
    7: { id: 7, label: 'Ajuste del presupuesto', internal: 'AJUSTE_PRESUPUESTO' },
    71: { id: 7, sub: 'a', label: 'Reparación / Presupuesto aprobado', internal: 'EN_REPARACION' },
    72: { id: 7, sub: 'b', label: 'Pérdida total', internal: 'PERDIDA_TOTAL' },
    8: { id: 8, label: 'Recordatorio por no ingreso al taller', internal: 'RECORDATORIO_ENVIADO' },
    9: { id: 9, label: 'Fin de Atención - Garantía', internal: 'CERRADO' }
};

import { query } from '../db.js';

/**
 * Actualiza el estado de un siniestro y registra la transición
 */
export const updateClaimStatus = async (claimId, statusKey, details = '') => {
    const status = CLAIM_STATUS[statusKey];
    if (!status) throw new Error('Estado inválido');

    try {
        await query(
            'UPDATE claims SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [status.internal, claimId]
        );

        // Registrar en logs para auditoría (E15)
        await query(
            'INSERT INTO processing_logs (claim_id, action, details) VALUES ($1, $2, $3)',
            [claimId, `CAMBIO_ESTADO: ${status.internal}`, details]
        );

        return { success: true, newStatus: status.label };
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        throw error;
    }
};
