const { Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true, unique: true},
    name: {type: String},
    status: {type: String},
    roomsIds: [{type: Types.ObjectId, ref: 'Room'}],
    lastActivity: {type: Date}
})

module.exports = model('User', schema)