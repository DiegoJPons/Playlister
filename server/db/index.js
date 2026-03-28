
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const dbConnect = (process.env.DB_CONNECT || '').trim()

function maskMongoUri(uri) {
    return uri.replace(/^(mongodb(?:\+srv)?:\/\/)([^:]+):[^@]+(@)/, '$1$2:***$3')
}

if (!dbConnect) {
    console.error(
        'DB_CONNECT is missing or empty. Add it under Render → Environment (exact name: DB_CONNECT).'
    )
} else {
    console.log('Mongo URI (password hidden):', maskMongoUri(dbConnect))
    mongoose.connect(dbConnect).catch((e) => {
        console.error('Connection error', e.message)
    })
}

const db = mongoose.connection

module.exports = db

