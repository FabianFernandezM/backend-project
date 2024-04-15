const db = require("../db/connection")
const fs = require("fs")

function fetchTopics() {
    return require(`${__dirname}/../db/data/test-data/topics.js`)
}

function fetchEndPoints() {
    return require(`${__dirname}/../endpoints.json`)
}

module.exports = {fetchTopics, fetchEndPoints}