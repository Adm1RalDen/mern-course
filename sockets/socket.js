const jwt = require('jsonwebtoken')
const config = require('config')
const Message = require('../models/Message')
const Room = require('../models/Room')
const User = require('../models/User')

const createConnections = async (socket) => {
    socket.join(socket.userId)
    const user = await User.findOne({_id: socket.userId})
    const parsedUser = user.toObject()
    socket.join(parsedUser.roomsIds.map(e => e.toString()))
}

const done = (err, res) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log(res)
    }
}

module.exports = io => {
    console.log('started listening')

    io.use((socket, next) => {
        console.log('catch connect')
        if (socket.handshake.auth.token) {
            console.log('get token', socket.handshake.auth.token)
            try {
                socket.userId = jwt.verify(socket.handshake.auth.token, config.get('jwtSecret')).userId
                console.log('get user ID', socket.userId)
                next()
            } catch (e) {
                console.log('get error', e.message)
                next(new Error('Authentication error'));
            }
        } else {
            console.log('get authorize error', e.message)
            next(new Error('Authentication error'));
        }
    }).on('connection', async (socket) => {
        console.log('success connected')

        await createConnections(socket)

        socket.on('createNewContact', async content => {
            console.log('createNewContact', content)
            if (content.userId && content.nickname) {
                const newContact = {
                    userId: content.userId,
                    nickname: content.nickname
                }

                User.updateOne({_id: socket.userId}, {
                    $push: {
                        contacts: newContact
                    }
                }, done)
                socket.emit('gotNewContact', newContact)
            } else {
                socket.emit('error-message', 'userId or nickname not found')
            }
        })

        socket.on('getContactList', async () => {
            try {
                const user = await User.findOne({_id: socket.userId})
                socket.emit('gotContactList', user.contacts)
            } catch (e) {
                socket.emit('error-message', e.message)
            }
        })

        socket.on('newMessage', async content => {
            if (content.message && content.roomId) {
                try {
                    const newMSG = {
                        content: content.message,
                        userId: socket.userId,
                        chatRoomId: content.roomId
                    }
                    const message = new Message(newMSG)
                    await message.save()

                    io.to(content.roomId).emit('newMessage', message)
                } catch (e) {
                    socket.emit("error", e.message)
                }
            } else {
                socket.emit("error", "room not found or message")
            }
        })

        socket.on('getMessagesList', async ({chatRoomId}) => {
            Message
                .find({chatRoomId})
                .limit(10)
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('listOfMessages', messages)
                    }
                })
        })

        socket.on('createRoom', async (content) => {
            console.log('start create new room', content)
            if (content.roomName && content.userId) {
                const room = new Room({
                    name: content.roomName
                })
                await room.save()

                User.updateOne({_id: socket.userId}, {
                    $push: {
                        roomsIds: room.id
                    }
                }, done)
                User.updateOne({_id: content.userId}, {
                    $push: {
                        roomsIds: room.id
                    }
                }, done)
                io.to(content.userId).emit('addedToNewRoom', room) // посилаєм комнату добавленому пользователю
                socket.emit('addedToNewRoom', room) // посилаєм данные о комнате пользователю который создал комнату
            }
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })
}