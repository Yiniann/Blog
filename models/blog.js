const mongoose = require('mongoose')//导入mongoose

//定义博客的数据库模型
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

//设置模型返回的json
blogSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()//将_id转为id
    delete returnedObject._id //删除返回的_id
    delete returnedObject.__v
  }
})

//定义Blog为blog模型
const Blog = mongoose.model('Blog',blogSchema)

//导出模块
module.exports = Blog