const db = require("../db/connection")

function fetchTopics() {
    return db.query("SELECT slug, description FROM topics;")
    .then((topics) => {
        return topics.rows
    })
}

function fetchEndPoints() {
    return require(`${__dirname}/../endpoints.json`)
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

module.exports = {fetchTopics, fetchEndPoints, fetchArticleById}