import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración del pool de conexión
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Para desarrollo local permitimos que falle si no hay URL todavía
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);

export default pool;
