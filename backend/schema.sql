-- Esquema inicial para Gestión de Siniestros

-- Catálogo de Configuraciones
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buzones configurados
CREATE TABLE IF NOT EXISTS mailboxes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    last_sync TIMESTAMP,
    auth_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Correos Ingeridos
CREATE TABLE IF NOT EXISTS incoming_emails (
    id SERIAL PRIMARY KEY,
    google_message_id VARCHAR(255) UNIQUE NOT NULL,
    sender VARCHAR(255) NOT NULL,
    subject TEXT,
    body_plain TEXT,
    received_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP,
    classification VARCHAR(50) DEFAULT 'pending',
    confidence DECIMAL(5,2),
    classification_reason TEXT,
    is_insurance_domain BOOLEAN DEFAULT FALSE,
    raw_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Siniestros
CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE,
    policy_number VARCHAR(100),
    license_plate VARCHAR(20),
    insurer VARCHAR(100),
    event_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    initial_email_id INTEGER REFERENCES incoming_emails(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plantillas dinámicas de correo
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    flow_step VARCHAR(50) UNIQUE NOT NULL,
    subject_template TEXT NOT NULL,
    body_template_masculino TEXT NOT NULL,
    body_template_femenino TEXT NOT NULL,
    body_template_empresa TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de Procesamiento (Auditoría)
CREATE TABLE IF NOT EXISTS processing_logs (
    id SERIAL PRIMARY KEY,
    email_id INTEGER REFERENCES incoming_emails(id),
    claim_id INTEGER REFERENCES claims(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    is_error BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semilla de plantillas iniciales
INSERT INTO email_templates (flow_step, subject_template, body_template_masculino, body_template_femenino, body_template_empresa)
VALUES 
('aviso_inicial', 'Actualización de Siniestro - {{license_plate}}', 
'Estimado Sr. \n\nHemos tomado conocimiento del siniestro ocurrido a su vehículo...', 
'Estimada Srta. \n\nHemos tomado conocimiento del siniestro ocurrido a su vehículo...', 
'Estimados Sres. \n\nHemos tomado conocimiento del siniestro ocurrido a su vehículo...')
ON CONFLICT (flow_step) DO NOTHING;
