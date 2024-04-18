const { fetchUsers, fetchUserByUsername } = require("../models/users_models")


async function getUsers(req, res, next) {
    try {
        const users = await fetchUsers()
        res.status(200).send({users})
    } 
    catch (error) {
        next(error)
    }
}

async function getUserByUsername(req, res, next) {
    const username = req.params.username
    try {
        const user = await fetchUserByUsername(username)
        res.status(200).send({user})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = { getUsers, getUserByUsername }