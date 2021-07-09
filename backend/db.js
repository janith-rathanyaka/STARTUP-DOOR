const Pool = require("pg").Pool

const pool = new Pool ({
    user:"postgres",
    password:"12345",
    port:5432,
    database:"testdb"
})


module.exports = pool;