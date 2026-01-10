<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GameIcon from './icons/GameIcons.vue'

// 当前选中的版本和分类
const activeVersion = ref('V2.81')
const activeCategory = ref('')
const searchQuery = ref('')

// 版本数据
const versions = ref([
  {
    version: 'V2.81',
    title: '修复更新',
    date: '2025-01',
    badge: '修复版本',
    type: 'fix',
    categories: [
      {
        id: 'v281-fixes',
        name: '修复内容',
        icon: 'shield',
        color: '#42a5f5',
        items: [
          { text: '增加了繁体语言', type: 'new' },
          { text: '修复了傀儡师变成没有金币而且现在不能变成潜行者', type: 'fix' },
          { text: '修复了记者的相片不能购买的问题', type: 'fix' },
          { text: '修复了滑头鬼不能关灯的问题', type: 'fix' },
          { text: '拳击手的颜色变为浅灰色', type: 'adjust' },
          { text: '修复了职业分配无法刷新中立', type: 'fix' },
          { text: '修复了幻术师没有杀手商店的问题', type: 'fix' },
          { text: '修改了服务器数量上限', type: 'adjust' },
          { text: '修复了慕恋UI问题', type: 'fix' },
          { text: '修复了潜行者的能量显示', type: 'fix' },
          { text: '修复了退伍军人刀人自己死的问题', type: 'fix' }
        ]
      }
    ]
  },
  {
    version: 'V2.8',
    title: '列车更新',
    date: '2024-01',
    badge: '重大更新',
    type: 'major',
    categories: [
      {
        id: 'v28-character',
        name: '角色调整',
        icon: 'users',
        color: '#ffa726',
        items: [
          { text: '调整邮件的价格', type: 'adjust' },
          { text: '增强了潜行者三阶段数值', type: 'buff' },
          { text: '调整了滑头鬼烟雾道具', type: 'adjust' },
          { text: '调整歌手速度强化效果', type: 'adjust' },
          { text: '邮件道具现在所有人都可以用', type: 'adjust' },
          { text: '合并了记者和摄影师', type: 'adjust' },
          { text: '合并了电报和广播', type: 'adjust' },
          { text: '调整了歌手距离', type: 'adjust' },
          { text: '调整了拳击手的颜色', type: 'adjust' },
          { text: '调整了阴谋家的商店价格', type: 'adjust' },
          { text: '增加了军人的杀人惩罚', type: 'adjust' },
          { text: '调整了工程师商店价格', type: 'adjust' },
          { text: '心理学家的san值判定从99下降到70', type: 'nerf' },
          { text: '设陷者能够储存三个陷阱', type: 'buff' },
          { text: '爱慕者修改为绑定对象目标', type: 'adjust' },
          { text: '潜行者的能量需求改为了根据人数增加', type: 'adjust' },
          { text: '乘务员增加手电筒', type: 'buff' },
          { text: '记者增加了笔记的购买', type: 'buff' },
          { text: '增强了刽子区!!!!!!!!!!!!!!!!!!!!!!!', type: 'buff' },
          { text: '侦探按住shift可以听到周围的声音方向', type: 'new' },
          { text: '增加了医生的药剂冷却', type: 'adjust' },
          { text: '增加了设陷阱者的UI', type: 'new' }
        ]
      },
      {
        id: 'v28-role',
        name: '角色增加与减少',
        icon: 'star',
        color: '#66bb6a',
        items: [
          { text: '新增杀手角色[迷幻师]', type: 'new' },
          { text: '合并电报和广播', type: 'adjust' },
          { text: '合并了记者和摄影师', type: 'adjust' },
          { text: '启用了刽子区', type: 'new' }
        ]
      },
      {
        id: 'v28-bugfix',
        name: 'Bug修复',
        icon: 'shield',
        color: '#42a5f5',
        items: [
          { text: '修复潜行的三阶段冲刺问题', type: 'fix' },
          { text: '修复运动员问题', type: 'fix' },
          { text: '修复了傀儡师游戏结束重新启动后，本体清除问题', type: 'fix' },
          { text: '修复了医生无法治疗的bug', type: 'fix' },
          { text: '修复了下毒以及无法下毒死的bug', type: 'fix' },
          { text: '修复了广播员不能打中文汉字[使用电报员的UI]', type: 'fix' },
          { text: '修复了旁观者的聊天距离限制', type: 'fix' }
        ]
      },
      {
        id: 'v28-gameplay',
        name: '玩法调整',
        icon: 'gamepad',
        color: '#ec407a',
        items: [
          { text: '优化了杀手分配', type: 'adjust' },
          { text: '刀的蓄力时间却变为0.35秒', type: 'adjust' },
          { text: '修改了所有变化职业无法变成已经被禁止使用的职业', type: 'adjust' },
          { text: '背包可以看到职业介绍', type: 'new' },
          { text: '增加了地图系统，可以随机选择地图', type: 'new' },
          { text: '每一个服务器可以使用所有地图', type: 'new' }
        ]
      },
      {
        id: 'v28-mod',
        name: '模组',
        icon: 'cube',
        color: '#9c27b0',
        items: [
          { text: '删除了农夫乐事', type: 'remove' }
        ]
      }
    ]
  }
])

