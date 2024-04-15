const db = require("../db/connection")

function fetchTopics() {
    return db.query("SELECT slug, description FROM topics;")
    .then((topics) => {
        return topics.rows
    })
}

function fetchArticles() {
    const sqlStr = `SELECT articles.author, articles.title, articles.article_id,
    articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db.query(sqlStr)
    .then((articles) => {
        return articles.rows
    })
}

function fetchArticleById(article_id) {
    return db.query(`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
    FROM articles
    WHERE article_id = $1;`, [article_id])
    .then((article) => {
        if (article.rows.length === 0) return Promise.reject({status: 404, message: "This article does not exist"})
        return article.rows[0]
    })
}

module.exports = {fetchTopics, fetchArticleById, fetchArticles}