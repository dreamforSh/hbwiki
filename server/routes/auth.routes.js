const express = require('express')
const router = express.Router()
const { sendVerificationCode } = require('../services/emailService')
const { verifyCode } = require('../utils/verificationCode')
const { validateEmailForRegistration } = require('../utils/emailValidator')

/**
 * POST /api/auth/send-code
 * 发送验证码
 */
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body

    // 验证请求参数
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      })
    }

    // 发送验证码
    const result = await sendVerificationCode(email)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }

  } catch (error) {
    console.error('发送验证码接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/verify-code
 * 验证验证码
 */
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body

    // 验证请求参数
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码不能为空'
      })
    }

    // 验证邮箱格式
    const emailValidation = validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      })
    }

    // 验证码格式检查
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: '验证码格式不正确'
      })
    }

    // 验证验证码
    const result = verifyCode(emailValidation.email, code)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }

  } catch (error) {
    console.error('验证验证码接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/validate-email
 * 验证邮箱格式（不发送验证码）
 */
router.post('/validate-email', (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      })
    }

    const result = validateEmailForRegistration(email)

    if (result.valid) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { email: result.email }
      })
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      })
    }

  } catch (error) {
    console.error('验证邮箱接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body

    // 验证参数
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱、用户名和密码不能为空'
      })
    }

    // 验证邮箱格式
    const emailValidation = validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      })
    }

    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: '用户名长度应在2-20个字符之间'
      })
    }

    // 验证密码长度
    if (password.length < 6 || password.length > 32) {
      return res.status(400).json({
        success: false,
        message: '密码长度应在6-32个字符之间'
      })
    }

    // TODO: 这里应该将用户信息保存到数据库
    // 目前返回模拟成功响应
    console.log('用户注册:', { email: emailValidation.email, username })

    return res.status(200).json({
      success: true,
      message: '注册成功',
      data: {
        userId: Date.now(), // 模拟用户ID
        email: emailValidation.email,
        username
      }
    })

  } catch (error) {
    console.error('注册接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/send-reset-code
 * 发送密码重置验证码
 */
router.post('/send-reset-code', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      })
    }

    // TODO: 验证邮箱是否已注册
    // 目前直接发送验证码

    // 发送验证码
    const result = await sendVerificationCode(email)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }

  } catch (error) {
    console.error('发送密码重置验证码接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/reset-password
 * 重置密码
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body

    // 验证参数
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '邮箱、验证码和新密码不能为空'
      })
    }

    // 验证邮箱格式
    const emailValidation = validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      })
    }

    // 验证码格式检查
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: '验证码格式不正确'
      })
    }

    // 验证新密码长度
    if (newPassword.length < 6 || newPassword.length > 32) {
      return res.status(400).json({
        success: false,
        message: '密码长度应在6-32个字符之间'
      })
    }

    // 验证验证码
    const codeResult = verifyCode(emailValidation.email, code)
    if (!codeResult.success) {
      return res.status(400).json(codeResult)
    }

    // TODO: 这里应该更新数据库中的密码
    console.log('密码重置:', { email: emailValidation.email })

    return res.status(200).json({
      success: true,
      message: '密码重置成功'
    })

  } catch (error) {
    console.error('重置密码接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/delete-account
 * 注销账号
 */
router.post('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body

    // 验证参数
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      })
    }

    // 验证邮箱格式
    const emailValidation = validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      })
    }

    // 验证密码长度
    if (password.length < 6 || password.length > 32) {
      return res.status(400).json({
        success: false,
        message: '密码格式不正确'
      })
    }

    // TODO: 这里应该：
    // 1. 验证用户的密码是否正确
    // 2. 从数据库删除用户的所有数据
    // 3. 清除用户的 session/token
    console.log('账号注销:', { email: emailValidation.email })

    return res.status(200).json({
      success: true,
      message: '账号注销成功'
    })

  } catch (error) {
    console.error('注销账号接口错误:', error)
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

module.exports = router
