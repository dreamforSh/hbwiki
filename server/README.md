# 哈比列车Wiki - 邮箱验证服务

## 📋 功能特性

- ✅ QQ邮箱验证（仅支持@qq.com）
- ✅ 6位随机数验证码生成
- ✅ SMTP邮件发送
- ✅ 验证码过期机制（10分钟）
- ✅ 发送频率限制（60秒）
- ✅ 验证次数限制（5次）
- ✅ 精美的HTML邮件模板
- ✅ 邮箱格式严格验证

## 🚀 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器端口
PORT=3000

# 前端地址（用于CORS）
CORS_ORIGIN=http://localhost:5173

# QQ邮箱账号
EMAIL_USER=your_qq_email@qq.com

# QQ邮箱SMTP授权码（不是密码！）
EMAIL_PASS=your_smtp_authorization_code

# 发件人名称
EMAIL_FROM="哈比列车Wiki <your_qq_email@qq.com>"
```

### 3. 获取QQ邮箱SMTP授权码

#### 步骤：

1. 登录 [QQ邮箱网页版](https://mail.qq.com)
2. 点击顶部的 **"设置"** → **"账户"**
3. 找到 **"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"** 区域
4. 开启 **"SMTP服务"**
5. 点击 **"生成授权码"** 按钮
6. 按照提示发送短信验证（发送指定内容到指定号码）
7. 验证成功后会显示一个 **16位授权码**（例如：`abcdefghijklmnop`）
8. 将这个授权码填写到 `.env` 文件的 `EMAIL_PASS` 中

⚠️ **注意**：
- 授权码不是QQ密码
- 授权码是16位字母组成的字符串
- 请妥善保管授权码，不要泄露

### 4. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 5. 测试服务

访问健康检查：
```
http://localhost:3000/api/health
```

测试SMTP连接：
```
http://localhost:3000/api/test-email
```

## 📡 API接口文档

### 1. 发送验证码

**接口：** `POST /api/auth/send-code`

**请求体：**
```json
{
  "email": "123456789@qq.com"
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "验证码已发送，请查收邮件",
  "data": {
    "email": "123***9@qq.com",
    "expiryMinutes": 10
  }
}
```

**失败响应：**
```json
{
  "success": false,
  "message": "仅支持QQ邮箱注册（@qq.com）"
}
```

### 2. 验证验证码

**接口：** `POST /api/auth/verify-code`

**请求体：**
```json
{
  "email": "123456789@qq.com",
  "code": "123456"
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "验证成功"
}
```

**失败响应：**
```json
{
  "success": false,
  "message": "验证码错误，还可以尝试 4 次"
}
```

### 3. 验证邮箱格式

**接口：** `POST /api/auth/validate-email`

**请求体：**
```json
{
  "email": "test@qq.com"
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "邮箱验证通过",
  "data": {
    "email": "test@qq.com"
  }
}
```

## 🔐 安全机制

### 1. 邮箱限制
- ✅ 仅支持QQ邮箱（@qq.com）
- ✅ 严格的邮箱格式验证
- ✅ 支持数字QQ号和英文邮箱

### 2. 验证码安全
- ✅ 使用crypto生成真随机数
- ✅ 6位纯数字验证码
- ✅ 10分钟有效期
- ✅ 使用后自动失效

### 3. 防滥用机制
- ✅ 60秒发送间隔限制
- ✅ 最多5次验证尝试
- ✅ 自动清理过期验证码

### 4. 邮箱隐私
- ✅ 响应中邮箱脱敏显示
- ✅ 日志中不显示完整邮箱

## 📧 邮件模板

系统使用精美的HTML邮件模板，包含：
- 🎨 渐变色设计风格
- 📱 响应式布局
- 🔢 大号验证码显示
- ⏰ 清晰的有效期提示
- ⚠️ 安全提醒

## 🧪 测试用例

创建测试文件 `test/test-email.js`：

```javascript
const { sendVerificationCode } = require('../services/emailService')
const { verifyCode } = require('../utils/verificationCode')

async function testEmailVerification() {
  console.log('开始测试邮箱验证功能...\n')

  // 测试发送验证码
  const testEmail = 'your_test_email@qq.com'
  
  console.log('1. 测试发送验证码...')
  const sendResult = await sendVerificationCode(testEmail)
  console.log('结果:', sendResult)

  if (sendResult.success) {
    console.log('\n请查收邮件，并输入验证码进行测试')
  }
}

testEmailVerification()
```

运行测试：
```bash
npm test
```

## 🛠️ 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **Nodemailer** - 邮件发送
- **Crypto** - 加密随机数生成
- **dotenv** - 环境变量管理

## 📝 QQ邮箱验证规则

### 支持的邮箱格式：

1. **数字QQ号邮箱**
   - 格式：`123456789@qq.com`
   - 要求：5-11位纯数字

2. **英文邮箱**
   - 格式：`username@qq.com`
   - 要求：字母开头，可包含字母、数字、下划线、点、减号

### 不支持的格式：
- ❌ 非QQ邮箱域名（如 @163.com, @gmail.com）
- ❌ 特殊字符开头的邮箱
- ❌ 格式不规范的邮箱

## 🔧 常见问题

### 1. SMTP连接失败

**原因：**
- 未开启QQ邮箱SMTP服务
- 授权码填写错误
- 网络连接问题

**解决方案：**
- 检查是否正确开启SMTP服务
- 确认授权码是16位字母字符串
- 检查服务器网络连接

### 2. 验证码收不到

**原因：**
- 邮箱地址错误
- 邮件被拦截进入垃圾箱
- 发送频率过快

**解决方案：**
- 检查邮箱地址拼写
- 查看QQ邮箱的垃圾邮件文件夹
- 等待60秒后重新发送

### 3. 验证码验证失败

**原因：**
- 验证码输入错误
- 验证码已过期
- 尝试次数过多

**解决方案：**
- 仔细核对验证码
- 重新获取新的验证码
- 注意10分钟有效期

## 📄 许可证

ISC
