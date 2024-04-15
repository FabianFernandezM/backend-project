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

module.exports = {fetchTopics, fetchEndPoints}

//(`${__dirname}/../db/data/test-data/topics.js`)