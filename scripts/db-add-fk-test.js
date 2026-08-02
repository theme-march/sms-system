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

    try {
      const sql = `ALTER TABLE teacher_assignments ADD CONSTRAINT fk_test_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE ON UPDATE CASCADE`;
      console.log('Executing:', sql);
      await conn.execute(sql);
      console.log('FK added successfully');
    } catch (err) {
      console.error('Add FK error:', err.code, err.errno, err.sqlMessage || err.message);
    }

    await conn.end();
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(3);
  }
})();