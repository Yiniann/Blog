const logger = require('./logger')//将logger模块导入
const jwt = require('jsonwebtoken')//导入jwt
const User = require('../models/user') // 导入user模型


//请求信息
const requestLogger =(req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('---')
  next()
}


// 从请求头中提取 token
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    req.token = token
  } else {
    req.token = null
  }
  next()
}

// 验证该 token 并从中解码出用户的相关信息
const userExtractor = async (req, res, next) => {
  try {
    const token = req.token
    if (!token) {
      return res.status(401).json({ error: 'Token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired' })
  }
}


//未知端口处理
const unknowEndpoint = (req, res) => {
  return res.status(404).send({error:'unknow endpoint'})
}

module.exports = {
  requestLogger,
  unknowEndpoint,
  tokenExtractor,
  userExtractor
}