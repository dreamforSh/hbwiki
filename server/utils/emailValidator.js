const emailConfig = require('../config/email.config')

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * 验证是否为QQ邮箱
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为QQ邮箱
 */
function isQQEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailLower = email.toLowerCase().trim()
  
  // 检查是否以 @qq.com 结尾
  if (!emailLower.endsWith('@qq.com')) {
    return false
  }

  // 提取@前面的部分
  const localPart = emailLower.split('@')[0]
  
  // QQ邮箱账号规则：
  // 1. 纯数字QQ号（5-11位）
  // 2. 英文邮箱（字母开头，包含字母、数字、下划线、点、减号）
  
  // 检查是否为纯数字QQ号
  const isNumericQQ = /^\d{5,11}$/.test(localPart)
  
  // 检查是否为英文邮箱格式
  const isEnglishEmail = /^[a-z][a-z0-9._-]*$/.test(localPart)
  
  return isNumericQQ || isEnglishEmail
}

/**
 * 验证邮箱是否符合注册要求
 * @param {string} email - 邮箱地址
 * @returns {Object} { valid, message }
 */
function validateEmailForRegistration(email) {
  // 1. 检查是否为空
  if (!email || typeof email !== 'string') {
    return { valid: false, message: '邮箱地址不能为空' }
  }

  // 去除首尾空格
  const trimmedEmail = email.trim()

  // 2. 检查长度
  if (trimmedEmail.length < 6 || trimmedEmail.length > 50) {
    return { valid: false, message: '邮箱地址长度应在6-50个字符之间' }
  }

  // 3. 检查基本格式
  if (!isValidEmailFormat(trimmedEmail)) {
    return { valid: false, message: '邮箱格式不正确' }
  }

  // 4. 检查是否为QQ邮箱
  if (!isQQEmail(trimmedEmail)) {
    return { valid: false, message: '仅支持QQ邮箱注册（@qq.com）' }
  }

  // 5. 检查域名是否在允许列表中
  const domain = trimmedEmail.split('@')[1].toLowerCase()
  if (!emailConfig.email.allowedDomains.includes(domain)) {
    return { 
      valid: false, 
      message: `仅支持以下邮箱域名：${emailConfig.email.allowedDomains.join(', ')}` 
    }
  }

  return { valid: true, message: '邮箱验证通过', email: trimmedEmail.toLowerCase() }
}

/**
 * 获取QQ邮箱类型说明
 * @param {string} email - 邮箱地址
 * @returns {string} 邮箱类型
 */
function getQQEmailType(email) {
  if (!isQQEmail(email)) {
    return 'unknown'
  }

  const localPart = email.split('@')[0]
  
  if (/^\d+$/.test(localPart)) {
    return 'numeric' // 数字QQ号
  }
  
  return 'english' // 英文邮箱
}

/**
 * 邮箱脱敏显示
 * @param {string} email - 邮箱地址
 * @returns {string} 脱敏后的邮箱
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) {
    return email
  }

  const [local, domain] = email.split('@')
  
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`
  }

  const visibleStart = local.substring(0, 3)
  const visibleEnd = local.substring(local.length - 1)
  const masked = `${visibleStart}***${visibleEnd}@${domain}`
  
  return masked
}

/**
 * 批量验证邮箱列表
 * @param {Array<string>} emails - 邮箱地址数组
 * @returns {Object} { valid, invalid }
 */
function validateEmailList(emails) {
  const valid = []
  const invalid = []

  emails.forEach(email => {
    const result = validateEmailForRegistration(email)
    if (result.valid) {
      valid.push(result.email)
    } else {
      invalid.push({ email, reason: result.message })
    }
  })

  return { valid, invalid }
}

module.exports = {
  isValidEmailFormat,
  isQQEmail,
  validateEmailForRegistration,
  getQQEmailType,
  maskEmail,
  validateEmailList
}
