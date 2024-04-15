const {fetchTopics} = require("../models/topics_models")

function getEndpoints(req, res, next) {
    const endpoints = require(`${__dirname}/../endpoints.json`)
    res.status(200).send({endpoints})
}

async function getTopics(req, res, next) {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics, getEndpoints}