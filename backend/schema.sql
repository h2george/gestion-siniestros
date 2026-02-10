-- Esquema inicial para Gestión de Siniestros

-- Usuarios y Roles
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'analyst', -- admin, analyst, viewer
    full_name VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, error
    alias_for VARCHAR(255), -- If this is an alias monitoring specific subset
    filter_rules JSONB, -- Poka-yoke rules for this specific mailbox
    last_sync TIMESTAMP,
    auth_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Correos Ingeridos
CREATE TABLE IF NOT EXISTS incoming_emails (
    id SERIAL PRIMARY KEY,
    google_message_id VARCHAR(255) UNIQUE NOT NULL,
    mailbox_id INTEGER REFERENCES mailboxes(id),
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
    assigned_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plantillas dinámicas de correo
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    flow_step VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    subject_template TEXT NOT NULL,
    body_template_masculino TEXT NOT NULL,
    body_template_femenino TEXT NOT NULL,
    body_template_empresa TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de Procesamiento (Auditoría / Trazabilidad)
CREATE TABLE IF NOT EXISTS processing_logs (
    id SERIAL PRIMARY KEY,
    email_id INTEGER REFERENCES incoming_emails(id),
    claim_id INTEGER REFERENCES claims(id),
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    is_error BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reglas de Negocio para Automatización
CREATE TABLE IF NOT EXISTS automation_rules (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255), -- Brand, Insurer, or specific subject keyword
    event_type VARCHAR(50) NOT NULL, -- 'new_claim', 'coverage_approved', 'coverage_rejected', 'generic'
    template_id INTEGER REFERENCES email_templates(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO automation_rules (keyword, event_type, template_id) 
VALUES 
('Pacífic', 'new_claim', 1), -- Maps "Pacífico" related emails to "Aviso Inicial" template (ID 1 assumed from seed)
('Rima', 'new_claim', 1),
('Mapfr', 'new_claim', 1),
('Líde', 'coverage_approved', 2),
('Líde', 'coverage_rejected', 3)
ON CONFLICT DO NOTHING;

-- Semilla de Usuarios: REMOVIDA para permitir flujo de Setup inicial
-- INSERT INTO users ...

-- Semilla de plantillas iniciales (Real Data according to user request)
INSERT INTO email_templates (flow_step, label, subject_template, body_template_masculino, body_template_femenino, body_template_empresa)
VALUES 
('aviso_inicial', '1. Aviso Inicial', 
'Confirmación de Recepción - Siniestro {{license_plate}}', 
'Estimado Sr. {{name}},\n\nHemos recibido la notificación de su siniestro. Estamos procediendo a validarlo con la aseguradora.',
'Estimada Sra. {{name}},\n\nHemos recibido la notificación de su siniestro. Estamos procediendo a validarlo con la aseguradora.',
'Estimados Sres. {{name}},\n\nHemos recibido la notificación de su siniestro. Estamos procediendo a validarlo con la aseguradora.'),

('cobertura_aprobada', '3.a Cobertura Aprobada', 
'¡Buenas noticias! Cobertura Aprobada - {{claim_number}}', 
'Estimado Sr. {{name}},\n\nLa compañía de seguros ha aprobado la cobertura para la reparación de su vehículo.',
'Estimada Sra. {{name}},\n\nLa compañía de seguros ha aprobado la cobertura para la reparación de su vehículo.',
'Estimados Sres. {{name}},\n\nLa compañía de seguros ha aprobado la cobertura para la reparación de su vehículo.'),

('rechazo_cobertura', '3.b Rechazo de Cobertura', 
'Información importante sobre su siniestro - {{claim_number}}', 
'Estimado Sr. {{name}},\n\nLamentablemente, la aseguradora ha indicado que el siniestro no está cubierto por los siguientes motivos: {{reason}}.',
'Estimada Sra. {{name}},\n\nLamentablemente, la aseguradora ha indicado que el siniestro no está cubierto por los siguientes motivos: {{reason}}.',
'Estimados Sres. {{name}},\n\nLamentablemente, la aseguradora ha indicado que el siniestro no está cubierto por los siguientes motivos: {{reason}}.')

ON CONFLICT (flow_step) DO UPDATE SET 
label = EXCLUDED.label,
subject_template = EXCLUDED.subject_template;
