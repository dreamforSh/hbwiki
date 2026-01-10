<script setup>
import { ref, computed } from 'vue'
import GameIcon from './icons/GameIcons.vue'
import { sendVerificationCode, verifyCode, register } from '../api/auth.api'

const emit = defineEmits(['register-success', 'go-login'])

// 表单数据
const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  code: ''
})

// 状态
const currentStep = ref(1) // 1: 邮箱验证, 2: 设置信息
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)
const errorMessage = ref('')
const successMessage = ref('')

// 验证码倒计时
let countdownTimer = null

// 表单验证
const isEmailValid = computed(() => {
  const emailRegex = /^[0-9]{5,11}@qq\.com$|^[a-z][a-z0-9._-]*@qq\.com$/
  return emailRegex.test(formData.value.email)
})

const isUsernameValid = computed(() => {
  return formData.value.username.length >= 2 && formData.value.username.length <= 20
})

const isPasswordValid = computed(() => {
  return formData.value.password.length >= 6 && formData.value.password.length <= 32
})

const isPasswordMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword
})

const isCodeValid = computed(() => {
  return /^\d{6}$/.test(formData.value.code)
})

const canSendCode = computed(() => {
  return isEmailValid.value && countdown.value === 0 && !codeLoading.value
})

const canVerifyCode = computed(() => {
  return isEmailValid.value && isCodeValid.value && !loading.value
})

const canSubmit = computed(() => {
  return isUsernameValid.value && isPasswordValid.value && isPasswordMatch.value && !loading.value
})

// 发送验证码
const handleSendCode = async () => {
  if (!canSendCode.value) return

  errorMessage.value = ''
  successMessage.value = ''
  codeLoading.value = true

  try {
    const result = await sendVerificationCode(formData.value.email)
    
    if (result.success) {
      successMessage.value = result.message
      startCountdown()
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '发送验证码失败，请稍后重试'
  } finally {
    codeLoading.value = false
  }
}

// 验证验证码
const handleVerifyCode = async () => {
  if (!canVerifyCode.value) return

  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const result = await verifyCode(formData.value.email, formData.value.code)
    
    if (result.success) {
      successMessage.value = '验证成功！'
      setTimeout(() => {
        currentStep.value = 2
        successMessage.value = ''
      }, 1000)
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '验证失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 提交注册
const handleRegister = async () => {
  if (!canSubmit.value) return

  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const result = await register({
      email: formData.value.email,
      username: formData.value.username,
      password: formData.value.password
    })
    
    if (result.success) {
      successMessage.value = '注册成功！即将跳转...'
      setTimeout(() => {
        emit('register-success', result.data)
      }, 1500)
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdown.value = 0
    }
  }, 1000)
}

// 返回上一步
const goBack = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1
  } else {
    emit('go-login')
  }
}

