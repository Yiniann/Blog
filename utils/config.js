require('dotenv').config() //导入dotenv配置

const PORT = process.env.PORT || 3003 //使用.env下的端口运行，如果没有则使用3003端口
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/bloglist'//使用.env 下的url或者本地
const JWT_SECRET = process.env.JWT_SECRET 
//导出模块
module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET
}