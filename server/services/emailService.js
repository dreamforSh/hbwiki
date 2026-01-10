const nodemailer = require('nodemailer')
const emailConfig = require('../config/email.config')
const { generateVerificationCode, storeVerificationCode, canSendVerificationCode } = require('../utils/verificationCode')
const { validateEmailForRegistration, maskEmail } = require('../utils/emailValidator')

/**
 * 创建邮件传输器
 */
function createTransporter() {
  // 创建传输器配置
  const transportConfig = {
    ...emailConfig.smtp,
    // 禁用安全检查，允许自签名证书
    tls: {
      rejectUnauthorized: false
    }
  }
  
  return nodemailer.createTransport(transportConfig)
}

/**
 * 发送验证码邮件
 * @param {string} email - 接收邮箱
 * @returns {Promise<Object>} 发送结果
 */
async function sendVerificationCode(email) {
  try {
    // 1. 验证邮箱格式和类型
    const emailValidation = validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      return {
        success: false,
        message: emailValidation.message
      }
    }

    const validEmail = emailValidation.email

    // 2. 检查发送频率限制
    const sendCheck = canSendVerificationCode(validEmail, emailConfig.email.sendInterval)
    if (!sendCheck.canSend) {
      return {
        success: false,
        message: `发送过于频繁，请在 ${sendCheck.remainingTime} 秒后重试`
      }
    }

    // 3. 生成验证码
    const code = generateVerificationCode()

    // 4. 存储验证码
    storeVerificationCode(validEmail, code, emailConfig.email.codeExpiry)

    // 5. 准备邮件内容
    const mailOptions = {
      from: emailConfig.email.from,
      to: validEmail,
      subject: emailConfig.email.subject,
      html: emailConfig.email.template(code, emailConfig.email.codeExpiry)
    }

    // 6. 创建传输器并发送邮件
    const transporter = createTransporter()
    const info = await transporter.sendMail(mailOptions)

    console.log(`✅ 验证码已发送到 ${maskEmail(validEmail)}, MessageID: ${info.messageId}`)

    return {
      success: true,
      message: '验证码已发送，请查收邮件',
      data: {
        email: maskEmail(validEmail),
        expiryMinutes: emailConfig.email.codeExpiry
      }
    }

  } catch (error) {
    console.error('❌ 发送验证码失败:', error)
    
    // 根据不同错误返回不同消息
    if (error.code === 'EAUTH') {
      return {
        success: false,
        message: 'SMTP认证失败，请检查邮箱配置'
      }
    } else if (error.code === 'ECONNECTION') {
      return {
        success: false,
        message: '无法连接到邮件服务器'
      }
    } else {
      return {
        success: false,
        message: '发送验证码失败，请稍后重试'
      }
    }
  }
}

/**
 * 测试SMTP连接
 * @returns {Promise<Object>} 连接测试结果
 */
async function testConnection() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    
    return {
      success: true,
      message: 'SMTP连接成功'
    }
  } catch (error) {
    console.error('❌ SMTP连接失败:', error)
    
    return {
      success: false,
      message: 'SMTP连接失败',
      error: error.message
    }
  }
}

/**
 * 发送欢迎邮件
 * @param {string} email - 接收邮箱
 * @param {string} username - 用户名
 * @returns {Promise<Object>} 发送结果
 */
async function sendWelcomeEmail(email, username) {
  try {
    const mailOptions = {
      from: emailConfig.email.from,
      to: email,
      subject: '欢迎加入哈比列车Wiki！',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #ff5c8d, #ff8fab);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
            }
            .btn {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #ff5c8d, #ff8fab);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚂 欢迎来到哈比列车Wiki！</h1>
            </div>
            <div class="content">
              <h2>您好，${username}！</h2>
              <p>感谢您注册哈比列车Wiki账号。</p>
              <p>现在您可以：</p>
              <ul>
                <li>查看最新的游戏更新日志</li>
                <li>浏览详细的职业介绍</li>
                <li>学习游戏玩法和进阶技巧</li>
                <li>参与社区讨论</li>
              </ul>
              <div style="text-align: center;">
                <a href="https://your-wiki-url.com" class="btn">开始探索</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const transporter = createTransporter()
    await transporter.sendMail(mailOptions)

    return { success: true, message: '欢迎邮件已发送' }
  } catch (error) {
    console.error('❌ 发送欢迎邮件失败:', error)
    return { success: false, message: '发送欢迎邮件失败' }
  }
}

module.exports = {
  sendVerificationCode,
  testConnection,
  sendWelcomeEmail
}
