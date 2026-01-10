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

module.exports = router
