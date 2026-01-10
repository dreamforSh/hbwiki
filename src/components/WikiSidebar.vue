<script setup>
import GameIcon from './icons/GameIcons.vue'

const props = defineProps({
  selectedId: {
    type: String,
    default: ''
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  isDarkMode: {
    type: Boolean,
    default: true
  },
  user: {
    type: Object,
    default: null
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'toggle-sidebar', 'toggle-theme'])

const quickLinks = [
  { id: 'home', icon: 'home', title: '首页', desc: '回到首页', color: '#FF5C8D' },
  { id: 'gameplay', icon: 'gamepad', title: '游戏玩法', desc: '了解基本游戏规则', color: '#66bb6a' },
  { id: 'professions', icon: 'users', title: '职业介绍', desc: '查看所有职业详情', color: '#42a5f5' },
  { id: 'map', icon: 'map', title: '地图指南', desc: '熟悉列车车厢布局', color: '#ec407a' },
  { id: 'tips', icon: 'lightbulb', title: '进阶技巧', desc: '学习高级实战技巧', color: '#ffa726' },
  { id: 'changelog', icon: 'book', title: '更新日志', desc: '查看游戏版本更新记录', color: '#9c27b0' },
  { id: 'analytics', icon: 'chart', title: 'Web Analytics', desc: 'Vercel Web Analytics 指南', color: '#00d4ff' }
]

const selectLink = (id) => {
  emit('select', id)
}
</script>

<template>
  <aside class="wiki-sidebar glass-panel" :class="{ collapsed: collapsed }">
    <!-- 顶部标题栏 -->
    <div class="sidebar-header">
      <div class="logo-container" @click="emit('select', 'home')">
        <div class="logo-icon-wrapper">
          <GameIcon name="train" :size="32" color="var(--accent-color)" />
        </div>
        <div class="logo-text-wrapper" v-if="!collapsed">
          <span class="logo-title">哈比列车</span>
          <span class="logo-subtitle">游戏百科</span>
        </div>
      </div>
      
      <div class="header-actions" v-if="!collapsed">
        <!-- 主题切换 -->
        <button 
          class="action-btn theme-btn" 
          @click="emit('toggle-theme')" 
          :title="isDarkMode ? '切换亮色模式' : '切换暗色模式'"
        >
          <GameIcon :name="isDarkMode ? 'sun' : 'moon'" :size="20" />
        </button>
        
        <!-- 折叠按钮 -->
        <button 
          class="action-btn collapse-btn" 
          @click="emit('toggle-sidebar')" 
          title="收起侧边栏"
        >
          <GameIcon name="chevronLeft" :size="20" />
        </button>
      </div>
      
      <!-- 收起状态的展开按钮 -->
      <button 
        v-else
        class="expand-btn" 
        @click="emit('toggle-sidebar')" 
        title="展开侧边栏"
      >
        <GameIcon name="chevronRight" :size="20" />
      </button>
    </div>

    <!-- 导航菜单 -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="section-title" v-if="!collapsed">
          <GameIcon name="menu" :size="18" />
          <span>导航菜单</span>
        </h3>
        
        <ul class="nav-list">
          <li 
            v-for="link in quickLinks"
            :key="link.id"
            :class="['nav-item', { active: link.id === selectedId }]"
            @click="selectLink(link.id)"
            :title="collapsed ? link.title : ''"
          >
            <div class="item-content">
              <div class="nav-icon" :style="{ color: link.color }">
                <GameIcon :name="link.icon" :size="22" />
              </div>
              <div class="nav-text" v-if="!collapsed">
                <span class="nav-title">{{ link.title }}</span>
                <span class="nav-desc">{{ link.desc }}</span>
              </div>
            </div>
            <div class="active-indicator" v-if="link.id === selectedId"></div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 用户信息区域 -->
    <div class="user-section" v-if="!collapsed">
      <div v-if="isAuthenticated" class="user-card glass-panel" @click="emit('select', 'profile')">
        <div class="user-avatar">
          <GameIcon name="user" :size="24" color="var(--accent-color)" />
        </div>
        <div class="user-details">
          <div class="user-name">{{ user.username }}</div>
          <div class="user-role">
            <GameIcon name="shield" :size="12" />
            <span>{{ user.role === 'admin' ? '管理员' : '普通用户' }}</span>
          </div>
        </div>
        <GameIcon name="chevronRight" :size="18" class="user-arrow" />
      </div>
      
      <button v-else class="login-btn" @click="emit('select', 'login')">
        <GameIcon name="login" :size="20" />
        <span>登录 / 注册</span>
      </button>
    </div>

    <!-- 底部版本信息 -->
    <div class="sidebar-footer" v-if="!collapsed">
      <span class="version">v1.0.0</span>
    </div>
  </aside>
</template>

<style scoped>
.wiki-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
}

.wiki-sidebar.collapsed {
  width: 80px;
  padding: 24px 12px;
}

/* 滚动条样式 */
.wiki-sidebar::-webkit-scrollbar {
  width: 6px;
}

.wiki-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.wiki-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.wiki-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 头部区域 */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.logo-container:hover {
  transform: translateX(4px);
}

.collapsed .logo-container {
  justify-content: center;
}

.logo-icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--accent-glow);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.logo-icon-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.logo-container:hover .logo-icon-wrapper {
  transform: scale(1.05) rotate(-5deg);
  box-shadow: 0 4px 12px var(--accent-color);
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn,
.expand-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--btn-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.action-btn:hover,
.expand-btn:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: scale(1.05);
}

.expand-btn {
  position: absolute;
  top: 30px;
  right: -14px;
  z-index: 101;
  box-shadow: var(--shadow-md);
}

/* 导航区域 */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  position: relative;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  position: relative;
  z-index: 1;
}

.collapsed .item-content {
  justify-content: center;
  padding: 14px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.nav-item:hover .nav-icon {
  transform: scale(1.05);
  border-color: currentColor;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-item.active .nav-icon {
  background: var(--accent-glow);
  border-color: var(--accent-color);
}

.nav-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.nav-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.nav-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item:hover {
  background: var(--hover-bg);
}

.nav-item.active {
  background: var(--accent-glow);
}

.nav-item.active .nav-title {
  color: var(--accent-color);
  font-weight: 700;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--accent-color);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 12px var(--accent-color);
}

/* 用户区域 */
.user-section {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.user-card {
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.user-card:hover {
  background: var(--hover-bg);
  transform: translateX(4px);
  border-color: var(--accent-color);
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--accent-color);
}

.user-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-arrow {
  color: var(--text-tertiary);
  transition: all 0.2s;
}

.user-card:hover .user-arrow {
  transform: translateX(4px);
  color: var(--accent-color);
}

.login-btn {
  width: 100%;
  padding: 14px 18px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 92, 141, 0.5);
}

/* 底部区域 */
.sidebar-footer {
  padding-top: 16px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.version {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 768px) {
  .wiki-sidebar {
    transform: translateX(-100%);
  }

  .wiki-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>
