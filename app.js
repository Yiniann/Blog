const express = require('express') 
const mongoose = require('mongoose')
const cors = require('cors')//跨域
const config = require('./utils/config')//导入配置文件
//导入logger 中间件
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

//导入路由
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
//app为express库
const app = express()

mongoose.set('strictQuery', false)

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI) // 使用 await 进行连接
    logger.info('connected to MongoDB')
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message) // 捕获并记录连接错误
  }
}

connectToMongoDB() // 调用连接函数

//中间件设置
app.use(cors())//跨域
app.use(express.json())//解析json
app.use(express.static('dist'))
app.use(middleware.requestLogger)

//路由设置
app.use('/api/blogs',blogsRouter)
app.use('/api/login',loginRouter)
app.use('/api/user',usersRouter)

//错误处理
app.use(middleware.unknowEndpoint)

module.exports = app