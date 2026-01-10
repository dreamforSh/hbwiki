<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WikiSidebar from './components/WikiSidebar.vue'
import WikiContent from './components/WikiContent.vue'
import ErrorPage from './components/ErrorPage.vue'
import LoginPage from './components/LoginPage.vue'
import UserProfilePage from './components/UserProfilePage.vue'
import { useAuth } from './composables/useAuth'

const { user, isAuthenticated, initAuth } = useAuth()

const selectedNavId = ref('')
const sidebarCollapsed = ref(false)
const isDarkMode = ref(true)
const isMobile = ref(false)

const currentPage = ref('home')
const selectedProfession = ref(null)
const errorCode = ref(null)
const changelogVersion = ref(null)

const handleSelect = (id, param = null) => {
  selectedNavId.value = id
  // 移动端选择后自动关闭侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
  // 根据选中的导航项切换页面
  if (id === 'gameplay') {
    currentPage.value = 'gameplay'
    errorCode.value = null
  } else if (id === 'professions') {
    currentPage.value = 'professions'
    errorCode.value = null
  } else if (id === 'map') {
    currentPage.value = 'map'
    errorCode.value = null
  } else if (id === 'tips') {
    currentPage.value = 'tips'
    errorCode.value = null
  } else if (id === 'changelog') {
    currentPage.value = 'changelog'
    changelogVersion.value = param // param 可以是版本号或 null
    errorCode.value = null
  } else if (id === 'home') {
    currentPage.value = 'home'
    errorCode.value = null
  } else if (id === 'login') {
    currentPage.value = 'login'
    errorCode.value = null
  } else if (id === 'register') {
    currentPage.value = 'register'
    errorCode.value = null
  } else if (id === 'forgot-password') {
    currentPage.value = 'forgot-password'
    errorCode.value = null
  } else if (id === 'profile') {
    currentPage.value = 'profile'
    errorCode.value = null
  } else if (id === '404' || id === '500' || id === '502' || id === '503' || id === '504') {
    errorCode.value = parseInt(id)
    currentPage.value = 'error'
  }
  // 如果不是选择职业详情，清空选中的职业
  if (id !== 'profession-detail') {
    selectedProfession.value = null
  }
  // 如果不是更新日志，清空版本号
  if (id !== 'changelog') {
    changelogVersion.value = null
  }
}

const handleLoginSuccess = () => {
  currentPage.value = 'home'
  selectedNavId.value = ''
}

const handleGoHome = () => {
  currentPage.value = 'home'
  errorCode.value = null
  selectedNavId.value = ''
}

const handleSelectProfession = (profession) => {
  selectedProfession.value = profession
  currentPage.value = 'profession-detail'
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleTheme = () => {
  // 添加平滑过渡类
  document.documentElement.classList.add('theme-transitioning')
  
  // 延迟切换主题，确保过渡效果可见
  setTimeout(() => {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    
    // 移除过渡类
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 600)
  }, 50)
}

const closeSidebarOnMobile = () => {
  if (isMobile.value && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true
  }
}

const checkMobile = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 768
  
  // 从桌面端切换到移动端时，默认收起侧边栏
  if (!wasMobile && isMobile.value) {
    sidebarCollapsed.value = true
  }
}

onMounted(() => {
  // 初始化认证状态
  initAuth()
  
  // 主题初始化
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
  
  // 检测移动端
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // 移动端默认收起侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
  
  // 检查 URL 参数中的错误代码（用于测试错误页面）
  const urlParams = new URLSearchParams(window.location.search)
  const errorCodeParam = urlParams.get('error')
  if (errorCodeParam && ['404', '500', '502', '503', '504'].includes(errorCodeParam)) {
    handleSelect(errorCodeParam)
  }
  
  // 监听自定义事件（用于程序化触发错误页面）
  const handleErrorEvent = (event) => {
    const code = event.detail?.code
    if (code && ['404', '500', '502', '503', '504'].includes(String(code))) {
      handleSelect(String(code))
    }
  }
  window.addEventListener('show-error', handleErrorEvent)
  
  // 在组件卸载时清理事件监听器
  onUnmounted(() => {
    window.removeEventListener('show-error', handleErrorEvent)
  })
  
  // 添加滚动动画观察器
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)
  
  // 观察所有需要动画的元素
  setTimeout(() => {
    const animatedElements = document.querySelectorAll('.content-section, .stat-card, .faction-card, .nav-item, .tip-item')
    animatedElements.forEach(el => {
      observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="wiki-app">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="sidebar-overlay"
      @click="closeSidebarOnMobile"
    ></div>
    
    <WikiSidebar 
      :selected-id="selectedNavId"
      :collapsed="sidebarCollapsed"
      :is-dark-mode="isDarkMode"
      :user="user"
      :is-authenticated="isAuthenticated"
      @select="handleSelect"
      @toggle-sidebar="toggleSidebar"
      @toggle-theme="toggleTheme"
    />
    <ErrorPage 
      v-if="currentPage === 'error' && errorCode"
      :error-code="errorCode"
      :sidebar-collapsed="sidebarCollapsed"
      @go-home="handleGoHome"
      @toggle-sidebar="toggleSidebar"
    />
    <LoginPage
      v-else-if="currentPage === 'login'"
      :sidebar-collapsed="sidebarCollapsed"
      @login-success="handleLoginSuccess"
      @toggle-sidebar="toggleSidebar"
      @go-register="() => handleSelect('register')"
      @go-forgot-password="() => handleSelect('forgot-password')"
    />
    <UserProfilePage
      v-else-if="currentPage === 'profile' && isAuthenticated"
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
      @go-login="() => handleSelect('login')"
    />
    <WikiContent 
      v-else
      :current-page="currentPage"
      :profession="selectedProfession"
      :sidebar-collapsed="sidebarCollapsed"
      :changelog-version="changelogVersion"
      @toggle-sidebar="toggleSidebar"
      @select-profession="handleSelectProfession"
      @navigate="handleSelect"
    />
  </div>
</template>

<style scoped>
.wiki-app {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 49;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
