const { removeCommentById, fetchCommentById, updateCommentById } = require("../models/comments_models")

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

async function patchCommentById(req, res, next) {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    try {
        await fetchCommentById(comment_id)
        const comment = await updateCommentById(comment_id, inc_votes)
        res.status(200).send({comment})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = { deleteCommentById, patchCommentById }