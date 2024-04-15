const {fetchTopics, fetchEndPoints} = require("../models/topics_models")

async function getTopics(req, res, next) {
    try {
        const topics = await fetchTopics()
        res.status(200).send(topics)
    } 
    catch (error) {
        next(error)
    }
}

async function getEndpoints(req, res, next) {
    try {
        const endpoints = await fetchEndPoints()
        res.status(200).send(endpoints)
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics, getEndpoints}