const express = require("express")
const { getTopics, getEndpoints } = require("./controllers/topics_controllers")
const { getArticleById, getArticles, getArticleCommentsById, postArticleCommentById, patchArticleById } = require("./controllers/articles_controllers")
const { deleteCommentById } = require("./controllers/comments_controllers")
const { getUsers } = require("./controllers/users_controllers")
const app = express()

app.use(express.json())

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/articles/:article_id/comments", getArticleCommentsById)
app.post("/api/articles/:article_id/comments", postArticleCommentById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)


app.all('*', (req, res, next) => {
    res.status(404).send({message: "Path not found"})
})

app.use((err, req, res, next)=>{
    switch (err.code) {
      case "23502": 
        res.status(400).send({message: 'Bad request'})
        break;
      case "23503": 
        res.status(400).send({message: 'Bad request'})
        break;
      case "22P02": 
        res.status(400).send({message: 'Bad request'})
        break;
    
      default:
        break;
    }
    next(err)
})

app.use((err, req, res, next)=>{
    if (err.status && err.message){
      res.status(err.status).send({message: err.message})
    }
    next(err)
})

module.exports = app