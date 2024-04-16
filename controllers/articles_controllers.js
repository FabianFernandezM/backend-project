const {fetchArticleById, fetchArticles, fetchArticleCommentsById, insertArticleCommentById, updateArticleById} = require("../models/articles_models")

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

async function postArticleCommentById(req, res, next) {
    const { article_id } = req.params
    const newComment = req.body
    try {
        await fetchArticleById(article_id)
        const comment = await insertArticleCommentById(article_id, newComment)
        res.status(201).send({comment})
    } 
    catch (error) {
        next(error)
    }
}

async function patchArticleById(req, res, next) {
    const { article_id } = req.params
    const { inc_votes } = req.body
    try {
        await fetchArticleById(article_id)
        const article = await updateArticleById(article_id, inc_votes)
        res.status(200).send({article})
    } 
    catch (error) {
        next(error)
    }
}



module.exports = {getArticleById, getArticles, getArticleCommentsById, postArticleCommentById, patchArticleById}