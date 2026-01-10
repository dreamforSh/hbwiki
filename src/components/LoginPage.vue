<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateQQNumber,
  escapeHtml
} from '../utils/security'

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['login-success', 'toggle-sidebar'])

const { login, register } = useAuth()

const isLogin = ref(true) // true: 登录, false: 注册
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const qqNumber = ref('')
const loading = ref(false)
const error = ref('')
const passwordStrength = ref('')

// 密码强度颜色
const strengthColor = computed(() => {
  const colors = {
    weak: '#ef4444',
    medium: '#f59e0b',
    strong: '#10b981'
  }
  return colors[passwordStrength.value] || '#6b7280'
})

const strengthText = computed(() => {
  const texts = {
    weak: '弱',
    medium: '中',
    strong: '强'
  }
  return texts[passwordStrength.value] || ''
})

const switchMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  username.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  qqNumber.value = ''
  passwordStrength.value = ''
}

// 实时检查密码强度
const checkPasswordStrength = () => {
  if (!isLogin.value && password.value) {
    const validation = validatePassword(password.value)
    passwordStrength.value = validation.strength
  } else {
    passwordStrength.value = ''
  }
}

const handleSubmit = async () => {
  error.value = ''
  
  // 前端验证 - 基本检查
  if (!username.value || !password.value) {
    error.value = '请填写所有必填字段'
    return
  }
  
  // 用户名验证
  const usernameValidation = validateUsername(username.value)
  if (!usernameValidation.valid) {
    error.value = usernameValidation.errors[0]
    return
  }
  
  if (!isLogin.value) {
    // 注册模式额外验证
    if (!email.value) {
      error.value = '请填写邮箱'
      return
    }
    
    // 邮箱验证
    const emailValidation = validateEmail(email.value)
    if (!emailValidation.valid) {
      error.value = emailValidation.errors[0]
      return
    }
    
    if (!qqNumber.value) {
      error.value = '请填写QQ号'
      return
    }
    
    // QQ号验证
    const qqValidation = validateQQNumber(qqNumber.value)
    if (!qqValidation.valid) {
      error.value = qqValidation.errors[0]
      return
    }
    
    if (password.value !== confirmPassword.value) {
      error.value = '两次密码不一致'
      return
    }
    
    // 密码强度验证
    const passwordValidation = validatePassword(password.value)
    if (!passwordValidation.valid) {
      error.value = passwordValidation.errors[0]
      return
    }
  }
  
  loading.value = true
  
  try {
    if (isLogin.value) {
      await login(username.value, password.value)
      emit('login-success')
    } else {
      await register(username.value, email.value, password.value, qqNumber.value)
      emit('login-success')
    }
  } catch (err) {
    // 转义错误消息防止 XSS
    error.value = escapeHtml(err.message) || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <main class="login-page" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 展开侧边栏按钮 -->
    <button 
      v-if="sidebarCollapsed" 
      class="expand-sidebar-btn glass-panel"
      @click="emit('toggle-sidebar')"
      title="展开侧边栏"
    >
      <span class="icon">☰</span>
    </button>

    <div class="login-container">
      <div class="login-card glass-panel animate-fade-in-up">
        <!-- Logo -->
        <div class="login-header">
          <div class="login-logo">
            <span class="logo-icon">🚂</span>
          </div>
          <h1 class="login-title">{{ isLogin ? '欢迎回来' : '加入我们' }}</h1>
          <p class="login-subtitle">
            {{ isLogin ? '登录以获取更多功能' : '创建账号开始探索' }}
          </p>
        </div>

        <!-- 表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <!-- 用户名 -->
          <div class="form-group">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                v-model="username"
                type="text" 
                class="form-input"
                placeholder="请输入用户名"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- 邮箱（仅注册） -->
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">邮箱</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                v-model="email"
                type="email" 
                class="form-input"
                placeholder="请输入邮箱"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                v-model="password"
                type="password" 
                class="form-input"
                placeholder="请输入密码"
                :disabled="loading"
                @input="checkPasswordStrength"
              />
            </div>
            <!-- 密码强度指示器（仅注册） -->
            <div v-if="!isLogin && password" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="`strength-${passwordStrength}`"
                  :style="{ backgroundColor: strengthColor }"
                ></div>
              </div>
              <span class="strength-text" :style="{ color: strengthColor }">
                密码强度：{{ strengthText }}
              </span>
            </div>
          </div>

          <!-- 确认密码（仅注册） -->
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                v-model="confirmPassword"
                type="password" 
                class="form-input"
                placeholder="请再次输入密码"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- QQ号（仅注册） -->
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">QQ号</label>
            <div class="input-wrapper">
              <span class="input-icon">🐧</span>
              <input 
                v-model="qqNumber"
                type="text" 
                class="form-input"
                placeholder="请输入QQ号"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
          </div>

          <!-- 提交按钮 -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            <span v-if="!loading">{{ isLogin ? '登录' : '注册' }}</span>
            <span v-else class="loading-spinner">⏳</span>
          </button>

          <!-- 切换模式 -->
          <div class="form-footer">
            <span class="footer-text">
              {{ isLogin ? '还没有账号？' : '已有账号？' }}
            </span>
            <button 
              type="button" 
              class="switch-btn"
              @click="switchMode"
              :disabled="loading"
            >
              {{ isLogin ? '立即注册' : '立即登录' }}
            </button>
          </div>
        </form>

        <!-- 装饰 -->
        <div class="login-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  margin-left: 280px;
  min-height: 100vh;
  background: transparent;
  transition: margin-left var(--transition-normal);
  position: relative;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 280px);
}

.login-page.sidebar-collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

.expand-sidebar-btn {
  position: fixed;
  top: 24px;
  left: 92px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expand-sidebar-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.login-card {
  padding: 48px 40px;
  border-radius: 32px;
  position: relative;
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.3);
  animation: float 3s ease-in-out infinite;
}

.logo-icon {
  font-size: 3rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.2rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 92, 141, 0.1);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.strength-weak {
  width: 33%;
}

.strength-fill.strength-medium {
  width: 66%;
}

.strength-fill.strength-strong {
  width: 100%;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  min-width: 80px;
}

.error-message {
  padding: 12px 16px;
  background: var(--evil-bg);
  border: 1px solid var(--evil-color);
  border-radius: 12px;
  color: var(--evil-color);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 1.1rem;
}

.submit-btn {
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  pointer-events: none;
}

.loading-spinner {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

.form-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.switch-btn:hover:not(:disabled) {
  color: var(--accent-hover);
  text-decoration: underline;
}

.switch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-color), transparent);
  opacity: 0.1;
  animation: pulse 4s ease-in-out infinite;
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: -75px;
  right: -75px;
}

.circle-2 {
  width: 100px;
  height: 100px;
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-page {
    margin-left: 0;
    width: 100%;
    padding: 20px;
  }

  .login-page.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }

  .expand-sidebar-btn {
    left: 20px;
    top: 20px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 1.6rem;
  }
}
</style>
