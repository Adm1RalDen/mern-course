const jwt = require('jsonwebtoken')
const config = require('config')
const Message = require('../models/Message')
const Room = require('../models/Room')
const User = require('../models/User')

module.exports = io => {
    io.use((socket, next) => {
        if (socket.handshake.auth.token) {
            try {
                socket.userId = jwt.verify(socket.handshake.auth.token, config.get('jwtSecret')).userId
                next()
            } catch (e) {
                next(new Error('Authentication error'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', (socket) => {
        console.log('success connected')

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('new message', async content => {
            if (content.message && content.roomId) {
                try {
                    const newMSG = {
                        content: content.message,
                        userId: socket.userId,
                        chatRoomId: content.roomId
                    }
                    const message = new Message(newMSG)
                    await message.save()

                    socket.broadcast.emit('new message', message)
                    socket.emit("status", "success")
                } catch (e) {
                    socket.emit("error", e.message)
                }
            } else {
                socket.emit("error", "room not found or message")
            }
        })

        socket.on('messagesHistory', async ({chatRoomId}) => {
            Message
                .find({chatRoomId})
                .limit(10)
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('message list', messages)
                    }
                })
        })

        socket.on('createRoom', async (content) => {
            console.log('start create Room')
            if (content.roomName) {
                const room = new Room({
                    name: content.roomName
                })
                await room.save()
                console.log('we is start find user', socket.userId)
                User.updateOne({_id: socket.userId}, {
                    $push: {
                        roomsIds: room.id
                    }
                }, (err, res) => {
                    console.log(err.message)
                })
            }
        })
    })
}