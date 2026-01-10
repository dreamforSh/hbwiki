// SMTP 邮箱配置
module.exports = {
  // QQ邮箱SMTP配置
  smtp: {
    host: process.env.MAIL_SMTP || 'smtp.qq.com',
    port: parseInt(process.env.MAIL_PORT || '465'),
    secure: true, // 使用SSL/TLS
    auth: {
      user: process.env.MAIL_ACCOUNT || '3159559622@qq.com', // QQ邮箱地址
      pass: process.env.MAIL_PASSWORD || 'cnvzrzxcsvgbddec' // SMTP授权码
    }
  },

  // 邮件配置
  email: {
    from: process.env.EMAIL_FROM || '"哈比列车Wiki" <3159559622@qq.com>',
    subject: '【哈比列车Wiki】邮箱验证码',
    
    // 验证码有效期（分钟）
    codeExpiry: 10,
    
    // 验证码长度
    codeLength: 6,
    
    // 允许的邮箱域名（只允许QQ邮箱）
    allowedDomains: ['qq.com'],
    
    // 发送间隔限制（秒）
    sendInterval: 60,
    
    // 邮件模板
    template: (code, expiry) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
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
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .code-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 48px;
            font-weight: 800;
            color: white;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .code-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 10px;
          }
          .info {
            background: #f8f9fa;
            border-left: 4px solid #ff5c8d;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .info-title {
            font-weight: 600;
            color: #ff5c8d;
            margin-bottom: 8px;
          }
          .info-text {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .warning-text {
            color: #856404;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 13px;
          }
          .footer a {
            color: #ff5c8d;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚂 哈比列车Wiki</h1>
            <p>邮箱验证服务</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; color: #333;">您好！</p>
            <p style="color: #666;">您正在注册哈比列车Wiki账号，请使用以下验证码完成验证：</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
              <div class="code-label">验证码</div>
            </div>
            
            <div class="info">
              <div class="info-title">📋 使用说明</div>
              <div class="info-text">• 验证码有效期：<strong>${expiry}分钟</strong></div>
              <div class="info-text">• 请在有效期内完成验证</div>
              <div class="info-text">• 验证码仅可使用一次</div>
            </div>
            
            <div class="warning">
              <p class="warning-text">⚠️ 如果这不是您本人的操作，请忽略此邮件。为了您的账号安全，请勿将验证码透露给他人。</p>
            </div>
          </div>
          
          <div class="footer">
            <p>此邮件由系统自动发送，请勿直接回复</p>
            <p>© 2025 哈比列车Wiki. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
