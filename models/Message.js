const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    timeSent: {type: Date, default: Date.now},
    content: {type: String},
    userId: {type: Types.ObjectId, ref: 'User'},
    chatRoomId: {type: Types.ObjectId, ref: 'Room'},

})

module.exports = model('Message', schema)