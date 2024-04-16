const db = require("../db/connection")

async function fetchUsers() {
    const sqlStr = `SELECT username, name, avatar_url FROM users;`
    const articles = await db.query(sqlStr)
    return articles.rows
}

module.exports = { fetchUsers }