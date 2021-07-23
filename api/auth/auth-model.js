const db = require('../../data/dbConfig')

const findByID = (id) => {
    return db('users').where('id',id).first()
}

const addUser = async({ username, password }) => {
    const [id] = await db('users').insert({ username: username, password: password })
    return findByID(id)
}

module.exports = {addUser, findByID}