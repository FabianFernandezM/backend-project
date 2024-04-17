const db = require("../db/connection")

async function fetchArticles(query, queryNames) {
    const validQueryNames = ["topic"]

    for (let i = 0; i < queryNames.length; i++) {
        if (!validQueryNames.includes(queryNames[i]))
        return Promise.reject({ status: 400, message: `Query not allowed` })
    }


    let sqlStr = `SELECT articles.author, articles.title, articles.article_id,
    articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `
    const queryValues = []

    if (query.topic){
        sqlStr += `WHERE topic=$1 `
        queryValues.push(query.topic)
    }

    sqlStr += `GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    const articles = await db.query(sqlStr, queryValues)

    for (let i = 0; i < queryNames.length; i++) {
        const queryExists = await checkQueryExists(query, "articles", queryNames[i])
        if (queryExists === false) return Promise.reject({ status: 404, message: "Not found" })
    }

    return articles.rows
}

async function fetchArticleById(article_id) {
    const article = await db.query(`SELECT articles.author, articles.title, articles.article_id, articles.body,
    articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    if (article.rows.length === 0) return Promise.reject({ status: 404, message: "This article does not exist" })
    return article.rows[0]
}

async function updateArticleById(article_id, inc_votes) {
    const article = await db.query(`UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1 RETURNING *;`, [article_id, inc_votes])
    return article.rows[0]
}

async function fetchArticleCommentsById(article_id) {
    const comments = await db.query(`SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
    return comments.rows
}

async function insertArticleCommentById(article_id, newComment) {
    const comment = await db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`, [newComment.username, newComment.body, article_id])
    return comment.rows[0]
}

async function checkQueryExists(query, table, queryName){
    const validQueries = await db.query(`SELECT ${queryName} FROM ${table} GROUP BY ${queryName};`)
    const validQueryQueries = validQueries.rows.map(obj => obj.topic)

    if (!validQueryQueries.includes(query[queryName])) return false
}

module.exports = {fetchArticleById, fetchArticles, fetchArticleCommentsById, insertArticleCommentById, updateArticleById}