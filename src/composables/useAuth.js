import { ref, computed } from 'vue'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateQQNumber,
  sanitizeInput,
  detectSqlInjection,
  RateLimiter,
  logSecurityEvent
} from '../utils/security'

// 用户状态管理
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

// 速率限制器：登录5次/分钟，注册3次/分钟
const loginRateLimiter = new RateLimiter(5, 60000)
const registerRateLimiter = new RateLimiter(3, 60000)

// 从 localStorage 恢复用户信息
const initAuth = () => {
  const savedUser = localStorage.getItem('wiki_user')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      
      // 验证恢复的数据完整性
      if (userData.username && userData.email && userData.id) {
        // 清理可能被篡改的数据
        user.value = {
          id: sanitizeInput(userData.id),
          username: sanitizeInput(userData.username),
          email: sanitizeInput(userData.email),
          qqNumber: userData.qqNumber,
          avatar: userData.avatar || '👤',
          role: userData.role || 'user',
          createdAt: userData.createdAt
        }
        logSecurityEvent('AUTH_RESTORED', { username: user.value.username })
      } else {
        localStorage.removeItem('wiki_user')
        logSecurityEvent('AUTH_RESTORE_FAILED', { reason: 'Invalid data structure' })
      }
    } catch (e) {
      localStorage.removeItem('wiki_user')
      logSecurityEvent('AUTH_RESTORE_ERROR', { error: e.message })
    }
  }
}

// 登录 - 支持用户名或邮箱登录
const login = (usernameOrEmail, password) => {
  return new Promise((resolve, reject) => {
    // 速率限制检查
    const rateLimitResult = loginRateLimiter.check(usernameOrEmail)
    if (!rateLimitResult.allowed) {
      logSecurityEvent('LOGIN_RATE_LIMIT', { identifier: usernameOrEmail })
      reject({ success: false, message: rateLimitResult.message })
      return
    }
    
    // 检测输入类型：邮箱或用户名
    const isEmail = usernameOrEmail.includes('@')
    
    // 输入验证
    if (isEmail) {
      const emailValidation = validateEmail(usernameOrEmail)
      if (!emailValidation.valid) {
        logSecurityEvent('LOGIN_INVALID_EMAIL', { email: usernameOrEmail, errors: emailValidation.errors })
        reject({ success: false, message: '请输入有效的邮箱地址' })
        return
      }
    } else {
      const usernameValidation = validateUsername(usernameOrEmail)
      if (!usernameValidation.valid) {
        logSecurityEvent('LOGIN_INVALID_USERNAME', { username: usernameOrEmail, errors: usernameValidation.errors })
        reject({ success: false, message: '请输入有效的用户名' })
        return
      }
    }
    
    // 检测 SQL 注入
    if (detectSqlInjection(usernameOrEmail) || detectSqlInjection(password)) {
      logSecurityEvent('LOGIN_SQL_INJECTION_ATTEMPT', { identifier: usernameOrEmail })
      reject({ success: false, message: '检测到非法输入，登录失败' })
      return
    }
    
    // 模拟登录验证（实际项目中应该调用后端 API）
    setTimeout(() => {
      try {
        // 安全地解析 localStorage 数据
        const usersData = localStorage.getItem('wiki_users')
        if (!usersData) {
          reject({ success: false, message: '用户名/邮箱或密码错误' })
          return
        }
        
        const users = JSON.parse(usersData)
        const cleanIdentifier = sanitizeInput(usernameOrEmail)
        
        // 根据输入类型查找用户
        const foundUser = isEmail 
          ? users.find(u => u.email === cleanIdentifier && u.password === password)
          : users.find(u => u.username === cleanIdentifier && u.password === password)
        
        if (foundUser) {
          // 登录成功，重置速率限制
          loginRateLimiter.reset(usernameOrEmail)
          
          const userData = {
            id: foundUser.id,
            username: sanitizeInput(foundUser.username),
            email: sanitizeInput(foundUser.email),
            qqNumber: foundUser.qqNumber,
            avatar: foundUser.avatar || '👤',
            role: foundUser.role || 'user',
            createdAt: foundUser.createdAt
          }
          
          user.value = userData
          localStorage.setItem('wiki_user', JSON.stringify(userData))
          
          logSecurityEvent('LOGIN_SUCCESS', { 
            username: userData.username, 
            loginMethod: isEmail ? 'email' : 'username' 
          })
          resolve({ success: true, user: userData })
        } else {
          logSecurityEvent('LOGIN_FAILED', { identifier: cleanIdentifier })
          reject({ success: false, message: '用户名/邮箱或密码错误' })
        }
      } catch (error) {
        logSecurityEvent('LOGIN_ERROR', { identifier: usernameOrEmail, error: error.message })
        reject({ success: false, message: '登录失败，请重试' })
      }
    }, 500)
  })
}

