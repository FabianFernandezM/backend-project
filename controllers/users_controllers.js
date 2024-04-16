const { fetchUsers } = require("../models/users_models")


async function getUsers(req, res, next) {
    try {
        const users = await fetchUsers()
        res.status(200).send({users})
    } 
    catch (error) {
        next(error)
    }
}

module.exports = { getUsers }