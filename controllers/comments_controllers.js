const { removeCommentById, fetchCommentById } = require("../models/comments_models")

async function deleteCommentById(req, res, next) {
    const {comment_id} = req.params
    try {
        await fetchCommentById(comment_id)
        await removeCommentById(comment_id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = { deleteCommentById }