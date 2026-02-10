import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEmails, getClaims, getClaimById, patchClaimStatus } from './controllers/claimController.js';
import { getTemplates, updateTemplate } from './controllers/templateController.js';
import { getStats, getAuditLogs } from './controllers/dashboardController.js';
import { login, getMe } from './controllers/authController.js';
import { getMailboxes, upsertMailbox, deleteMailbox } from './controllers/settingsController.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Public Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'gestión-de-siniestros-backend' });
});

import { getSetupStatus, initializeSystem } from './controllers/setupController.js';

app.get('/api/setup/status', getSetupStatus);
app.post('/api/setup/init', initializeSystem);

app.post('/api/auth/login', login);

// Protected Routes
app.use('/api', authenticateToken);

app.get('/api/auth/me', getMe);

// Emails API
app.get('/api/emails', getEmails);

// Claims API
app.get('/api/claims', getClaims);
app.get('/api/claims/:id', getClaimById);
app.patch('/api/claims/:id/status', patchClaimStatus);

// Templates API
app.get('/api/templates', getTemplates);
app.put('/api/templates/:flow_step', updateTemplate);

// Settings / Mailbox API
app.get('/api/settings/mailboxes', getMailboxes);
app.post('/api/settings/mailboxes', upsertMailbox);
app.delete('/api/settings/mailboxes/:id', deleteMailbox);

// Dashboard & Audit API
app.get('/api/stats', getStats);
app.get('/api/audit', getAuditLogs);

// Automation Rules API
import { getRules, createRule, deleteRule } from './controllers/rulesController.js';
app.get('/api/rules', getRules);
app.post('/api/rules', createRule);
app.delete('/api/rules/:id', deleteRule);

// User Management API
import { getUsers, createUser, updateUser, deleteUser } from './controllers/userController.js';
app.get('/api/users', getUsers);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// Root route
app.get('/', (req, res) => {
    res.send('API de Gestión de Siniestros funcionando');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
