const db = require("../db/connection")

async function fetchUsers() {
    const sqlStr = `SELECT username, name, avatar_url FROM users;`
    const users = await db.query(sqlStr)
    return users.rows
}

async function fetchUserByUsername(username) {
    const sqlStr = `SELECT username, name, avatar_url FROM users WHERE username=$1;`
    const user = await db.query(sqlStr, [username])
    if (user.rows.length === 0) return Promise.reject({ status: 404, message: "This user does not exist" })
    return user.rows[0]
}

module.exports = { fetchUsers, fetchUserByUsername }