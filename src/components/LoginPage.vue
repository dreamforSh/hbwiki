<script setup>
import { ref, computed, onMounted } from 'vue'
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

const emit = defineEmits(['login-success', 'toggle-sidebar', 'go-register', 'go-forgot-password'])

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
const showPassword = ref(false)
const mounted = ref(false)

// 检测用户是否偏好减少动画
const prefersReducedMotion = ref(false)

onMounted(() => {
  mounted.value = true
  // 检测用户动画偏好
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
})

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
  showPassword.value = false
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
  
  if (isLogin.value) {
    // 登录模式：支持用户名或邮箱
    // 检测是否为邮箱
    const isEmail = username.value.includes('@')
    
    if (isEmail) {
      // 邮箱验证
      const emailValidation = validateEmail(username.value)
      if (!emailValidation.valid) {
        error.value = '请输入有效的邮箱地址'
        return
      }
    } else {
      // 用户名验证
      const usernameValidation = validateUsername(username.value)
      if (!usernameValidation.valid) {
        error.value = '请输入有效的用户名'
        return
      }
    }
  } else {
    // 注册模式：需要所有字段
    // 用户名验证
    const usernameValidation = validateUsername(username.value)
    if (!usernameValidation.valid) {
      error.value = usernameValidation.errors[0]
      return
    }
    
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <main 
    class="login-page" 
    :class="{ 'sidebar-collapsed': sidebarCollapsed, 'mounted': mounted }"
  >
    <!-- 动态背景装饰 -->
    <div class="background-decoration" aria-hidden="true">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 展开侧边栏按钮 -->
    <button 
      v-if="sidebarCollapsed" 
      class="expand-sidebar-btn glass-card"
      @click="emit('toggle-sidebar')"
      aria-label="展开侧边栏"
      title="展开侧边栏"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <div class="login-container">
      <div class="login-card glass-card" role="main">
        <!-- Logo -->
        <div class="login-header">
          <div class="login-logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 class="login-title">{{ isLogin ? '欢迎回来' : '加入我们' }}</h1>
          <p class="login-subtitle">
            {{ isLogin ? '使用用户名或邮箱登录' : '创建账号开始探索' }}
          </p>
        </div>

        <!-- 表单 -->
        <form class="login-form" @submit.prevent="handleSubmit" novalidate>
          <!-- 用户名/邮箱 -->
          <div class="form-group">
            <label for="username" class="form-label">
              {{ isLogin ? '用户名/邮箱' : '用户名' }}
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input 
                id="username"
                v-model="username"
                type="text" 
                class="form-input"
                :placeholder="isLogin ? '请输入用户名或邮箱' : '请输入用户名'"
                :disabled="loading"
                :autocomplete="isLogin ? 'username email' : 'username'"
                required
                aria-required="true"
              />
            </div>
          </div>

          <!-- 邮箱（仅注册） -->
          <Transition name="slide-fade">
            <div v-if="!isLogin" class="form-group">
              <label for="email" class="form-label">邮箱</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input 
                  id="email"
                  v-model="email"
                  type="email" 
                  class="form-input"
                  placeholder="请输入邮箱"
                  :disabled="loading"
                  autocomplete="email"
                  :required="!isLogin"
                  :aria-required="!isLogin"
                />
              </div>
            </div>
          </Transition>

          <!-- 密码 -->
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                :disabled="loading"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                required
                aria-required="true"
                @input="checkPasswordStrength"
              />
              <button
                type="button"
                class="toggle-password"
                @click="togglePasswordVisibility"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                tabindex="-1"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <!-- 密码强度指示器（仅注册） -->
            <Transition name="slide-fade">
              <div v-if="!isLogin && password" class="password-strength" role="status" aria-live="polite">
                <div class="strength-bar" :aria-label="`密码强度：${strengthText}`">
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
            </Transition>
          </div>

          <!-- 确认密码（仅注册） -->
          <Transition name="slide-fade">
            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password" 
                  class="form-input"
                  placeholder="请再次输入密码"
                  :disabled="loading"
                  autocomplete="new-password"
                  :required="!isLogin"
                  :aria-required="!isLogin"
                />
              </div>
            </div>
          </Transition>

          <!-- QQ号（仅注册） -->
          <Transition name="slide-fade">
            <div v-if="!isLogin" class="form-group">
              <label for="qqNumber" class="form-label">QQ号</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <input 
                  id="qqNumber"
                  v-model="qqNumber"
                  type="text" 
                  class="form-input"
                  placeholder="请输入QQ号"
                  :disabled="loading"
                  autocomplete="off"
                  :required="!isLogin"
                  :aria-required="!isLogin"
                  inputmode="numeric"
                />
              </div>
            </div>
          </Transition>

          <!-- 错误提示 -->
          <Transition name="shake-fade">
            <div v-if="error" class="error-message" role="alert" aria-live="assertive">
              <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>
          </Transition>

          <!-- 提交按钮 -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
            :class="{ loading: loading }"
            :aria-busy="loading"
          >
            <span v-if="!loading">{{ isLogin ? '登录' : '注册' }}</span>
            <span v-else class="loading-content">
              <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
              <span class="sr-only">正在处理...</span>
              <span aria-hidden="true">处理中...</span>
            </span>
          </button>

          <!-- 忘记密码链接（仅登录模式显示） -->
          <div v-if="isLogin" class="forgot-password-link">
            <button 
              type="button"
              class="link-btn"
              @click="emit('go-forgot-password')"
              :disabled="loading"
            >
              忘记密码？
            </button>
          </div>

          <!-- 切换模式 -->
          <div class="form-footer">
            <span class="footer-text">
              {{ isLogin ? '还没有账号？' : '已有账号？' }}
            </span>
            <button 
              type="button" 
              class="switch-btn"
              @click="isLogin ? emit('go-register') : switchMode()"
              :disabled="loading"
            >
              {{ isLogin ? '立即注册' : '立即登录' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* ============================================
   Glassmorphism Login Page - Best Practices
   ============================================ */

/* Google Fonts Import - 优化字体加载 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* CSS Custom Properties for Z-index Management */
:root {
  --z-background: 0;
  --z-decoration: 1;
  --z-content: 10;
  --z-card: 20;
  --z-input: 30;
  --z-button: 40;
  --z-fixed: 50;
  --z-modal: 100;
}

/* Screen Reader Only - 可访问性 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Main Container */
.login-page {
  margin-left: 280px;
  min-height: 100vh;
  background: transparent;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 280px);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  /* 优化字体渲染 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.login-page.sidebar-collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* 背景装饰 - 动态渐变球 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  bottom: 0;
  z-index: var(--z-decoration);
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.8s ease, left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-page.mounted .background-decoration {
  opacity: 1;
}

.login-page.sidebar-collapsed .background-decoration {
  left: 80px;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  right: -100px;
  animation: float-1 20s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -150px;
  left: -100px;
  animation: float-2 15s ease-in-out infinite;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float-3 18s ease-in-out infinite;
}

/* Glassmorphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
}

/* Dark Mode Glassmorphism */
@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 32px 0 rgba(0, 0, 0, 0.37),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  }
}

/* Expand Sidebar Button */
.expand-sidebar-btn {
  position: fixed;
  top: 24px;
  left: 92px;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 14px;
  color: var(--text-primary);
  cursor: pointer;
  z-index: var(--z-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-sidebar-btn .icon {
  width: 22px;
  height: 22px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-sidebar-btn:hover {
  transform: translateY(-2px) scale(1.05);
}

.expand-sidebar-btn:hover .icon {
  transform: scale(1.1);
}

.expand-sidebar-btn:active {
  transform: translateY(0) scale(0.98);
}

.expand-sidebar-btn:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Container */
.login-container {
  width: 100%;
  max-width: 460px;
  z-index: var(--z-content);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.login-page.mounted .login-container {
  opacity: 1;
  transform: translateY(0);
}

/* Login Card */
.login-card {
  padding: 48px 44px;
  border-radius: 24px;
  position: relative;
  z-index: var(--z-card);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 10px 25px rgba(102, 126, 234, 0.4),
    0 4px 10px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.login-logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

.logo-icon {
  width: 36px;
  height: 36px;
  color: white;
  stroke-width: 2.5;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 10px;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.login-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.5;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  pointer-events: none;
  z-index: var(--z-input);
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper:focus-within .input-icon {
  color: #667eea;
}

.form-input {
  width: 100%;
  padding: 13px 48px 13px 48px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

@media (prefers-color-scheme: dark) {
  .form-input {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.form-input:hover:not(:disabled) {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(255, 255, 255, 0.7);
}

@media (prefers-color-scheme: dark) {
  .form-input:hover:not(:disabled) {
    background: rgba(30, 41, 59, 0.6);
  }
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

@media (prefers-color-scheme: dark) {
  .form-input:focus {
    background: rgba(30, 41, 59, 0.7);
  }
}

.form-input::placeholder {
  color: var(--text-tertiary);
  font-weight: 400;
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(248, 250, 252, 0.5);
}

/* Toggle Password Button */
.toggle-password {
  position: absolute;
  right: 14px;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  z-index: var(--z-input);
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text-primary);
}

.toggle-password:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

/* Password Strength */
.password-strength {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: rgba(226, 232, 240, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 3px;
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
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  min-width: 90px;
  letter-spacing: -0.01em;
}

/* Error Message */
.error-message {
  padding: 14px 16px;
  background: rgba(254, 242, 242, 0.9);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(252, 165, 165, 0.6);
  border-radius: 12px;
  color: #DC2626;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

@media (prefers-color-scheme: dark) {
  .error-message {
    background: rgba(127, 29, 29, 0.3);
    border-color: rgba(252, 165, 165, 0.3);
  }
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Submit Button */
.submit-btn {
  padding: 15px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(102, 126, 234, 0.4),
    0 2px 8px rgba(102, 126, 234, 0.3);
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  z-index: var(--z-button);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(102, 126, 234, 0.5),
    0 3px 10px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  pointer-events: none;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

/* Footer */
.forgot-password-link {
  text-align: right;
  margin-top: 8px;
  margin-bottom: -8px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.link-btn:hover:not(:disabled) {
  color: var(--accent-color);
  text-decoration: underline;
}

.link-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  padding-top: 24px;
  margin-top: 4px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 6px 10px;
  border-radius: 8px;
  letter-spacing: -0.01em;
}

.switch-btn:hover:not(:disabled) {
  color: #764ba2;
  background: rgba(102, 126, 234, 0.1);
}

.switch-btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.switch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================
   Animations - 动画最佳实践
   ============================================ */

/* Float Animations for Background Orbs */
@keyframes float-1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(50px, 30px);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, -50px);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) rotate(5deg);
  }
}

/* Shine Animation */
@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

/* Spin Animation for Loading */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Vue Transitions */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

.shake-fade-enter-active {
  animation: shake-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.shake-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  opacity: 0;
}

@keyframes shake-in {
  0% {
    transform: translateX(-10px);
    opacity: 0;
  }
  25% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ============================================
   Accessibility - 可访问性
   ============================================ */

/* 减少动画（尊重用户偏好） */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .gradient-orb {
    animation: none;
  }
  
  .login-logo::before {
    animation: none;
  }
}

/* Focus Visible - 键盘导航 */
*:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* ============================================
   Responsive Design - 响应式
   ============================================ */

@media (max-width: 768px) {
  .login-page {
    margin-left: 0;
    width: 100%;
    padding: 24px 20px;
  }

  .login-page.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }

  .background-decoration {
    left: 0;
  }

  .expand-sidebar-btn {
    left: 20px;
    top: 20px;
  }

  .login-card {
    padding: 36px 28px;
  }

  .login-logo {
    width: 64px;
    height: 64px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .login-title {
    font-size: 1.625rem;
  }

  .login-subtitle {
    font-size: 0.875rem;
  }

  .form-input {
    padding: 12px 44px 12px 44px;
    font-size: 16px; /* 防止iOS自动缩放 */
  }

  .submit-btn {
    padding: 14px 24px;
  }
}

@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .orb-1,
  .orb-2,
  .orb-3 {
    filter: blur(60px);
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: more) {
  .glass-card {
    background: var(--bg-primary);
    border: 2px solid var(--text-primary);
  }

  .form-input {
    background: var(--bg-primary);
    border: 2px solid var(--text-primary);
  }
}
</style>
