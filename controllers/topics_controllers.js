const {fetchTopics, fetchArticleById, fetchArticles} = require("../models/topics_models")

async function getTopics(req, res, next) {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics})
    } 
    catch (error) {
        next(error)
    }
}

function getEndpoints(req, res, next) {
    const endpoints = require(`${__dirname}/../endpoints.json`)
    res.status(200).send({endpoints})
}

async function getArticleById(req, res, next) {
    const { article_id } = req.params
    try {
        const article = await fetchArticleById(article_id)
        res.status(200).send({article})
    } 
    catch (error) {
        next(error)
    }
}

async function getArticles(req, res, next) {
    try {
        const articles = await fetchArticles()
        res.status(200).send({articles})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics, getEndpoints, getArticleById, getArticles}