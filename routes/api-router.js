const apiRouter = require('express').Router();
const usersRouter = require('./users-router')
const articlesRouter = require('./articles-router')
const topicsRouter = require('./topics-router')
const commentsRouter = require('./comments-router')
const { getEndpoints } = require("../controllers/topics_controllers")

apiRouter.route("/")
.get(getEndpoints)

apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;