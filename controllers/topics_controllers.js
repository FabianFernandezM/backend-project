const {fetchTopics} = require("../models/topics_models")

async function getTopics(req, res, next) {
    try {
        const topics = await fetchTopics()
        res.status(200).send(topics)
    } 
    catch (error) {
        next(error)
    }
}

module.exports = {getTopics}