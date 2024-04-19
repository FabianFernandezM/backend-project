const db = require("../db/connection")

function fetchTopics() {
    return db.query("SELECT slug, description FROM topics;")
    .then((topics) => {
        return topics.rows
    })
}

async function insertTopic(newTopic) {
    const topic = await db.query("INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;", [newTopic.slug, newTopic.description])
    return topic.rows[0]
}

module.exports = {fetchTopics, insertTopic}