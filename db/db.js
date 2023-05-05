const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfoliopart2',
  password: 'Iloverails1!',
  port: 5432,
})

module.exports = {
    pool
    
}
