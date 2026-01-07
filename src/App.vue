<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WikiSidebar from './components/WikiSidebar.vue'
import WikiContent from './components/WikiContent.vue'

const selectedNavId = ref('')
const sidebarCollapsed = ref(false)
const isDarkMode = ref(true)
const isMobile = ref(false)

const handleSelect = (id) => {
  selectedNavId.value = id
  // 移动端选择后自动关闭侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
  // TODO: 根据选中的导航项显示不同内容
  console.log('选中导航项:', id)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
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
      @select="handleSelect"
      @toggle-sidebar="toggleSidebar"
      @toggle-theme="toggleTheme"
    />
    <WikiContent 
      :profession="null" 
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
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
