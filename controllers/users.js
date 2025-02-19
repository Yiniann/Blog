const User = require('../models/user')
const bcrypt = require('bcrypt')
const { tokenExtractor, userExtractor } = require('../utils/middleware')
const usersRouter = require('express').Router()

// 创建用户
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({ error: '用户名必须至少3个字符' })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({ error: '密码必须至少3个字符长' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: '用户已存在' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    blogs: []
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json({ error: '创建用户时发生错误' })
  }
})

// 获取所有用户及其博客
usersRouter.get('/', tokenExtractor, userExtractor, async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 }).populate('blogs.user', { username: 1, name: 1 })
    response.json(users)
  } catch (error) {
    response.status(400).json({ error: '获取用户列表失败' })
  }
})

module.exports = usersRouter
