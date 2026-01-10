const { sendVerificationCode } = require('../services/emailService')
const { verifyCode, generateVerificationCode } = require('../utils/verificationCode')
const { validateEmailForRegistration, isQQEmail, maskEmail } = require('../utils/emailValidator')

console.log('🧪 哈比列车Wiki - 邮箱验证系统测试\n')

// 测试验证码生成
function testCodeGeneration() {
  console.log('📝 测试1: 验证码生成')
  console.log('=' .repeat(50))
  
  const codes = []
  for (let i = 0; i < 10; i++) {
    const code = generateVerificationCode()
    codes.push(code)
    console.log(`生成验证码 ${i + 1}: ${code}`)
  }
  
  // 检查验证码格式
  const allValid = codes.every(code => /^\d{6}$/.test(code))
  console.log(`\n✅ 所有验证码格式正确: ${allValid}`)
  console.log(`✅ 验证码范围: ${Math.min(...codes.map(Number))} - ${Math.max(...codes.map(Number))}`)
  console.log()
}

// 测试邮箱验证
function testEmailValidation() {
  console.log('📧 测试2: 邮箱格式验证')
  console.log('=' .repeat(50))
  
  const testEmails = [
    { email: '123456789@qq.com', shouldPass: true, desc: '数字QQ邮箱' },
    { email: 'test@qq.com', shouldPass: true, desc: '英文QQ邮箱' },
    { email: 'test_user@qq.com', shouldPass: true, desc: '带下划线的QQ邮箱' },
    { email: 'test.user@qq.com', shouldPass: true, desc: '带点的QQ邮箱' },
    { email: 'test@163.com', shouldPass: false, desc: '163邮箱' },
    { email: 'test@gmail.com', shouldPass: false, desc: 'Gmail邮箱' },
    { email: 'invalid-email', shouldPass: false, desc: '无效格式' },
    { email: '@qq.com', shouldPass: false, desc: '缺少用户名' },
    { email: 'test@', shouldPass: false, desc: '缺少域名' },
    { email: '', shouldPass: false, desc: '空字符串' }
  ]
  
  testEmails.forEach(({ email, shouldPass, desc }) => {
    const result = validateEmailForRegistration(email)
    const status = result.valid === shouldPass ? '✅' : '❌'
    console.log(`${status} ${desc}: ${email}`)
    if (!result.valid) {
      console.log(`   原因: ${result.message}`)
    }
  })
  console.log()
}

// 测试QQ邮箱判断
function testQQEmailDetection() {
  console.log('🔍 测试3: QQ邮箱识别')
  console.log('=' .repeat(50))
  
  const testEmails = [
    '123456789@qq.com',
    'test@qq.com',
    'test_123@qq.com',
    'test@163.com',
    'test@qq.cn',
    'test@qqmail.com'
  ]
  
  testEmails.forEach(email => {
    const isQQ = isQQEmail(email)
    console.log(`${isQQ ? '✅' : '❌'} ${email} - ${isQQ ? 'QQ邮箱' : '非QQ邮箱'}`)
  })
  console.log()
}

// 测试邮箱脱敏
function testEmailMasking() {
  console.log('🔒 测试4: 邮箱脱敏')
  console.log('=' .repeat(50))
  
  const testEmails = [
    '123456789@qq.com',
    'test@qq.com',
    'verylongemailaddress@qq.com',
    'a@qq.com'
  ]
  
  testEmails.forEach(email => {
    const masked = maskEmail(email)
    console.log(`${email} → ${masked}`)
  })
  console.log()
}

// 测试发送验证码（需要配置SMTP）
async function testSendVerificationCode() {
  console.log('📤 测试5: 发送验证码（可选）')
  console.log('=' .repeat(50))
  console.log('💡 提示: 请先配置 .env 文件中的邮箱信息')
  console.log('💡 如需测试发送功能，请取消下方代码的注释并填入真实QQ邮箱\n')
  
  // 取消下方注释进行实际发送测试
  /*
  const testEmail = 'your_test_email@qq.com' // 替换为你的QQ邮箱
  console.log(`正在发送验证码到: ${testEmail}`)
  
  const result = await sendVerificationCode(testEmail)
  console.log('发送结果:', result)
  
  if (result.success) {
    console.log('\n✅ 验证码已发送，请查收邮件！')
    console.log('💡 收到验证码后，可以使用 verifyCode() 函数进行验证')
  } else {
    console.log('\n❌ 发送失败:', result.message)
  }
  */
  
  console.log('⏭️  跳过实际发送测试（需要配置SMTP）')
  console.log()
}

// 测试验证码验证流程
function testVerificationFlow() {
  console.log('🔄 测试6: 验证码验证流程')
  console.log('=' .repeat(50))
  
  const { storeVerificationCode } = require('../utils/verificationCode')
  const testEmail = 'test@qq.com'
  const testCode = '123456'
  
  // 存储验证码
  storeVerificationCode(testEmail, testCode, 10)
  console.log(`✅ 已存储验证码: ${testEmail} → ${testCode}`)
  
  // 测试正确验证码
  console.log('\n测试验证正确的验证码:')
  let result = verifyCode(testEmail, testCode)
  console.log(`结果: ${result.success ? '✅' : '❌'} ${result.message}`)
  
  // 再次存储用于错误测试
  storeVerificationCode(testEmail, testCode, 10)
  
  // 测试错误验证码
  console.log('\n测试验证错误的验证码:')
  result = verifyCode(testEmail, '654321')
  console.log(`结果: ${result.success ? '✅' : '❌'} ${result.message}`)
  
  // 测试不存在的邮箱
  console.log('\n测试不存在的邮箱:')
  result = verifyCode('nonexistent@qq.com', '123456')
  console.log(`结果: ${result.success ? '✅' : '❌'} ${result.message}`)
  
  console.log()
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始运行所有测试...\n')
  
  testCodeGeneration()
  testEmailValidation()
  testQQEmailDetection()
  testEmailMasking()
  testVerificationFlow()
  await testSendVerificationCode()
  
  console.log('=' .repeat(50))
  console.log('✅ 所有测试完成！')
  console.log('\n💡 下一步:')
  console.log('1. 配置 server/.env 文件中的 QQ 邮箱信息')
  console.log('2. 运行 npm start 启动服务器')
  console.log('3. 访问 http://localhost:3000/api/test-email 测试SMTP连接')
  console.log('4. 使用 POST /api/auth/send-code 发送真实验证码')
}

// 执行测试
runAllTests().catch(console.error)
