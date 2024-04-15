const {fetchTopics, fetchEndPoints, fetchArticleById} = require("../models/topics_models")

async function getTopics(req, res, next) {
    try {
        const topics = await fetchTopics()
        res.status(200).send(topics)
    } 
    catch (error) {
        next(error)
    }
}

async function getEndpoints(req, res, next) {
    try {
        const endpoints = await fetchEndPoints()
        res.status(200).send(endpoints)
    } 
    catch (error) {
        next(error)
    }
}

async function getArticleById(req, res, next) {
    const { article_id } = req.params
    try {
        const article = await fetchArticleById(article_id)
        res.status(200).send(article)
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics, getEndpoints, getArticleById}