/**
 * Motor de Extracción de Datos de Siniestro (E04)
 * Utiliza expresiones regulares para identificar información clave en el texto.
 */

const REGEX_PATTERNS = {
    // Ejemplo: POL-123456, 123456-789
    policy_number: /(?:p[óo]liza|p[óo]liza n[úu]m(?:\.|ero)?|policy):?\s*([A-Z0-9-]{6,20})/i,

    // Ejemplo: ABC-123 (Formato estándar Perú)
    license_plate: /(?:placa|matr[íi]cula|plate):?\s*([A-Z0-9]{3}[- ]?[A-Z0-9]{3})/i,

    // Identificación de aseguradora (si no se detectó por dominio)
    insurer: /(rimac|pac[íi]fico|mapfre|positiva|chubb|la positiva)/i
};

const EVENT_TYPES = [
    { key: 'choque', keywords: ['choque', 'colisi[óo]n', 'impacto'] },
    { key: 'robo', keywords: ['robo', 'hurto', 'sustracci[óo]n'] },
    { key: 'atropello', keywords: ['atropello', 'atropellamiento'] },
    { key: 'incendio', keywords: ['incendio', 'fuego', 'amago'] }
];

/**
 * Extrae datos estructurados desde el contenido de un correo
 */
export const extractClaimData = (text) => {
    const results = {
        policy_number: null,
        license_plate: null,
        insurer: null,
        event_type: 'otro'
    };

    // 1. Extraer Póliza
    const policyMatch = text.match(REGEX_PATTERNS.policy_number);
    if (policyMatch) results.policy_number = policyMatch[1].toUpperCase();

    // 2. Extraer Placa
    const plateMatch = text.match(REGEX_PATTERNS.license_plate);
    if (plateMatch) results.license_plate = plateMatch[1].toUpperCase().replace(/\s+/g, '-');

    // 3. Extraer Aseguradora
    const insurerMatch = text.match(REGEX_PATTERNS.insurer);
    if (insurerMatch) results.insurer = insurerMatch[1].toLowerCase();

    // 4. Determinar Tipo de Evento
    const lowerText = text.toLowerCase();
    for (const event of EVENT_TYPES) {
        if (event.keywords.some(k => new RegExp(k, 'i').test(lowerText))) {
            results.event_type = event.key;
            break;
        }
    }

    return results;
};
