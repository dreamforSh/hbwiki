<script setup>
import { ref } from 'vue'
import GameIcon from './icons/GameIcons.vue'

const emit = defineEmits(['navigate-to-version'])

// 版本列表数据
const versions = ref([
  {
    version: 'V2.81',
    title: '修复更新',
    date: '2025-01',
    badge: '修复版本',
    type: 'fix',
    description: '本次更新主要修复了多个职业的bug，优化了游戏体验，并新增了繁体语言支持。',
    highlights: [
      '修复了10+个职业相关bug',
      '新增繁体语言支持',
      '优化职业分配系统',
      '修复UI显示问题'
    ],
    stats: {
      fixes: 9,
      new: 1,
      adjustments: 2
    }
  },
  {
    version: 'V2.8',
    title: '列车更新',
    date: '2025-01',
    badge: '重大更新',
    type: 'major',
    description: '列车系统全面革新！新增迷幻师角色，20+角色调整，全新地图系统，带来前所未有的游戏体验。',
    highlights: [
      '新增杀手角色[迷幻师]',
      '20+角色平衡性调整',
      '全新地图系统上线',
      '启用刽子区角色',
      '优化杀手分配机制'
    ],
    stats: {
      new: 8,
      adjustments: 22,
      fixes: 7,
      removed: 1
    }
  }
])

const handleVersionClick = (version) => {
  emit('navigate-to-version', version)
}

const getVersionColor = (type) => {
  return type === 'major' 
    ? 'linear-gradient(135deg, #ff5c8d, #ff8fab)'
    : 'linear-gradient(135deg, #42a5f5, #64b5f6)'
}

const getVersionShadow = (type) => {
  return type === 'major'
    ? '0 8px 32px rgba(255, 92, 141, 0.3)'
    : '0 8px 32px rgba(66, 165, 245, 0.3)'
}
</script>

<template>
  <div class="changelog-index-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-icon">📋</div>
      <h1 class="page-title">更新日志</h1>
      <p class="page-subtitle">记录哈比列车的每一次进化</p>
    </div>

    <div class="content-container">
      <!-- 版本卡片网格 -->
      <div class="versions-grid">
        <div
          v-for="(version, index) in versions"
          :key="version.version"
          class="version-card glass-panel card-hover"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="handleVersionClick(version.version)"
        >
          <!-- 版本头部 -->
          <div class="card-header">
            <div 
              class="version-badge"
              :style="{
                background: getVersionColor(version.type),
                boxShadow: getVersionShadow(version.type)
              }"
            >
              {{ version.version }}
            </div>
            <div class="version-meta">
              <h2 class="version-title">{{ version.title }}</h2>
              <div class="meta-row">
                <span class="version-tag">{{ version.badge }}</span>
                <span class="version-date">{{ version.date }}</span>
              </div>
            </div>
          </div>

          <!-- 版本描述 -->
          <p class="version-description">{{ version.description }}</p>

          <!-- 更新亮点 -->
          <div class="highlights-section">
            <h3 class="highlights-title">
              <GameIcon name="star" :size="16" />
              <span>更新亮点</span>
            </h3>
            <ul class="highlights-list">
              <li 
                v-for="(highlight, hIndex) in version.highlights" 
                :key="hIndex"
                class="highlight-item"
              >
                <span class="highlight-dot"></span>
                <span>{{ highlight }}</span>
              </li>
            </ul>
          </div>

          <!-- 统计信息 -->
          <div class="stats-section">
            <div v-if="version.stats.new" class="stat-item">
              <span class="stat-label">新增</span>
              <span class="stat-value new">{{ version.stats.new }}</span>
            </div>
            <div v-if="version.stats.adjustments" class="stat-item">
              <span class="stat-label">调整</span>
              <span class="stat-value adjust">{{ version.stats.adjustments }}</span>
            </div>
            <div v-if="version.stats.fixes" class="stat-item">
              <span class="stat-label">修复</span>
              <span class="stat-value fix">{{ version.stats.fixes }}</span>
            </div>
            <div v-if="version.stats.removed" class="stat-item">
              <span class="stat-label">删除</span>
              <span class="stat-value remove">{{ version.stats.removed }}</span>
            </div>
          </div>

          <!-- 查看详情按钮 -->
          <button class="view-details-btn">
            <span>查看详情</span>
            <GameIcon name="chevronRight" :size="18" class="btn-arrow" />
          </button>

          <!-- 装饰性背景 -->
          <div class="card-glow"></div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="index-footer glass-panel">
        <div class="footer-icon">🚂</div>
        <p class="footer-text">持续关注游戏更新，获取最新资讯</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.changelog-index-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 60px 40px;
  background: var(--hero-gradient);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 60px;
}

.page-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
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
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 版本卡片网格 */
.versions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.version-card {
  padding: 32px;
  border-radius: 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.version-card {
  transform: translateY(20px);
}

.version-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 92, 141, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.version-card:hover .card-glow {
  opacity: 1;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.version-badge {
  padding: 12px 20px;
  border-radius: 14px;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  transition: transform 0.3s;
}

.version-card:hover .version-badge {
  transform: scale(1.1) rotate(-3deg);
}

.version-meta {
  flex: 1;
  min-width: 0;
}

.version-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.version-tag {
  padding: 4px 12px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.version-date {
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

/* 描述 */
.version-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* 亮点部分 */
.highlights-section {
  margin-bottom: 24px;
}

.highlights-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: 8px;
  transition: all 0.2s;
}

.highlight-item:hover {
  background: var(--hover-bg);
  transform: translateX(4px);
}

.highlight-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  flex-shrink: 0;
}

/* 统计部分 */
.stats-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 60px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-value.new {
  color: #66bb6a;
}

.stat-value.adjust {
  color: #ffa726;
}

.stat-value.fix {
  color: #42a5f5;
}

.stat-value.remove {
  color: #ef5350;
}

/* 查看详情按钮 */
.view-details-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.view-details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.5);
}

.btn-arrow {
  transition: transform 0.3s;
}

.version-card:hover .btn-arrow {
  transform: translateX(4px);
}

/* 底部 */
.index-footer {
  padding: 40px;
  border-radius: 24px;
  text-align: center;
}

.footer-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .versions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .content-container {
    padding: 0 20px;
  }

  .versions-grid {
    gap: 24px;
    margin-bottom: 40px;
  }

  .version-card {
    padding: 24px;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
  }

  .version-badge {
    font-size: 1.3rem;
    padding: 10px 16px;
  }

  .version-title {
    font-size: 1.5rem;
  }

  .stats-section {
    gap: 8px;
    padding: 12px;
  }

  .stat-value {
    font-size: 1.3rem;
  }

  .index-footer {
    padding: 30px 20px;
  }
}
</style>
