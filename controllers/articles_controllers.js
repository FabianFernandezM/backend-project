const {fetchArticleById, fetchArticles, fetchArticleCommentsById} = require("../models/articles_models")

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

async function getArticleCommentsById(req, res, next) {
    const { article_id } = req.params
    try {
        await fetchArticleById(article_id)
        const comments = await fetchArticleCommentsById(article_id)
        res.status(200).send({comments})
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

module.exports = {getArticleById, getArticles, getArticleCommentsById}