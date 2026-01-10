// 认证相关API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 发送验证码到邮箱
 * @param {string} email - 邮箱地址
 * @returns {Promise} API响应
 */
export async function sendVerificationCode(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('发送验证码失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 验证验证码
 * @param {string} email - 邮箱地址
 * @param {string} code - 验证码
 * @returns {Promise} API响应
 */
export async function verifyCode(email, code) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('验证验证码失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {Promise} API响应
 */
export async function validateEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('验证邮箱失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 注册新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} API响应
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('注册失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 发送密码重置验证码
 * @param {string} email - 邮箱地址
 * @returns {Promise} API响应
 */
export async function sendPasswordResetCode(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('发送密码重置验证码失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 重置密码
 * @param {Object} resetData - 重置密码数据
 * @returns {Promise} API响应
 */
export async function resetPassword(resetData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resetData)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('重置密码失败:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}

/**
 * 注销账号
 * @param {string} email - 邮箱地址
 * @param {string} password - 用户密码
 * @returns {Promise} API响应
 */
export async function deleteAccount(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    // 检查响应状态
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        success: false,
        message: data.message || `服务器错误 (${response.status})`
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('注销账号失败:', error)
    
    // 区分不同类型的错误
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: '无法连接到服务器，请检查后端服务是否运行'
      }
    }
    
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
}
