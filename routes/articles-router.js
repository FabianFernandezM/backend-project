const articlesRouter = require("express").Router()
const { getArticleById, getArticles, getArticleCommentsById, postArticleCommentById, patchArticleById, postArticle, deleteArticleById } = require("../controllers/articles_controllers")

articlesRouter.route("/")
.get(getArticles)
.post(postArticle);

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)
.delete(deleteArticleById);

articlesRouter.route("/:article_id/comments")
.get(getArticleCommentsById)
.post(postArticleCommentById);

module.exports = articlesRouter;