// 过滤后的版本数据
const filteredVersions = computed(() => {
  if (!searchQuery.value.trim()) {
    return versions.value
  }

  const query = searchQuery.value.toLowerCase()
  return versions.value.map(version => {
    const filteredCategories = version.categories.map(category => {
      const filteredItems = category.items.filter(item =>
        item.text.toLowerCase().includes(query)
      )
      return { ...category, items: filteredItems }
    }).filter(category => category.items.length > 0)

    return { ...version, categories: filteredCategories }
  }).filter(version => version.categories.length > 0)
})

// 获取当前版本的所有分类（用于右侧目录）
const currentVersionCategories = computed(() => {
  const version = versions.value.find(v => v.version === activeVersion.value)
  return version ? version.categories : []
})

// 获取更新类型的样式
const getTypeStyle = (type) => {
  const styles = {
    fix: { color: '#42a5f5', bg: 'rgba(66, 165, 245, 0.1)', label: '修复' },
    new: { color: '#66bb6a', bg: 'rgba(102, 187, 106, 0.1)', label: '新增' },
    adjust: { color: '#ffa726', bg: 'rgba(255, 167, 38, 0.1)', label: '调整' },
    buff: { color: '#66bb6a', bg: 'rgba(102, 187, 106, 0.1)', label: '增强' },
    nerf: { color: '#ef5350', bg: 'rgba(239, 83, 80, 0.1)', label: '削弱' },
    remove: { color: '#ef5350', bg: 'rgba(239, 83, 80, 0.1)', label: '删除' }
  }
  return styles[type] || styles.adjust
}

// 获取版本徽章样式
const getVersionBadgeStyle = (type) => {
  if (type === 'major') {
    return {
      bg: 'linear-gradient(135deg, #ff5c8d, #ff8fab)',
      shadow: '0 4px 20px rgba(255, 92, 141, 0.4)'
    }
  }
  return {
    bg: 'linear-gradient(135deg, #42a5f5, #64b5f6)',
    shadow: '0 4px 20px rgba(66, 165, 245, 0.4)'
  }
}

// 滚动到指定版本
const scrollToVersion = (version) => {
  activeVersion.value = version
  activeCategory.value = ''
  const element = document.getElementById(`version-${version}`)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
}

// 滚动到指定分类
const scrollToCategory = (categoryId) => {
  activeCategory.value = categoryId
  const element = document.getElementById(categoryId)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
}

