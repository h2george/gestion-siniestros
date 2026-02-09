/**
 * Motor de Clasificación de Correos (E02 y E03)
 */

const INSURANCE_DOMAINS = [
    'rimac.com.pe',
    'pacifico.com.pe',
    'mapfre.com.pe',
    'positiva.com.pe',
    'chubb.com'
];

const KEYWORDS_SINIESTRO = [
    'aviso de siniestro',
    'choque',
    'accidente',
    'robo',
    'perjuicio',
    'daño'
];

const KEYWORDS_COBERTURA = [
    'aprobación de cobertura',
    'carta de garantía',
    'cobertura aprobada',
    'procedente'
];

/**
 * Analiza un correo y retorna su clasificación preliminar
 */
export const classifyEmail = (emailData) => {
    const { sender, subject, body } = emailData;
    const content = `${subject} ${body}`.toLowerCase();
    const domain = sender.split('@')[1]?.toLowerCase();

    let classification = 'informativo';
    let confidence = 0.5;
    let reasons = [];

    // 1. Verificar dominio de aseguradora
    const isInsurance = INSURANCE_DOMAINS.includes(domain);
    if (isInsurance) {
        reasons.push(`Dominio reconocido: ${domain}`);
        confidence += 0.2;
    }

    // 2. Buscar palabras clave de Siniestro
    const hasSiniestroKeywords = KEYWORDS_SINIESTRO.some(k => content.includes(k));
    if (hasSiniestroKeywords) {
        classification = 'aviso_siniestro';
        reasons.push('Detectadas palabras clave de siniestro');
        confidence += 0.3;
    }

    // 3. Buscar palabras clave de Cobertura (Prioridad si ya es siniestro)
    const hasCoberturaKeywords = KEYWORDS_COBERTURA.some(k => content.includes(k));
    if (hasCoberturaKeywords) {
        classification = 'aprobacion_cobertura';
        reasons.push('Detectadas palabras clave de aprobación de cobertura');
        confidence += 0.4;
    }

    // 4. Filtrado de ruido (E02.02)
    if (content.includes('newsletter') || content.includes('unsubscribe') || content.includes('publicidad')) {
        classification = 'descartado';
        reasons.push('Identificado como correo masivo o publicidad');
        confidence = 1.0;
    }

    return {
        classification,
        confidence: Math.min(confidence, 1.0),
        reasons: reasons.join(', '),
        isInsuranceDomain: isInsurance
    };
};
