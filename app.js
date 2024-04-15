const express = require("express")
const { getTopics, getEndpoints } = require("./controllers/topics_controllers")
const app = express()


app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)


app.all('*', (req, res, next) => {
    res.status(404).send({message: "Path not found"})
})

module.exports = app