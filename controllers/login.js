const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // 检查用户名和密码是否提供
  if (!username || !password) {
    return response.status(400).json({ error: '用户名和密码不能为空' })
  }

  try {
    const user = await User.findOne({ username })
    if (!user) {
      return response.status(401).json({ error: '账号或密码错误' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      return response.status(401).json({ error: '账号或密码错误' })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })
    console.log('Generated token:', token)

    return response.status(200).json({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    return response.status(500).json({ error: '登录时发生错误，请稍后再试' })
  }
})

module.exports = loginRouter
