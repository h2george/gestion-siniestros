# Gestión de Siniestros (Claims Management System)

Plataforma inteligente para la automatización y gestión de siniestros vehiculares, integrando detección por correo mediante IA, extracción de datos y gestión de flujo de atención técnica.

## 🚀 Características Principales

-   **Ingesta Inteligente**: Escucha automatizada de buzones corporativos mediante Google Workspace API.
-   **Clasificación IA**: Motores de clasificación que identifican avisos de siniestro y aprobaciones de cobertura.
-   **Extracción de Datos**: Identificación automática de placas, pólizas, aseguradoras y tipos de eventos.
-   **Flujo de Atención**: Gestión completa del ciclo de vida del siniestro (9 pasos configurables).
-   **Plantillas Dinámicas**: Respuestas automáticas personalizadas según el sexo del asegurado (masculino/femenino) o tipo de cliente (empresa).
-   **Dashboard Operativo**: KPIs en tiempo real y auditoría completa de procesos.
-   **Seguridad y Auditoría**: Registro detallado de acciones y control de acceso basado en roles.

## 🛠️ Tech Stack

-   **Frontend**: React + TypeScript + Vite + Tailwind CSS.
-   **Backend**: Node.js (Express) con arquitectura de servicios.
-   **Base de Datos**: PostgreSQL 15+.
-   **Infraestructura**: Docker & Docker Compose.
-   **Integraciones**: Google APIs (Gmail), SMTP.

## 📦 Estructura del Proyecto

```text
├── backend/            # API Servidora y Lógica de Negocio
│   ├── controllers/    # Controladores de rutas
│   ├── services/       # Lógica central (IA, Email, Flow)
│   ├── db.js           # Configuración del Pool Postgres
│   ├── server.js       # Punto de entrada de la API
│   └── schema.sql      # Definición de la base de datos
├── src/                # Aplicación Frontend (Vite + React)
│   ├── App.tsx         # Componente principal interactivo
│   ├── main.tsx        # Punto de entrada React
│   └── nginx.conf      # Configuración de servidor para SPA
├── docs/               # Documentación técnica y funcional
│   ├── PLAN.md         # Roadmap y plan de ejecución
│   └── Historias.md    # Historias de usuario y aceptación
└── docker-compose.yml  # Orquestación de contenedores
```

## 🚀 Despliegue con Docker

El sistema está contenerizado para un despliegue inmediato.

### Requisitos Previos

-   Docker y Docker Compose instalados.
-   Archivo `.env` en la carpeta `backend/` con las credenciales necesarias (ver `.env.example`).

### Pasos para Ejecutar

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/h2george/gestion-siniestros.git
    cd gestion-siniestros
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `backend/.env` basándote en la configuración de tu entorno.

3.  **Iniciar servicios:**
    ```bash
    docker-compose up -d --build
    ```

4.  **Acceder a la plataforma:**
    -   **Frontend:** [http://localhost:3000](http://localhost:3000)
    -   **Backend (API):** [http://localhost:3005](http://localhost:3005)

## 🔒 Auditoría y Mejora Continua (Kaizen)

Este proyecto sigue principios de **Kaizen** y **Poka-Yoke** para garantizar:
-   Resiliencia ante errores de red.
-   Trazabilidad total mediante `processing_logs`.
-   Secretos dinámicos generados en tiempo de ejecución (JWT_SECRET).

---
Desarrollado para la optimización de procesos de seguros.
