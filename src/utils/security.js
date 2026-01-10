/**
 * 安全工具模块
 * 提供输入验证、XSS防护、SQL注入防护等功能
 */

// ==================== XSS 防护 ====================

/**
 * HTML 实体编码，防止 XSS 攻击
 * @param {string} str - 需要转义的字符串
 * @returns {string} - 转义后的字符串
 */
export const escapeHtml = (str) => {
  if (typeof str !== 'string') return str
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }
  
  return str.replace(/[&<>"'`=\/]/g, (char) => map[char])
}

/**
 * 清理用户输入，移除危险字符和脚本
 * @param {string} input - 用户输入
 * @returns {string} - 清理后的输入
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  // 移除 script 标签
  let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // 移除事件处理器属性
  cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '')
  
  // 移除 javascript: 协议
  cleaned = cleaned.replace(/javascript:/gi, '')
  
  // 移除 data: 协议（可能包含 base64 编码的恶意脚本）
  cleaned = cleaned.replace(/data:text\/html/gi, '')
  
  // 移除 iframe 标签
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  
  // 移除 object 和 embed 标签
  cleaned = cleaned.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
  
  return cleaned.trim()
}

/**
 * 验证并清理 URL，防止 XSS 和开放重定向攻击
 * @param {string} url - 待验证的 URL
 * @returns {string|null} - 安全的 URL 或 null
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  
  // 移除空白字符
  const cleaned = url.trim()
  
  // 禁止的协议
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i
  
  if (dangerousProtocols.test(cleaned)) {
    return null
  }
  
  // 只允许 http、https 和相对路径
  const safeProtocols = /^(https?:\/\/|\/|\.\/|\.\.\/)/i
  
  if (cleaned.startsWith('//')) {
    return null // 禁止协议相对 URL
  }
  
  return safeProtocols.test(cleaned) ? cleaned : null
}

// ==================== SQL 注入防护 ====================

/**
 * 检测 SQL 注入攻击模式
 * @param {string} input - 用户输入
 * @returns {boolean} - 是否检测到注入攻击
 */
export const detectSqlInjection = (input) => {
  if (typeof input !== 'string') return false
  
  // SQL 注入常见模式
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /('|("|`)\s*(OR|AND)\s*('|"|\d+|`)\s*=\s*('|"|\d+|`))/i,
    /(UNION\s+SELECT|UNION\s+ALL\s+SELECT)/i,
    /(CONCAT\s*\(|CHAR\s*\(|ASCII\s*\()/i,
    /(BENCHMARK\s*\(|SLEEP\s*\(|WAITFOR\s+DELAY)/i,
    /(information_schema|mysql\.|sysobjects|syscolumns)/i
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * 清理可能的 SQL 注入字符
 * @param {string} input - 用户输入
 * @returns {string} - 清理后的输入
 */
export const sanitizeSqlInput = (input) => {
  if (typeof input !== 'string') return input
  
  // 转义单引号
  let cleaned = input.replace(/'/g, "''")
  
  // 移除 SQL 注释符
  cleaned = cleaned.replace(/--/g, '')
  cleaned = cleaned.replace(/\/\*/g, '')
  cleaned = cleaned.replace(/\*\//g, '')
  
  // 移除分号（防止多语句注入）
  cleaned = cleaned.replace(/;/g, '')
  
  return cleaned
}

// ==================== 输入验证 ====================

/**
 * 验证用户名格式
 * @param {string} username - 用户名
 * @returns {Object} - 验证结果
 */
export const validateUsername = (username) => {
  const errors = []
  
  if (!username || typeof username !== 'string') {
    return { valid: false, errors: ['用户名不能为空'] }
  }
  
  // 长度验证
  if (username.length < 3) {
    errors.push('用户名长度至少3个字符')
  }
  if (username.length > 20) {
    errors.push('用户名长度不能超过20个字符')
  }
  
  // 只允许字母、数字、下划线、中文
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username)) {
    errors.push('用户名只能包含字母、数字、下划线和中文')
  }
  
  // 检测 SQL 注入
  if (detectSqlInjection(username)) {
    errors.push('用户名包含非法字符')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeInput(username)
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {Object} - 验证结果
 */
export const validateEmail = (email) => {
  const errors = []
  
  if (!email || typeof email !== 'string') {
    return { valid: false, errors: ['邮箱不能为空'] }
  }
  
  // 邮箱格式验证（严格模式）
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9_\-\.])*@([a-zA-Z0-9_\-\.])+\.([a-zA-Z]{2,10})$/
  
  if (!emailRegex.test(email)) {
    errors.push('邮箱格式不正确')
  }
  
  // 长度验证
  if (email.length > 100) {
    errors.push('邮箱长度不能超过100个字符')
  }
  
  // 检测 SQL 注入
  if (detectSqlInjection(email)) {
    errors.push('邮箱包含非法字符')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeInput(email.toLowerCase())
  }
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} - 验证结果
 */
export const validatePassword = (password) => {
  const errors = []
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['密码不能为空'], strength: 'weak' }
  }
  
  // 长度验证
  if (password.length < 8) {
    errors.push('密码长度至少8个字符')
  }
  if (password.length > 50) {
    errors.push('密码长度不能超过50个字符')
  }
  
  // 强度检查
  let strength = 'weak'
  let strengthScore = 0
  
  if (/[a-z]/.test(password)) strengthScore++
  if (/[A-Z]/.test(password)) strengthScore++
  if (/[0-9]/.test(password)) strengthScore++
  if (/[^a-zA-Z0-9]/.test(password)) strengthScore++
  if (password.length >= 12) strengthScore++
  
  if (strengthScore >= 4) strength = 'strong'
  else if (strengthScore >= 3) strength = 'medium'
  
  if (strengthScore < 2) {
    errors.push('密码必须包含大小写字母、数字或特殊字符')
  }
  
  // 检测常见弱密码
  const weakPasswords = ['123456', 'password', '12345678', 'qwerty', 'abc123']
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('密码过于简单，请使用更复杂的密码')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength
  }
}

/**
 * 验证 QQ 号格式
 * @param {string} qqNumber - QQ号
 * @returns {Object} - 验证结果
 */
export const validateQQNumber = (qqNumber) => {
  const errors = []
  
  if (!qqNumber || typeof qqNumber !== 'string') {
    return { valid: false, errors: ['QQ号不能为空'] }
  }
  
  // QQ号格式：5-11位数字，不以0开头
  if (!/^[1-9][0-9]{4,10}$/.test(qqNumber)) {
    errors.push('QQ号格式不正确（5-11位数字）')
  }
  
  // 检测 SQL 注入
  if (detectSqlInjection(qqNumber)) {
    errors.push('QQ号包含非法字符')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: qqNumber.trim()
  }
}

// ==================== CSRF 防护 ====================

/**
 * 生成 CSRF Token
 * @returns {string} - CSRF Token
 */
export const generateCsrfToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * 验证 CSRF Token
 * @param {string} token - 待验证的 Token
 * @param {string} storedToken - 存储的 Token
 * @returns {boolean} - 验证结果
 */
export const verifyCsrfToken = (token, storedToken) => {
  return token === storedToken && token.length === 64
}

// ==================== DNS 污染防护 ====================

/**
 * 验证域名格式，防止 DNS 污染攻击
 * @param {string} domain - 域名
 * @returns {boolean} - 是否为合法域名
 */
export const validateDomain = (domain) => {
  if (!domain || typeof domain !== 'string') return false
  
  // 域名格式验证
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
  
  if (!domainRegex.test(domain)) return false
  
  // 防止使用内网 IP
  const privateIpPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|localhost)/i
  if (privateIpPattern.test(domain)) return false
  
  // 防止使用可疑 TLD
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq']
  if (suspiciousTlds.some(tld => domain.toLowerCase().endsWith(tld))) return false
  
  return true
}

/**
 * 配置内容安全策略（CSP）
 * @returns {Object} - CSP 配置
 */
export const getCSPHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s1.hdslb.com https://static.hdslb.com",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'self' https://player.bilibili.com https://www.bilibili.com",
      "media-src 'self' https: blob:",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
}

/**
 * 检查请求来源，防止 DNS 劫持
 * @param {string} origin - 请求来源
 * @param {Array<string>} allowedOrigins - 允许的来源列表
 * @returns {boolean} - 是否为合法来源
 */
export const validateOrigin = (origin, allowedOrigins = []) => {
  if (!origin) return false
  
  // 开发环境
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return true
  }
  
  // 检查是否在白名单中
  return allowedOrigins.some(allowed => origin === allowed || origin.endsWith(allowed))
}

// ==================== 速率限制 ====================

/**
 * 简单的速率限制器
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.attempts = new Map()
  }
  
  /**
   * 检查是否超过速率限制
   * @param {string} identifier - 标识符（如 IP、用户名）
   * @returns {Object} - 限制结果
   */
  check(identifier) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []
    
    // 清理过期记录
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs)
    
    if (validAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...validAttempts)
      const retryAfter = Math.ceil((oldestAttempt + this.windowMs - now) / 1000)
      
      return {
        allowed: false,
        retryAfter,
        message: `请求过于频繁，请在 ${retryAfter} 秒后重试`
      }
    }
    
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    
    return {
      allowed: true,
      remaining: this.maxAttempts - validAttempts.length
    }
  }
  
  /**
   * 重置特定标识符的限制
   * @param {string} identifier - 标识符
   */
  reset(identifier) {
    this.attempts.delete(identifier)
  }
}

// ==================== 安全日志 ====================

/**
 * 记录安全事件
 * @param {string} event - 事件类型
 * @param {Object} details - 事件详情
 */
export const logSecurityEvent = (event, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
    userAgent: navigator.userAgent
  }
  
  // 开发环境打印日志
  if (import.meta.env.DEV) {
    console.warn('[Security Event]', logEntry)
  }
  
  // 生产环境可以发送到后端日志系统
  // sendToLogServer(logEntry)
}

// ==================== 导出所有工具 ====================

export default {
  escapeHtml,
  sanitizeInput,
  sanitizeUrl,
  detectSqlInjection,
  sanitizeSqlInput,
  validateUsername,
  validateEmail,
  validatePassword,
  validateQQNumber,
  generateCsrfToken,
  verifyCsrfToken,
  validateDomain,
  getCSPHeaders,
  validateOrigin,
  RateLimiter,
  logSecurityEvent
}
