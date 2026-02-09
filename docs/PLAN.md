# Plan de Ejecución: Gestión de Siniestros

Plan actualizado basado en el documento de requerimientos `Gestión de Siniestros - Historias de Usuario.md` proveído en `docs/`.

## Objetivo Global
Implementar una plataforma para la **Gerencia de Riesgos** que automatice la recepción, clasificación y gestión de siniestros vehiculares mediante integración con Google Workspace e inteligencia de procesos.

## Infraestructura (Containerización) - COMPLETADO
- **Frontend**: Nginx sirviendo build de React (Puerto 80).
- **Backend**: Node.js runtime (Puerto 3001).
- **Database**: PostgreSQL 15 (Puerto 5432).
- **Orquestación**: Docker Compose.

## Scope Fase 1 (MVP)

Basado en las Epicas E01, E02 y E03 detalladas.

- **In**:
  - **E01 Integración Google Workspace**:
    - Autenticación OAuth 2.0 (Scopes: `gmail.readonly`, `gmail.send`).
    - Configuración de buzón corporativo (`siniestros@gerenciaderiesgos.com`).
    - Listener de correos nuevos y envío de respuestas.
  - **E02 Ingesta y Detección**:
    - Filtrado de correos irrelevantes (newsletters, spam).
    - Identificación de aseguradoras por dominio.
    - Detección de palabras clave ("aviso de siniestro", "choque").
  - **E03 Clasificación Inteligente**:
    - Clasificación en: *Aviso de Siniestro*, *Aprobación de Cobertura*, *Informativo*.
    - Gestión de ambigüedad y registro de decisiones.
  - **Frontend**: Dashboard de gestión, configuración de buzones y logs de actividad.
  
- **Out**:
  - E15 Auditoría avanzada (mencionado como futuro en el doc).
  - Interpretación profunda de adjuntos (OCR complejo) salvo lo especificado en siguientes epicas.

## Roadmap Detallado

### Fase 1: Fundamentos y Conectividad (Sprints 1-2)
[ ] **Project Setup**:
    - Inicializar Repo Agnostico (Monorepo o Frontend/Backend separados según preferencia).
    - Frontend: Vite + React + TailwindCSS + Antigravity UI.
    - Backend: Node.js/Express o Python/FastAPI (Para integración Gmail).
[ ] **Implementación E01 (Google Integration)**:
    - Módulo de Autenticación OAuth.
    - Servicio de "Listener" de Gmail (Polling o Push Notifications).
    - Interfaz de configuración de credenciales y estado de conexión.

### Fase 2: Motor de Procesamiento (Sprints 3-4)
[ ] **Implementación E02 (Ingesta)**:
    - Motor de reglas para whitelist/blacklist de dominios.
    - Pipeline de filtros de contenido.
[ ] **Implementación E03 (Clasificación)**:
    - Lógica de clasificación (Reglas -> Heurística -> IA simple).
    - UI para validación humana de clasificaciones ambiguas.

## Action Items Inmediatos

[ ] **Frontend**: Inicializar proyecto React con estructura de carpetas para `auth`, `dashboard`, `settings`.
[ ] **Backend**: Definir stack tecnológico (¿Node.js o Python?) para el servicio de correo.
[ ] **Configuración**: Solicitar credenciales de GCP (Client ID, Secret) para entorno de desarrollo.
