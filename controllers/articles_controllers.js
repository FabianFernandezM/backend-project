const {fetchArticleById, fetchArticles} = require("../models/articles_models")

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

module.exports = {getArticleById, getArticles}