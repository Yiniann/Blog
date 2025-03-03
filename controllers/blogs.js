const blogsRouter = require('express').Router()//定义blogsRouter为express路由
const Blog = require('../models/blog')//导入博客模型
const User = require('../models/user') // 导入用户模型
const { tokenExtractor, userExtractor } = require('../utils/middleware')

//获取全部博客
blogsRouter.get('/', async(req,res)=>{
  try{
    const blogs =await Blog.find({}).populate('user', { username: 1, name: 1 })//使用populate显示所有博客，使创建者的用户信息与博客一起显示。
    return res.json(blogs)
  } catch (error){
    console.error('Error fetching blogs:', error) // 打印日志以便调试
    return res.status(500).json({ error: 'Failed to fetch blogs' }) 
  }
  
})
//创建博客
blogsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !author || !url) {
    return res.status(400).json({ error: 'Title, author, and URL are required' })
  }

  const user = req.user// 从 userExtractor 获取用户

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id // 关联到当前用户
  });

  try {
    const savedBlog = await blog.save()
    
    user.blogs = [...(user.blogs || []), savedBlog._id]
    await user.save()

    return res.status(201).json(savedBlog)
  } catch (error) {
    console.error('Error saving blog:', error);
    return res.status(400).json({ error: 'Failed to save blog' })
  }
})

//获取单个博客
blogsRouter.get('/:id', async(req,res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', { username:1, name: 1})//使用populate方法
    if (blog) {
      return res.json(blog)
    } else {
      return res.status(404).end()
    }
  }catch (error){
    res.status(400).json({error:'Failed to fetching Blog'})
  }
})

//删除blog
blogsRouter.delete('/:id', tokenExtractor, userExtractor, async(req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id) // 根据 ID 删除博客

    if (!blog){
      return res.status(404).json({ error: 'Blog not found' })
    }
    //对比ObjectId
    if (blog.user.toString() !== req.user._id.toString()){
      return res.status(403).json({ error: 'You do not have permission to delete this blog' })
    }
    await Blog.findByIdAndDelete(req.params.id)
    return res.status(204).end()
  }catch (error){
    console.error("Error deleting blog:",error)
    return res.status(400).json({ error: 'Failed to delete blog' }) // 返回 400 错误，表示删除失败
  }
})

//更改博客（likes）
blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes value is required' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true }
    )

    if (updatedBlog) {
      return res.json(updatedBlog)
    } else {
      return res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    console.error('Error updating blog:', error)
    return res.status(400).json({ error: 'Failed to update blog' })
  }
})

module.exports = blogsRouter