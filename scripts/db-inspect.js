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

    const tables = ['schools','teachers','classes','sections','academic_years','academic_sessions','subjects','groups','teacher_assignments'];

    const results = {};
    for (const t of tables) {
      const [tableInfo] = await conn.execute(
        `SELECT TABLE_NAME, ENGINE, TABLE_COLLATION FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [database, t]
      );
      const [cols] = await conn.execute(
        `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [database, t]
      );
      results[t] = { tableInfo: tableInfo[0] || null, columns: cols };
    }

    console.log(JSON.stringify(results, null, 2));
    await conn.end();
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(3);
  }
})();
