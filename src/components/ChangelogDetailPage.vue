<script setup>
import { ref, computed } from 'vue'
import GameIcon from './icons/GameIcons.vue'

const props = defineProps({
  version: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back-to-index', 'navigate-to-version'])

// 版本数据库
const versionsData = {
  'V2.81': {
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
  'V2.8': {
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
}

// 获取当前版本数据
const versionData = computed(() => {
  return versionsData[props.version] || null
})

// 其他可用版本（用于快速切换）
const otherVersions = computed(() => {
  return Object.keys(versionsData).filter(v => v !== props.version)
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

const handleBack = () => {
  emit('back-to-index')
}

const switchVersion = (version) => {
  emit('navigate-to-version', version)
}
</script>

<template>
  <div v-if="versionData" class="changelog-detail-page">
    <!-- 返回按钮 -->
    <button class="back-btn glass-panel" @click="handleBack">
      <GameIcon name="chevronLeft" :size="20" />
      <span>返回列表</span>
    </button>

    <!-- 版本头部 -->
    <div class="version-hero glass-panel">
      <div class="hero-content">
        <div 
          class="version-badge-large"
          :style="{
            background: getVersionBadgeStyle(versionData.type).bg,
            boxShadow: getVersionBadgeStyle(versionData.type).shadow
          }"
        >
          {{ versionData.version }}
        </div>
        <div class="hero-info">
          <h1 class="hero-title">{{ versionData.title }}</h1>
          <div class="hero-meta">
            <span class="hero-badge">{{ versionData.badge }}</span>
            <span class="hero-date">发布于 {{ versionData.date }}</span>
          </div>
        </div>
      </div>
      <div class="hero-icon">
        <GameIcon :name="versionData.type === 'major' ? 'star' : 'shield'" :size="48" />
      </div>
    </div>

    <!-- 更新分类 -->
    <div class="content-container">
      <div class="categories-section">
        <div 
          v-for="(category, index) in versionData.categories"
          :key="category.id"
          :id="category.id"
          class="category-card glass-panel"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="category-header">
            <div class="category-icon-wrapper" :style="{ 
              background: `${category.color}20`,
              color: category.color 
            }">
              <GameIcon :name="category.icon" :size="28" />
            </div>
            <h2 class="category-name">{{ category.name }}</h2>
            <span class="category-count">{{ category.items.length }}项</span>
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

      <!-- 其他版本快速切换 -->
      <div v-if="otherVersions.length > 0" class="other-versions glass-panel">
        <h3 class="other-versions-title">
          <GameIcon name="book" :size="18" />
          <span>查看其他版本</span>
        </h3>
        <div class="version-pills">
          <button
            v-for="ver in otherVersions"
            :key="ver"
            class="version-pill"
            @click="switchVersion(ver)"
          >
            {{ ver }}
            <GameIcon name="chevronRight" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 版本不存在 -->
  <div v-else class="not-found">
    <div class="not-found-content glass-panel">
      <div class="not-found-icon">❌</div>
      <h2 class="not-found-title">版本不存在</h2>
      <p class="not-found-text">未找到版本 {{ version }} 的更新日志</p>
      <button class="btn-primary" @click="handleBack">
        返回列表
      </button>
    </div>
  </div>
</template>

<style scoped>
.changelog-detail-page {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 32px;
}

.back-btn:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateX(-4px);
}

/* 版本头部 */
.version-hero {
  padding: 48px;
  border-radius: 28px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  position: relative;
  overflow: hidden;
}

.version-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
}

.version-badge-large {
  padding: 20px 36px;
  border-radius: 20px;
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-badge {
  padding: 6px 16px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero-date {
  color: var(--text-tertiary);
  font-size: 0.95rem;
}

.hero-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--accent-glow);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 内容区域 */
.content-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.categories-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-card {
  padding: 32px;
  border-radius: 24px;
  transition: all 0.3s;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card {
  transform: translateY(20px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.category-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.category-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.category-count {
  padding: 8px 16px;
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
  gap: 14px;
  padding: 16px 20px;
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
  width: 4px;
  height: 100%;
  background: var(--accent-color);
  transform: scaleY(0);
  transition: transform 0.2s;
}

.update-item:hover {
  background: var(--hover-bg);
  transform: translateX(10px);
}

.update-item:hover::before {
  transform: scaleY(1);
}

.update-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.update-text {
  flex: 1;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

.update-type-tag {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

/* 其他版本 */
.other-versions {
  padding: 28px;
  border-radius: 20px;
}

.other-versions-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.version-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.version-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.version-pill:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

/* 未找到页面 */
.not-found {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.not-found-content {
  text-align: center;
  padding: 60px 40px;
  border-radius: 24px;
  max-width: 500px;
}

.not-found-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
}

.not-found-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.not-found-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 28px;
}

.btn-primary {
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .changelog-detail-page {
    padding: 24px 20px;
  }

  .back-btn {
    margin-bottom: 24px;
  }

  .version-hero {
    padding: 32px 24px;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .version-badge-large {
    font-size: 1.8rem;
    padding: 14px 24px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-icon {
    width: 64px;
    height: 64px;
    align-self: flex-end;
  }

  .category-card {
    padding: 24px 20px;
  }

  .category-header {
    gap: 16px;
    flex-wrap: wrap;
  }

  .category-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .category-name {
    font-size: 1.3rem;
  }

  .update-item {
    padding: 14px 16px;
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

  .other-versions {
    padding: 24px 20px;
  }

  .not-found-content {
    padding: 40px 24px;
  }

  .not-found-icon {
    font-size: 4rem;
  }

  .not-found-title {
    font-size: 1.6rem;
  }
}
</style>
