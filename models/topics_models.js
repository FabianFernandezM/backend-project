const db = require("../db/connection")
const fs = require("fs")

function fetchTopics() {
    return require(`${__dirname}/../db/data/test-data/topics.js`)
}

module.exports = {fetchTopics}