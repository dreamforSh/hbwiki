<script setup>
import { computed } from 'vue'

const props = defineProps({
  errorCode: {
    type: Number,
    default: 404
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['go-home', 'toggle-sidebar'])

const errorMessages = {
  404: {
    title: '页面走丢了',
    subtitle: 'Cloudflare 似乎把页面藏起来了',
    description: '我们很确定这个页面存在，但 Cloudflare 的缓存系统可能把它藏在了某个角落。这绝对不是我们的问题！',
    icon: '🔍',
    suggestions: [
      '检查 URL 是否正确',
      '稍后再试（Cloudflare 可能在更新缓存）',
      '返回首页重新开始',
      '访问 Cloudflare 状态页面查看服务状态'
    ]
  },
  500: {
    title: '服务器开小差了',
    subtitle: 'Cloudflare 遇到了点麻烦',
    description: '我们的服务器运行正常，但 Cloudflare 在处理请求时遇到了问题。这绝对是 Cloudflare 的锅！',
    icon: '⚡',
    suggestions: [
      '稍等片刻后刷新页面',
      '检查 Cloudflare 服务状态',
      '如果问题持续，请联系 Cloudflare 支持',
      '尝试清除浏览器缓存'
    ]
  },
  502: {
    title: '网关出问题了',
    subtitle: 'Cloudflare 网关暂时无法连接',
    description: 'Cloudflare 作为我们的 CDN 提供商，其网关服务器暂时无法响应请求。这完全是 Cloudflare 的问题，与我们无关！',
    icon: '🌐',
    suggestions: [
      '等待几秒后刷新页面',
      '检查 Cloudflare 状态页面 (status.cloudflare.com)',
      '尝试清除浏览器缓存',
      '稍后再试'
    ]
  },
  503: {
    title: '服务暂时不可用',
    subtitle: 'Cloudflare 正在维护',
    description: 'Cloudflare 可能正在进行维护或遇到了临时性问题，导致服务暂时不可用。我们对此表示遗憾，但这不是我们的错！',
    icon: '🔧',
    suggestions: [
      '稍后再试',
      '关注 Cloudflare 官方状态页面',
      '检查网络连接',
      '等待 Cloudflare 完成维护'
    ]
  },
  504: {
    title: '请求超时了',
    subtitle: 'Cloudflare 响应时间过长',
    description: 'Cloudflare 在处理您的请求时超过了时间限制，这通常是临时性的网络问题。我们很抱歉，但这是 Cloudflare 的锅！',
    icon: '⏱️',
    suggestions: [
      '刷新页面重试',
      '检查网络连接速度',
      '稍后再试',
      '查看 Cloudflare 状态页面'
    ]
  }
}

const currentError = computed(() => {
  return errorMessages[props.errorCode] || errorMessages[404]
})

const handleGoHome = () => {
  emit('go-home')
}
</script>

<template>
  <main class="error-page" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 展开侧边栏按钮 -->
    <button 
      v-if="sidebarCollapsed" 
      class="expand-sidebar-btn glass-panel"
      @click="emit('toggle-sidebar')"
      title="展开侧边栏"
    >
      <span class="icon">☰</span>
    </button>

    <div class="error-container">
      <div class="error-content glass-panel animate-fade-in-up">
        <!-- 错误代码 -->
        <div class="error-code">
          <span class="code-number">{{ errorCode }}</span>
        </div>

        <!-- 错误图标 -->
        <div class="error-icon-wrapper">
          <span class="error-icon">{{ currentError.icon }}</span>
        </div>

        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-title">{{ currentError.title }}</h1>
          <p class="error-subtitle">{{ currentError.subtitle }}</p>
          <p class="error-description">{{ currentError.description }}</p>
        </div>

        <!-- Cloudflare 提示 -->
        <div class="cloudflare-notice glass-panel">
          <div class="notice-header">
            <span class="cloudflare-icon">☁️</span>
            <span class="notice-title">关于这个错误</span>
          </div>
          <p class="notice-text">
            本网站使用 <strong>Cloudflare</strong> 作为 CDN 和防护服务。如果遇到访问问题，很可能是 Cloudflare 的临时性故障，而不是我们网站的问题。
            您可以访问 <a href="https://www.cloudflarestatus.com" target="_blank" rel="noopener noreferrer">Cloudflare 状态页面</a> 查看服务状态。
            如果 Cloudflare 显示一切正常，那...可能是他们的监控系统也出问题了 😅
          </p>
        </div>

        <!-- 建议操作 -->
        <div class="suggestions-section">
          <h3 class="suggestions-title">建议操作：</h3>
          <ul class="suggestions-list">
            <li 
              v-for="(suggestion, index) in currentError.suggestions" 
              :key="index"
              class="suggestion-item"
            >
              <span class="suggestion-icon">💡</span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>

        <!-- 操作按钮 -->
        <div class="error-actions">
          <button class="btn-primary" @click="handleGoHome">
            <span class="btn-icon">🏠</span>
            <span>返回首页</span>
          </button>
          <button class="btn-secondary" @click="() => window.location.reload()">
            <span class="btn-icon">🔄</span>
            <span>刷新页面</span>
          </button>
        </div>

        <!-- 装饰性元素 -->
        <div class="error-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.error-page {
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

.error-page.sidebar-collapsed {
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
  position: relative;
  overflow: hidden;
}

.expand-sidebar-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.error-container {
  width: 100%;
  max-width: 800px;
  position: relative;
}

.error-content {
  padding: 60px 40px;
  border-radius: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.error-code {
  margin-bottom: 24px;
}

.code-number {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover), #42a5f5);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  line-height: 1;
  display: inline-block;
}

.error-icon-wrapper {
  margin-bottom: 32px;
}

.error-icon {
  font-size: 5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(255, 92, 141, 0.3));
}

.error-info {
  margin-bottom: 32px;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.2;
}

.error-subtitle {
  font-size: 1.3rem;
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 16px;
}

.error-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.cloudflare-notice {
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  text-align: left;
  background: var(--accent-glow);
  border: 1px solid rgba(255, 92, 141, 0.2);
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.cloudflare-icon {
  font-size: 1.5rem;
}

.notice-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.notice-text {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.notice-text a {
  color: var(--accent-color);
  text-decoration: underline;
  transition: color 0.3s;
}

.notice-text a:hover {
  color: var(--accent-hover);
}

.suggestions-section {
  margin-bottom: 40px;
  text-align: left;
}

.suggestions-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  text-align: center;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: var(--hover-bg);
  transform: translateX(8px);
  color: var(--text-primary);
}

.suggestion-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 14px 32px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.5);
}

.btn-secondary {
  background: var(--btn-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
  transform: translateY(-3px) scale(1.05);
}

.btn-icon {
  font-size: 1.1rem;
}

.error-decoration {
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
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  animation-delay: 1.5s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 3s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-page {
    margin-left: 0;
    width: 100%;
    padding: 20px;
  }

  .error-page.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }

  .expand-sidebar-btn {
    left: 20px;
    top: 20px;
  }

  .error-content {
    padding: 40px 24px;
  }

  .code-number {
    font-size: 5rem;
  }

  .error-icon {
    font-size: 3.5rem;
  }

  .error-title {
    font-size: 1.8rem;
  }

  .error-subtitle {
    font-size: 1.1rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
