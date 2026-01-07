<script setup>
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
  }
})

const emit = defineEmits(['select', 'toggle-sidebar', 'toggle-theme'])

const quickLinks = [
  { id: 'gameplay', icon: '🎮', title: '游戏玩法', desc: '了解基本游戏规则和玩法机制', color: '#66bb6a' },
  { id: 'professions', icon: '👥', title: '职业介绍', desc: '查看所有职业的详细技能说明', color: '#42a5f5' },
  { id: 'map', icon: '🗺️', title: '地图指南', desc: '熟悉列车各车厢的布局', color: '#ec407a' },
  { id: 'tips', icon: '💡', title: '进阶技巧', desc: '学习高级玩家的实战技巧', color: '#ffa726' }
]

const selectLink = (id) => {
  emit('select', id)
}
</script>

<template>
  <aside class="wiki-sidebar glass-panel" :class="{ collapsed: collapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon-wrapper">
          <span class="logo-icon">🚂</span>
        </div>
        <div class="logo-text-wrapper">
          <span class="logo-title">哈比列车</span>
          <span class="logo-subtitle">WIKI</span>
        </div>
      </div>
      <div class="header-actions">
        <!-- 主题切换按钮 -->
        <button class="action-btn theme-btn" @click="emit('toggle-theme')" :title="isDarkMode ? '切换亮色模式' : '切换暗色模式'">
          <span class="icon-wrapper">
            <span v-if="isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </span>
        </button>
        <!-- 折叠按钮 -->
        <button class="action-btn collapse-btn" @click="emit('toggle-sidebar')" :title="collapsed ? '展开侧边栏' : '收起侧边栏'">
          <span class="collapse-icon">{{ collapsed ? '❯' : '❮' }}</span>
        </button>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="section-title">
          <span class="section-icon">🧭</span>
          <span class="section-text">导航菜单</span>
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
              <span class="nav-icon" :style="{ color: link.color }">{{ link.icon }}</span>
              <div class="nav-text">
                <span class="nav-title">{{ link.title }}</span>
                <span class="nav-desc">{{ link.desc }}</span>
              </div>
            </div>
            <!-- 选中指示器 -->
            <div class="active-indicator" v-if="link.id === selectedId"></div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer" v-if="!collapsed">
      <span class="version">v1.0.0</span>
    </div>
  </aside>
</template>

<style scoped>
.wiki-sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal), transform var(--transition-normal);
  border-right: 1px solid var(--border-color);
  background: var(--sidebar-bg);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  border-radius: 0 24px 24px 0;
}

.wiki-sidebar.collapsed {
  width: 80px;
}

/* 头部样式 */
.sidebar-header {
  padding: 24px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  transition: opacity 0.2s;
}

.logo-icon-wrapper {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent-color), #ff8f70);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--accent-shadow);
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s, transform 0.2s;
}

.logo-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-color);
  letter-spacing: 2px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 折叠状态下的 Header */
.wiki-sidebar.collapsed .logo-text-wrapper {
  display: none;
}

.wiki-sidebar.collapsed .sidebar-header {
  padding: 24px 0;
  flex-direction: column;
  height: auto;
  gap: 20px;
}

.wiki-sidebar.collapsed .header-actions {
  flex-direction: column;
  width: 100%;
  align-items: center;
}

/* 按钮样式 */
.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.theme-btn:hover {
  color: #fbbf24;
}

.collapse-btn:hover {
  color: var(--accent-color);
}

/* 导航列表 */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 16px;
}

.nav-section {
  margin-bottom: 24px;
}

.section-title {
  padding: 0 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.section-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.wiki-sidebar.collapsed .section-title {
  justify-content: center;
}

.wiki-sidebar.collapsed .section-icon {
  font-size: 1.3rem;
}

.wiki-sidebar.collapsed .section-text {
  display: none;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  overflow: hidden;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  z-index: 1;
  position: relative;
  gap: 12px;
}

.nav-item:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-glow);
  color: var(--accent-color);
  font-weight: 500;
}

.nav-item.active .item-content {
  background: linear-gradient(90deg, rgba(255, 92, 141, 0.1) 0%, rgba(255, 92, 141, 0.02) 100%);
}

.nav-icon {
  font-size: 1.4rem;
  min-width: 28px;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15) rotate(5deg);
}

.nav-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.nav-title {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  opacity: 0.8;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: var(--accent-color);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 8px var(--accent-color);
}

/* 折叠状态下的列表项 */
.wiki-sidebar.collapsed .nav-item {
  border-radius: 12px;
}

.wiki-sidebar.collapsed .nav-item:hover {
  transform: none;
  background: var(--hover-bg);
}

.wiki-sidebar.collapsed .item-content {
  justify-content: center;
  padding: 14px 0;
  gap: 0;
}

.wiki-sidebar.collapsed .nav-icon {
  font-size: 1.6rem;
  min-width: auto;
}

.wiki-sidebar.collapsed .nav-text {
  display: none;
}

.wiki-sidebar.collapsed .active-indicator {
  display: none;
}

.wiki-sidebar.collapsed .nav-item.active {
  background: var(--hover-bg);
  color: var(--accent-color);
}

.sidebar-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.version {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: monospace;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .wiki-sidebar {
    width: 280px;
    height: 100vh;
    top: 0;
    left: 0;
    border-radius: 0;
    transform: translateX(0);
  }

  .wiki-sidebar.collapsed {
    width: 280px;
    transform: translateX(-100%);
  }

  /* 移动端不显示折叠状态的样式，而是直接隐藏 */
  .wiki-sidebar.collapsed .logo-text-wrapper {
    display: flex;
  }

  .wiki-sidebar.collapsed .sidebar-header {
    padding: 24px;
    flex-direction: row;
    height: 88px;
    gap: 0;
  }

  .wiki-sidebar.collapsed .header-actions {
    flex-direction: row;
    width: auto;
  }

  .wiki-sidebar.collapsed .section-title {
    display: flex;
  }

  .wiki-sidebar.collapsed .section-icon {
    font-size: 1.1rem;
  }

  .wiki-sidebar.collapsed .section-text {
    display: block;
  }

  .wiki-sidebar.collapsed .item-content {
    justify-content: flex-start;
    padding: 14px 12px;
    gap: 12px;
  }

  .wiki-sidebar.collapsed .nav-icon {
    font-size: 1.4rem;
    min-width: 28px;
  }

  .wiki-sidebar.collapsed .nav-text {
    display: flex;
  }

  .wiki-sidebar.collapsed .active-indicator {
    display: block;
  }
}
</style>