// 注册
const register = (username, email, password, qqNumber) => {
  return new Promise((resolve, reject) => {
    // 速率限制检查
    const rateLimitResult = registerRateLimiter.check(username)
    if (!rateLimitResult.allowed) {
      logSecurityEvent('REGISTER_RATE_LIMIT', { username })
      reject({ success: false, message: rateLimitResult.message })
      return
    }
    
    // 用户名验证
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      logSecurityEvent('REGISTER_INVALID_USERNAME', { username, errors: usernameValidation.errors })
      reject({ success: false, message: usernameValidation.errors[0] })
      return
    }
    
    // 邮箱验证
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      logSecurityEvent('REGISTER_INVALID_EMAIL', { username, errors: emailValidation.errors })
      reject({ success: false, message: emailValidation.errors[0] })
      return
    }
    
    // 密码验证
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      logSecurityEvent('REGISTER_WEAK_PASSWORD', { username, errors: passwordValidation.errors })
      reject({ success: false, message: passwordValidation.errors[0] })
      return
    }
    
    // QQ号验证
    const qqValidation = validateQQNumber(qqNumber)
    if (!qqValidation.valid) {
      logSecurityEvent('REGISTER_INVALID_QQ', { username, errors: qqValidation.errors })
      reject({ success: false, message: qqValidation.errors[0] })
      return
    }
    
    // 检测 SQL 注入
    if (detectSqlInjection(username) || detectSqlInjection(email) || detectSqlInjection(qqNumber)) {
      logSecurityEvent('REGISTER_SQL_INJECTION_ATTEMPT', { username, email })
      reject({ success: false, message: '检测到非法输入，注册失败' })
      return
    }
    
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('wiki_users') || '[]')
        
        // 清理输入数据
        const cleanUsername = usernameValidation.sanitized
        const cleanEmail = emailValidation.sanitized
        const cleanQQ = qqValidation.sanitized
        
        // 检查用户名是否已存在
        if (users.find(u => u.username === cleanUsername)) {
          logSecurityEvent('REGISTER_USERNAME_EXISTS', { username: cleanUsername })
          reject({ success: false, message: '用户名已存在' })
          return
        }
        
        // 检查邮箱是否已存在
        if (users.find(u => u.email === cleanEmail)) {
          logSecurityEvent('REGISTER_EMAIL_EXISTS', { email: cleanEmail })
          reject({ success: false, message: '邮箱已被注册' })
          return
        }
        
        // 检查QQ号是否已存在
        if (users.find(u => u.qqNumber === cleanQQ)) {
          logSecurityEvent('REGISTER_QQ_EXISTS', { qqNumber: cleanQQ })
          reject({ success: false, message: 'QQ号已被绑定' })
          return
        }
        
        // 创建新用户
        const newUser = {
          id: Date.now().toString(),
          username: cleanUsername,
          email: cleanEmail,
          password, // 实际项目中应该使用 bcrypt 等加密
          qqNumber: cleanQQ,
          avatar: '👤',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        users.push(newUser)
        localStorage.setItem('wiki_users', JSON.stringify(users))
        
        // 注册成功，重置速率限制
        registerRateLimiter.reset(username)
        
        // 自动登录
        const userData = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          qqNumber: newUser.qqNumber,
          avatar: newUser.avatar,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
        user.value = userData
        localStorage.setItem('wiki_user', JSON.stringify(userData))
        
        logSecurityEvent('REGISTER_SUCCESS', { username: userData.username })
        resolve({ success: true, user: userData })
      } catch (error) {
        logSecurityEvent('REGISTER_ERROR', { username, error: error.message })
        reject({ success: false, message: '注册失败，请重试' })
      }
    }, 500)
  })
}

// 登出
const logout = () => {
  user.value = null
  localStorage.removeItem('wiki_user')
}

// 更新用户信息
const updateProfile = (updates) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (user.value) {
        // 更新当前用户
        user.value = { ...user.value, ...updates }
        localStorage.setItem('wiki_user', JSON.stringify(user.value))
        
        // 更新用户列表
        const users = JSON.parse(localStorage.getItem('wiki_users') || '[]')
        const userIndex = users.findIndex(u => u.id === user.value.id)
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates }
          localStorage.setItem('wiki_users', JSON.stringify(users))
        }
      }
      resolve({ success: true })
    }, 300)
  })
}

export function useAuth() {
  return {
    user,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    updateProfile
  }
}
