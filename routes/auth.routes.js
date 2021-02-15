const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = Router()
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

//  /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Не валидный пароль').isEmail(),
        check('password', 'Минимальная длина поля, 4 символа').isLength({min: 4}),
        check('name', 'Минимальная длина 2 символа').isLength({min: 2}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array(), message: "Неверные данные"})
            }

            const {email, password, name} = req.body
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: "Пользователь уже существует"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                password: hashedPassword,
                name,
                status: 'offline',
                roomsIds: [],
                lastActivity: Date.now()
            })

            await user.save()

            // 201 - статус повертається при успішному створенні
            res.status(201).json({message: "Пользователь успешно создан"})

        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
        }
    })

router.post(
    '/login',
    [
        check('email', 'Не валидная почта').isEmail(),
        check('password', 'Поля обязательное').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array(), message: "Неверные данные"})
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: "Неверный пароль"})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: "1h"}
            )
            const obj = user.toObject()
            delete obj.password
            console.log(user)
            // статус по замовчуванню 200
            return res.json({token, user: obj, message: "Успешный логин"})
        } catch (e) {
            console.log('this message', e.message)
            res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
        }
    })

module.exports = router