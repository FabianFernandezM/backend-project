const db = require("../db/connection")
const { removeCommentById } = require("./comments_models")

async function fetchArticles(query, queryNames) {
    const validQueryNames = ["topic", "sort_by", "order", "p", "limit"]

    for (let i = 0; i < queryNames.length; i++) {
        if (!validQueryNames.includes(queryNames[i]))
        return Promise.reject({ status: 400, message: `Query not allowed` })
    }
    const queryValues = []
    const totalCountQueryValues = []

    let sqlStr = `SELECT articles.author, articles.title, articles.article_id,
    articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `

    let sqlCountStr = `SELECT COUNT(*)::INT AS total_count FROM articles `

    if (query.topic){
        const topicExists = await checkTopicExists(query.topic)
        if (topicExists === false) return Promise.reject({ status: 404, message: "Not found" })

        queryValues.push(query.topic)
        totalCountQueryValues.push(query.topic)
        sqlStr += `WHERE topic=$${queryValues.length} `
        sqlCountStr += `WHERE topic=$${queryValues.length} `
    }

    sqlStr += `GROUP BY articles.article_id `

    if (query.sort_by){
        const sortByExists = await checkSortByExists(query.sort_by)
        if (sortByExists === false) return Promise.reject({ status: 400, message: "Column does not exist" })

        sqlStr += `ORDER BY articles.${query.sort_by} `
    } else {sqlStr += `ORDER BY articles.created_at `}

    if (query.order){
        const validOrders = ["ASC", "DESC"]
        if (!validOrders.includes(query.order.toUpperCase())) return Promise.reject({ status: 400, message: "Order not valid" })

        sqlStr += `${query.order} `
    } else {sqlStr += `ASC `}

    if (query.p){
        const regex = /[0-9]/
        if (!regex.test(query.p)) return Promise.reject({ status: 400, message: "Page not valid" })

        sqlStr += `OFFSET ${(query.p - 1)*10} ROWS `
    } else { sqlStr += `OFFSET 0 ROWS `}

    if (query.limit){
        const regex = /[0-9]/
        if (!regex.test(query.limit)) return Promise.reject({ status: 400, message: "Limit not valid" })

        sqlStr += `FETCH FIRST ${query.limit} ROW ONLY;`
    } else { sqlStr += `FETCH FIRST 10 ROW ONLY;`}


    const totalArticles = await db.query(sqlCountStr, totalCountQueryValues)
    const articles = await db.query(sqlStr, queryValues)

    return { "articles" : articles.rows, "total_count" : totalArticles.rows[0].total_count }
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

async function insertArticle(newArticle) {
    const defaultUrl = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
    const article = await db.query(`INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [newArticle.title, newArticle.topic, newArticle.author, newArticle.body, newArticle.article_img_url || defaultUrl])
    return article.rows[0]
}

async function fetchArticleCommentsById(article_id, query, queryNames) {
    const validQueryNames = ["p", "limit"]

    for (let i = 0; i < queryNames.length; i++) {
        if (!validQueryNames.includes(queryNames[i]))
        return Promise.reject({ status: 400, message: `Query not allowed` })
    }

    let sqlStr = `SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC `

    if (query.p){
        const regex = /[0-9]/
        if (!regex.test(query.p)) return Promise.reject({ status: 400, message: "Page not valid" })

        sqlStr += `OFFSET ${(query.p - 1)*10} ROWS `
    } else { sqlStr += `OFFSET 0 ROWS `}

    if (query.limit){
        const regex = /[0-9]/
        if (!regex.test(query.limit)) return Promise.reject({ status: 400, message: "Limit not valid" })

        sqlStr += `FETCH FIRST ${query.limit} ROW ONLY;`
    } else { sqlStr += `FETCH FIRST 10 ROW ONLY;`}

    const comments = await db.query(sqlStr, [article_id])
    return comments.rows
}

async function insertArticleCommentById(article_id, newComment) {
    const comment = await db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`, [newComment.username, newComment.body, article_id])
    return comment.rows[0]
}

async function removeArticleById(article_id) {
    const comments = await db.query(`SELECT comment_id FROM comments WHERE article_id = $1;`, [article_id])

    for await (const comment of comments.rows) {
        await removeCommentById(comment.comment_id)
    }

    const output = await db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    return output
}

async function checkTopicExists(topic){
    const topics = await db.query(`SELECT slug FROM topics;`)
    const topicValues = topics.rows.map(obj => obj["slug"])

    if (!topicValues.includes(topic)) return false
    else return true
}

async function checkSortByExists(sortBy){
    const article = await db.query(`SELECT * FROM articles WHERE article_id = 1;`)
    const validSortBys = Object.keys(article.rows[0])

    if (!validSortBys.includes(sortBy)) return false
    else return true
}

module.exports = {fetchArticleById, fetchArticles, fetchArticleCommentsById, insertArticleCommentById, updateArticleById, insertArticle, removeArticleById}
