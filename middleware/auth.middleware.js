const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if(!token) {
            return res.status(401).json({message: "Не авторизированый запрос"})
        }
        // получаем закодированые данные в токене пользователя
        req.user = jwt.verify(token, config.get('jwtSecret'))
        next()
    }catch (e) {
        console.log(e.message)
        if(e.message === 'jwt expired'){
            return res.status(401).json({message: "Срок действия токена истек", code: 1000})
        }
        return res.status(401).json({message: "Не авторизированый запрос"})
    }
}