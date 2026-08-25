const { Client } = require('pg');

const c = new Client('postgresql://postgres:postgres@localhost:5432/dev');

c.connect()
  .then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
  .then((r) => {
    console.log('PUBLIC TABLES:', r.rows);
    return c.end();
  })
  .catch((e) => {
    console.error('ERROR:', e.message);
  });