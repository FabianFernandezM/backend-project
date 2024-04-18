const commentsRouter = require("express").Router()
const { deleteCommentById, patchCommentById } = require("../controllers/comments_controllers")

commentsRouter.route("/:comment_id")
.patch(patchCommentById)
.delete(deleteCommentById)

module.exports = commentsRouter;