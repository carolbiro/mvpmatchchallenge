export const DB_FILE = process.env.NODE_ENV !=='test' ? 'db.json': 'test-db.json';
export const PORT = process.env.NODE_ENV === 'test' ? 4020 : 3020;