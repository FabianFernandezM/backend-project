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

async function updateCommentById(comment_id, inc_votes) {
    const article = await db.query(`UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1 RETURNING *;`, [comment_id, inc_votes])
    return article.rows[0]
}

module.exports = { removeCommentById , fetchCommentById, updateCommentById}