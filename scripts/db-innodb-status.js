const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const url = require('url');

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(2);
}

(async () => {
  try {
    const parsed = new url.URL(DATABASE_URL);
    const user = parsed.username || 'root';
    const password = parsed.password || '';
    const host = parsed.hostname || 'localhost';
    const port = parsed.port || 3306;
    const database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined;

    const conn = await mysql.createConnection({ host, port, user, password, database });
    const [rows] = await conn.execute('SHOW ENGINE INNODB STATUS');
    console.log(rows[0]['Status']);
    await conn.end();
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(3);
  }
})();