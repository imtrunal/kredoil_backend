require('dotenv').config()

let CONFIG = {}

CONFIG.mongooseUrl = process.env.MONGOOSEURL || 'mongodb+srv://0083work:YPG8VcR1lvAkx6T0@cluster0.jjaknde.mongodb.net/kredoil'
CONFIG.secret_key = process.env.SECRET_TOKEN || 'kredoilLubricant'

module.exports = CONFIG