const {fetchTopics, insertTopic} = require("../models/topics_models")

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

async function postTopic(req, res, next) {
    const newTopic = req.body
    try {
        const topic = await insertTopic(newTopic)
        res.status(201).send({topic})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics, getEndpoints, postTopic}