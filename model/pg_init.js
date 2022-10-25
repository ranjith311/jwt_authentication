
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'my_user',
  host: 'localhost', 
  database: 'user_auth',
  password: 'root',
  port: 5432,
});



module.exports = pool