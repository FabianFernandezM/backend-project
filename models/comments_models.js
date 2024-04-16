const db = require("../db/connection")

async function fetchCommentById(comment_id) {
    const comment = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    if (comment.rows.length === 0) return Promise.reject({ status: 404, message: "This comment does not exist" })
    return comment.rows[0]
}

async function removeCommentById(comment_id) {
    const output = await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    return output
}

module.exports = { removeCommentById , fetchCommentById}