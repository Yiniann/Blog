//信息处理
const info = (...params) => {
  console.log(...params)
}
//错误处理
const error = (...params) => {
  console.error(...params) 
}

module.exports = {
  info,
  error
}