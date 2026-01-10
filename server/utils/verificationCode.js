const crypto = require('crypto')

/**
 * 生成6位随机数字验证码
 * @returns {string} 6位数字验证码
 */
function generateVerificationCode() {
  // 方法1: 使用crypto生成随机数（更安全）
  const randomBytes = crypto.randomBytes(3)
  const code = parseInt(randomBytes.toString('hex'), 16) % 1000000
  return code.toString().padStart(6, '0')
}

/**
 * 生成6位随机数字验证码（备用方法）
 * @returns {string} 6位数字验证码
 */
function generateVerificationCodeSimple() {
  // 方法2: 使用Math.random()
  const code = Math.floor(100000 + Math.random() * 900000)
  return code.toString()
}

/**
 * 生成随机字符串（用于token等）
 * @param {number} length - 字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex').substring(0, length)
}

/**
 * 验证码存储结构
 * key: email
 * value: { code, expiresAt, attempts, sentAt }
 */
const verificationStore = new Map()

/**
 * 存储验证码
 * @param {string} email - 邮箱地址
 * @param {string} code - 验证码
 * @param {number} expiryMinutes - 过期时间（分钟）
 */
function storeVerificationCode(email, code, expiryMinutes = 10) {
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000
  verificationStore.set(email.toLowerCase(), {
    code,
    expiresAt,
    attempts: 0,
    sentAt: Date.now()
  })
}

/**
 * 验证验证码
 * @param {string} email - 邮箱地址
 * @param {string} code - 用户输入的验证码
 * @returns {Object} { success, message }
 */
function verifyCode(email, code) {
  const emailLower = email.toLowerCase()
  const stored = verificationStore.get(emailLower)

  if (!stored) {
    return { success: false, message: '验证码不存在或已过期' }
  }

  // 检查是否过期
  if (Date.now() > stored.expiresAt) {
    verificationStore.delete(emailLower)
    return { success: false, message: '验证码已过期' }
  }

  // 检查尝试次数（防止暴力破解）
  if (stored.attempts >= 5) {
    verificationStore.delete(emailLower)
    return { success: false, message: '验证次数过多，请重新获取验证码' }
  }

  // 增加尝试次数
  stored.attempts++

  // 验证码比对
  if (stored.code === code) {
    verificationStore.delete(emailLower)
    return { success: true, message: '验证成功' }
  }

  return { 
    success: false, 
    message: `验证码错误，还可以尝试 ${5 - stored.attempts} 次` 
  }
}

/**
 * 检查邮箱是否可以发送验证码（防止频繁发送）
 * @param {string} email - 邮箱地址
 * @param {number} intervalSeconds - 发送间隔（秒）
 * @returns {Object} { canSend, remainingTime }
 */
function canSendVerificationCode(email, intervalSeconds = 60) {
  const stored = verificationStore.get(email.toLowerCase())
  
  if (!stored) {
    return { canSend: true, remainingTime: 0 }
  }

  const timeSinceSent = Date.now() - stored.sentAt
  const intervalMs = intervalSeconds * 1000

  if (timeSinceSent < intervalMs) {
    const remainingTime = Math.ceil((intervalMs - timeSinceSent) / 1000)
    return { canSend: false, remainingTime }
  }

  return { canSend: true, remainingTime: 0 }
}

/**
 * 清理过期的验证码（定时任务）
 */
function cleanupExpiredCodes() {
  const now = Date.now()
  for (const [email, data] of verificationStore.entries()) {
    if (now > data.expiresAt) {
      verificationStore.delete(email)
    }
  }
}

// 每5分钟清理一次过期验证码
setInterval(cleanupExpiredCodes, 5 * 60 * 1000)

module.exports = {
  generateVerificationCode,
  generateVerificationCodeSimple,
  generateRandomString,
  storeVerificationCode,
  verifyCode,
  canSendVerificationCode,
  cleanupExpiredCodes
}
