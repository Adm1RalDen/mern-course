const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const cors = require('cors')

const PORT = config.get('port') || 5000

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        const server = app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))

        const io = require('socket.io')(server, {
            cors: {
                origin: ["http://localhost:3000"],
            }
        });

        require('./sockets/socket')(io)
    }catch (e) {
        console.log(`Server Error`, e.message)
        process.exit(1)
    }
}

app.use(express.json({extended: true}))
app.use(cors())


app.use('/api/auth', require('./routes/auth.routes'))

// if(process.env.NODE_ENV === 'production') {
//     app.use('/', express.static(path.join(__dirname, 'client', 'build')))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

start().then(() => console.log('START SERVER ...'))