const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth.routes')
const { testConnection } = require('./services/emailService')

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 路由
app.use('/api/auth', authRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'HobbyTrain Wiki Email Service'
  })
})

// 测试SMTP连接
app.get('/api/test-email', async (req, res) => {
  const result = await testConnection()
  res.json(result)
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

// 启动服务器
app.listen(PORT, async () => {
  console.log(`\n🚀 服务器启动成功!`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`📧 邮件服务: 已配置\n`)

  // 测试SMTP连接
  console.log('🔍 测试SMTP连接...')
  const testResult = await testConnection()
  if (testResult.success) {
    console.log('✅ SMTP连接正常\n')
  } else {
    console.log('❌ SMTP连接失败:', testResult.error)
    console.log('💡 请检查 .env 文件中的邮箱配置\n')
  }
})

module.exports = app