// 监听滚动，更新活动状态
const handleScroll = () => {
  // 更新活动版本
  for (const version of versions.value) {
    const element = document.getElementById(`version-${version.version}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeVersion.value = version.version
        break
      }
    }
  }

  // 更新活动分类
  for (const category of currentVersionCategories.value) {
    const element = document.getElementById(category.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeCategory.value = category.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="update-log-page">
    <div class="page-header">
      <div class="page-icon">📋</div>
      <h1 class="page-title">更新日志</h1>
      <p class="page-subtitle">记录哈比列车的每一次进化</p>
      
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box glass-panel">
          <GameIcon name="search" :size="20" class="search-icon" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索更新内容..."
            class="search-input"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="clear-btn"
          >
            <GameIcon name="close" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <div class="content-layout">
      <!-- 左侧：版本导航 -->
      <aside class="version-nav glass-panel">
        <h3 class="nav-title">
          <GameIcon name="book" :size="18" />
          <span>版本列表</span>
        </h3>
        <nav class="version-list">
          <button
            v-for="version in versions"
            :key="version.version"
            :class="['version-nav-item', { active: activeVersion === version.version }]"
            @click="scrollToVersion(version.version)"
          >
            <div class="nav-item-badge" :style="{
              background: version.type === 'major' ? 'var(--accent-color)' : '#42a5f5'
            }">
              {{ version.version }}
            </div>
            <div class="nav-item-info">
              <span class="nav-item-title">{{ version.title }}</span>
              <span class="nav-item-date">{{ version.date }}</span>
            </div>
          </button>
        </nav>
      </aside>

      <!-- 中间：内容区域 -->
      <main class="content-main">
        <!-- 搜索结果提示 -->
        <div v-if="searchQuery && filteredVersions.length === 0" class="empty-state glass-panel">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">未找到匹配"{{ searchQuery }}"的更新内容</p>
          <button class="btn-secondary" @click="searchQuery = ''">
            清除搜索
          </button>
        </div>

        <!-- 版本列表 -->
        <div v-else class="versions-timeline">
          <div 
            v-for="(version, vIndex) in filteredVersions" 
            :key="version.version"
            :id="`version-${version.version}`"
            class="version-block"
          >
            <!-- 版本头部 -->
            <div class="version-header glass-panel">
              <div class="version-info">
                <div class="version-badge" :style="{ 
                  background: getVersionBadgeStyle(version.type).bg,
                  boxShadow: getVersionBadgeStyle(version.type).shadow
                }">
                  {{ version.version }}
                </div>
                <div class="version-details">
                  <h2 class="version-title">{{ version.title }}</h2>
                  <span class="version-tag">{{ version.badge }}</span>
                </div>
              </div>
              <div class="version-icon">
                <GameIcon :name="version.type === 'major' ? 'star' : 'shield'" :size="32" />
              </div>
            </div>

            <!-- 更新分类 -->
            <div class="categories-list">
              <div 
                v-for="(category, cIndex) in version.categories" 
                :key="cIndex"
                :id="category.id"
                class="category-card glass-panel card-hover"
              >
                <div class="category-header">
                  <div class="category-icon-wrapper" :style="{ 
                    background: `${category.color}20`,
                    color: category.color 
                  }">
                    <GameIcon :name="category.icon" :size="24" />
                  </div>
                  <h3 class="category-name">{{ category.name }}</h3>
                  <span class="category-count">{{ category.items.length }}</span>
                </div>
                
                <ul class="updates-list">
                  <li 
                    v-for="(item, iIndex) in category.items" 
                    :key="iIndex"
                    class="update-item"
                  >
                    <div class="update-dot" :style="{ background: getTypeStyle(item.type).color }"></div>
                    <span class="update-text">{{ item.text }}</span>
                    <span 
                      class="update-type-tag"
                      :style="{ 
                        color: getTypeStyle(item.type).color,
                        background: getTypeStyle(item.type).bg
                      }"
                    >
                      {{ getTypeStyle(item.type).label }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="changelog-footer glass-panel">
          <div class="footer-icon">🚂</div>
          <p class="footer-text">持续关注游戏更新，获取最新资讯</p>
        </div>
      </main>

      <!-- 右侧：分类目录 -->
      <aside class="category-toc glass-panel">
        <h3 class="toc-title">
          <GameIcon name="menu" :size="18" />
          <span>本页目录</span>
        </h3>
        <nav v-if="currentVersionCategories.length > 0" class="toc-list">
          <button
            v-for="category in currentVersionCategories"
            :key="category.id"
            :class="['toc-item', { active: activeCategory === category.id }]"
            @click="scrollToCategory(category.id)"
          >
            <div class="toc-icon" :style="{ color: category.color }">
              <GameIcon :name="category.icon" :size="16" />
            </div>
            <div class="toc-info">
              <span class="toc-name">{{ category.name }}</span>
              <span class="toc-count">{{ category.items.length }}项</span>
            </div>
          </button>
        </nav>
        <div v-else class="toc-empty">
          <p>选择版本查看目录</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.update-log-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 40px 40px 30px;
  background: var(--hero-gradient);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
}

.search-container {
  max-width: 600px;
  margin: 24px auto 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 16px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.search-box:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 4px 20px rgba(255, 92, 141, 0.2);
}

.search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  background: var(--bg-primary);
  border: none;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: var(--accent-color);
  color: white;
}

/* 三列布局 */
.content-layout {
  display: grid;
  grid-template-columns: 240px 1fr 240px;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 24px;
  align-items: start;
}

.page-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* 左侧版本导航 */
.version-nav {
  position: sticky;
  top: 200px;
  padding: 20px;
  border-radius: 20px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
}

.nav-title,
.toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.version-list,
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.version-nav-item:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
}

.version-nav-item.active {
  background: var(--accent-glow);
  border-color: var(--accent-color);
}

.nav-item-badge {
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.nav-item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* 中间内容区域 */
.content-main {
  min-width: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  border-radius: 24px;
  margin-bottom: 40px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.btn-secondary {
  padding: 12px 24px;
  background: var(--btn-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

/* 版本时间线 */
.versions-timeline {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.version-block {
  scroll-margin-top: 200px;
}

/* 版本头部 */
.version-header {
  padding: 32px;
  border-radius: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.version-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s;
}

.version-header:hover::before {
  left: 100%;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.version-badge {
  padding: 16px 32px;
  border-radius: 16px;
  color: white;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.version-header:hover .version-badge {
  transform: scale(1.1) rotate(-2deg);
}

.version-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.version-tag {
  display: inline-block;
  padding: 6px 14px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  align-self: flex-start;
}

.version-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--accent-glow);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.version-header:hover .version-icon {
  transform: scale(1.15) rotate(10deg);
}

/* 分类列表 */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-card {
  padding: 24px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  scroll-margin-top: 200px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
}

.category-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.category-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.category-count {
  padding: 6px 14px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 更新列表 */
.updates-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.update-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.update-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-color);
  transform: scaleY(0);
  transition: transform 0.2s;
}

.update-item:hover {
  background: var(--hover-bg);
  transform: translateX(8px);
}

.update-item:hover::before {
  transform: scaleY(1);
}

.update-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.update-text {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.update-type-tag {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

/* 右侧分类目录 */
.category-toc {
  position: sticky;
  top: 200px;
  padding: 20px;
  border-radius: 20px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.toc-item:hover {
  background: var(--hover-bg);
  transform: translateX(4px);
}

.toc-item.active {
  background: var(--accent-glow);
  border-color: var(--accent-color);
}

.toc-item.active .toc-icon {
  transform: scale(1.1);
}

.toc-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.toc-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.toc-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-count {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.toc-empty {
  padding: 20px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

/* 底部 */
.changelog-footer {
  margin-top: 40px;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
}

.footer-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

/* 滚动条样式 */
.version-nav::-webkit-scrollbar,
.category-toc::-webkit-scrollbar {
  width: 6px;
}

.version-nav::-webkit-scrollbar-track,
.category-toc::-webkit-scrollbar-track {
  background: transparent;
}

.version-nav::-webkit-scrollbar-thumb,
.category-toc::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.version-nav::-webkit-scrollbar-thumb:hover,
.category-toc::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 200px 1fr;
    gap: 20px;
  }

  .category-toc {
    display: none;
  }
}

@media (max-width: 900px) {
  .content-layout {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }

  .version-nav {
    position: static;
    max-height: none;
    margin-bottom: 24px;
  }

  .version-nav .nav-title {
    display: flex;
  }

  .version-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 20px 20px;
  }

  .page-icon {
    font-size: 2.5rem;
    margin-bottom: 8px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .search-container {
    margin: 16px auto 0;
  }

  .search-box {
    padding: 10px 16px;
  }

  .content-layout {
    padding: 20px 16px;
  }

  .version-list {
    grid-template-columns: 1fr;
  }

  .version-nav-item {
    padding: 10px;
  }

  .versions-timeline {
    gap: 32px;
  }

  .version-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .version-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .version-badge {
    font-size: 1.3rem;
    padding: 10px 20px;
  }

  .version-title {
    font-size: 1.3rem;
  }

  .version-icon {
    width: 48px;
    height: 48px;
    align-self: flex-end;
  }

  .category-card {
    padding: 20px;
  }

  .category-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  .category-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .category-name {
    font-size: 1.05rem;
  }

  .update-item {
    padding: 12px;
    flex-wrap: wrap;
  }

  .update-text {
    font-size: 0.9rem;
    flex-basis: 100%;
    order: 2;
  }

  .update-dot {
    order: 1;
  }

  .update-type-tag {
    order: 3;
    margin-left: auto;
  }

  .changelog-footer {
    margin-top: 32px;
    padding: 24px 20px;
  }

  .footer-icon {
    font-size: 2rem;
  }

  .footer-text {
    font-size: 0.85rem;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.6rem;
  }

  .version-badge {
    font-size: 1.1rem;
    padding: 8px 16px;
  }

  .version-title {
    font-size: 1.1rem;
  }

  .category-name {
    font-size: 0.95rem;
  }

  .update-text {
    font-size: 0.85rem;
  }
}
</style>