// 清理定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <div class="register-page">
    <div class="register-container glass-panel">
      <!-- 头部 -->
      <div class="register-header">
        <button class="back-btn" @click="goBack">
          <GameIcon name="chevronLeft" :size="20" />
        </button>
        <div class="header-content">
          <div class="logo-icon">
            <GameIcon name="user" :size="32" color="var(--accent-color)" />
          </div>
          <h1 class="title">注册账号</h1>
          <p class="subtitle">加入哈比列车Wiki社区</p>
        </div>
      </div>

      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div :class="['step', { active: currentStep >= 1, completed: currentStep > 1 }]">
          <div class="step-number">1</div>
          <span class="step-label">邮箱验证</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div :class="['step', { active: currentStep >= 2 }]">
          <div class="step-number">2</div>
          <span class="step-label">设置信息</span>
        </div>
      </div>

      <!-- 第一步：邮箱验证 -->
      <div v-show="currentStep === 1" class="form-section">
        <div class="form-group">
          <label class="form-label">
            <GameIcon name="user" :size="16" />
            <span>QQ邮箱</span>
          </label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="请输入QQ邮箱（仅支持@qq.com）"
            class="form-input"
            :class="{ error: formData.email && !isEmailValid }"
          />
          <span v-if="formData.email && !isEmailValid" class="error-text">
            请输入正确的QQ邮箱格式
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <GameIcon name="shield" :size="16" />
            <span>验证码</span>
          </label>
          <div class="code-input-group">
            <input
              v-model="formData.code"
              type="text"
              placeholder="请输入6位验证码"
              maxlength="6"
              class="form-input code-input"
              :class="{ error: formData.code && !isCodeValid }"
            />
            <button
              class="send-code-btn"
              :class="{ disabled: !canSendCode }"
              :disabled="!canSendCode"
              @click="handleSendCode"
            >
              <span v-if="codeLoading">发送中...</span>
              <span v-else-if="countdown > 0">{{ countdown }}秒后重试</span>
              <span v-else>发送验证码</span>
            </button>
          </div>
          <span v-if="formData.code && !isCodeValid" class="error-text">
            验证码必须为6位数字
          </span>
        </div>

        <button
          class="submit-btn"
          :class="{ disabled: !canVerifyCode }"
          :disabled="!canVerifyCode"
          @click="handleVerifyCode"
        >
          <span v-if="loading">验证中...</span>
          <span v-else>验证邮箱</span>
          <GameIcon v-if="!loading" name="chevronRight" :size="20" />
        </button>
      </div>

      <!-- 第二步：设置信息 -->
      <div v-show="currentStep === 2" class="form-section">
        <div class="form-group">
          <label class="form-label">
            <GameIcon name="user" :size="16" />
            <span>用户名</span>
          </label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名（2-20个字符）"
            class="form-input"
            :class="{ error: formData.username && !isUsernameValid }"
          />
          <span v-if="formData.username && !isUsernameValid" class="error-text">
            用户名长度应在2-20个字符之间
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <GameIcon name="shield" :size="16" />
            <span>密码</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码（6-32个字符）"
            class="form-input"
            :class="{ error: formData.password && !isPasswordValid }"
          />
          <span v-if="formData.password && !isPasswordValid" class="error-text">
            密码长度应在6-32个字符之间
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <GameIcon name="shield" :size="16" />
            <span>确认密码</span>
          </label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            class="form-input"
            :class="{ error: formData.confirmPassword && !isPasswordMatch }"
          />
          <span v-if="formData.confirmPassword && !isPasswordMatch" class="error-text">
            两次输入的密码不一致
          </span>
        </div>

        <button
          class="submit-btn"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
          @click="handleRegister"
        >
          <span v-if="loading">注册中...</span>
          <span v-else>完成注册</span>
          <GameIcon v-if="!loading" name="check" :size="20" />
        </button>
      </div>

      <!-- 消息提示 -->
      <div v-if="errorMessage" class="message error-message">
        <GameIcon name="alert" :size="18" />
        <span>{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="message success-message">
        <GameIcon name="check" :size="18" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- 底部链接 -->
      <div class="footer-links">
        <span class="link-text">已有账号？</span>
        <button class="link-btn" @click="emit('go-login')">
          立即登录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-primary);
}

.register-container {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  border-radius: 24px;
  position: relative;
}

/* 头部 */
.register-header {
  position: relative;
  text-align: center;
  margin-bottom: 32px;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 0;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: translateX(-4px);
}

.header-content {
  padding: 0 40px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* 步骤指示器 */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 16px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s;
}

.step.active .step-number {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.step.completed .step-number {
  background: var(--good-color);
  border-color: var(--good-color);
  color: white;
}

.step-label {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.step.active .step-label {
  color: var(--accent-color);
}

.step-line {
  width: 60px;
  height: 2px;
  background: var(--border-color);
  transition: all 0.3s;
}

.step-line.active {
  background: var(--accent-color);
}

/* 表单 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

.form-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-input.error {
  border-color: var(--evil-color);
}

.error-text {
  color: var(--evil-color);
  font-size: 0.8rem;
  margin-top: -4px;
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  padding: 0 20px;
  border: none;
  border-radius: 12px;
  background: var(--accent-color);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.send-code-btn:hover:not(.disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.send-code-btn.disabled {
  background: var(--border-color);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.submit-btn.disabled {
  background: var(--border-color);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

/* 消息提示 */
.message {
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.error-message {
  background: rgba(239, 83, 80, 0.1);
  color: var(--evil-color);
  border: 1px solid var(--evil-color);
}

.success-message {
  background: rgba(102, 187, 106, 0.1);
  color: var(--good-color);
  border: 1px solid var(--good-color);
}

/* 底部链接 */
.footer-links {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.link-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-right: 8px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.link-btn:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 640px) {
  .register-container {
    padding: 32px 24px;
  }

  .title {
    font-size: 1.6rem;
  }

  .steps-indicator {
    gap: 12px;
  }

  .step-line {
    width: 40px;
  }

  .code-input-group {
    flex-direction: column;
  }

  .send-code-btn {
    padding: 14px 20px;
  }
}
</style>
