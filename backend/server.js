import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { getEmails, getClaims, getClaimById, patchClaimStatus } from './controllers/claimController.js';
import { getTemplates, updateTemplate } from './controllers/templateController.js';
import { getStats, getAuditLogs } from './controllers/dashboardController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'gestión-de-siniestros-backend' });
});

// Emails API
app.get('/api/emails', getEmails);

// Claims API
app.get('/api/claims', getClaims);
app.get('/api/claims/:id', getClaimById);
app.patch('/api/claims/:id/status', patchClaimStatus);

// Templates API
app.get('/api/templates', getTemplates);
app.put('/api/templates/:flow_step', updateTemplate);

// Dashboard & Audit API
app.get('/api/stats', getStats);
app.get('/api/audit', getAuditLogs);

// Root route
app.get('/', (req, res) => {
    res.send('API de Gestión de Siniestros funcionando');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
