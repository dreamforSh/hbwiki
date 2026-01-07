<script setup>
const props = defineProps({
  profession: {
    type: Object,
    default: null
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate', 'toggle-sidebar'])

const quickLinks = [
  { icon: '🎮', title: '游戏玩法', desc: '了解基本游戏规则和玩法机制', color: '#66bb6a' },
  { icon: '👥', title: '职业介绍', desc: '查看所有职业的详细技能说明', color: '#42a5f5' },
  { icon: '🗺️', title: '地图指南', desc: '熟悉列车各车厢的布局', color: '#ec407a' },
  { icon: '💡', title: '进阶技巧', desc: '学习高级玩家的实战技巧', color: '#ffa726' }
]

const beginnerTips = [
  '游戏开始时注意观察周围玩家的行为',
  '合理利用SAN值系统，避免精神崩溃',
  '不同职业有不同的胜利条件，请仔细阅读',
  '善用列车上的各种道具和机关',
  '与队友保持沟通，但要小心伪装者'
]
</script>

<template>
  <main class="wiki-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 展开侧边栏按钮（侧边栏收起时显示） -->
    <button 
      v-if="sidebarCollapsed" 
      class="expand-sidebar-btn glass-panel"
      @click="emit('toggle-sidebar')"
      title="展开侧边栏"
    >
      <span class="icon">☰</span>
    </button>
    
    <!-- 欢迎页面 -->
    <div v-if="!profession" class="welcome-page">
      <!-- 头部横幅 -->
      <div class="hero-banner">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">、星琼铁道版 Wiki</div>
          <h1 class="hero-title">哈比列车</h1>
          <p class="hero-subtitle">在这趟神秘的列车上，每个人都有自己的秘密...</p>
          <div class="hero-actions">
            <button class="btn-primary">开始探索</button>
            <button class="btn-secondary">查看更新日志</button>
          </div>
        </div>
      </div>

      <div class="content-container">
        <!-- 数据统计 -->
        <section class="stats-section">
          <div class="stat-card glass-panel card-hover">
            <div class="stat-icon-wrapper" style="background: rgba(255, 92, 141, 0.1); color: #ff5c8d;">
              <span class="stat-icon">👤</span>
            </div>
            <div class="stat-info">
              <span class="stat-number">36</span>
              <span class="stat-label">职业总数</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover">
            <div class="stat-icon-wrapper" style="background: rgba(66, 165, 245, 0.1); color: #42a5f5;">
              <span class="stat-icon">⚔️</span>
            </div>
            <div class="stat-info">
              <span class="stat-number">3</span>
              <span class="stat-label">阵营分类</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover">
            <div class="stat-icon-wrapper" style="background: rgba(255, 167, 38, 0.1); color: #ffa726;">
              <span class="stat-icon">🎯</span>
            </div>
            <div class="stat-info">
              <span class="stat-number">10+</span>
              <span class="stat-label">特殊技能</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover">
            <div class="stat-icon-wrapper" style="background: rgba(102, 187, 106, 0.1); color: #66bb6a;">
              <span class="stat-icon">🚃</span>
            </div>
            <div class="stat-info">
              <span class="stat-number">8</span>
              <span class="stat-label">列车车厢</span>
            </div>
          </div>
        </section>

        <div class="content-grid">
          <!-- 左侧主要内容 -->
          <div class="main-column">
            <!-- 游戏简介 -->
            <section class="content-section">
              <h2 class="section-title">
                <span class="title-icon">📖</span>
                游戏简介
              </h2>
              <div class="intro-card glass-panel">
                <p>《哈比列车》是一款多人社交推理游戏，玩家将在一列神秘的火车上扮演不同的职业角色。</p>
                <p>每个职业都有独特的技能和胜利条件，玩家需要通过观察、推理和交流来达成目标。</p>
                <p>游戏融合了狼人杀、太空狼人杀等经典社交推理元素，加入了独特的SAN值系统和列车场景互动。</p>
              </div>
            </section>

            <!-- 阵营介绍 -->
            <section class="content-section">
              <h2 class="section-title">
                <span class="title-icon">⚔️</span>
                阵营介绍
              </h2>
              <div class="factions-grid">
                <div class="faction-card good glass-panel card-hover">
                  <div class="faction-header">
                    <span class="faction-icon">😇</span>
                    <h3>好人阵营</h3>
                  </div>
                  <p>维护列车秩序，找出并消灭所有威胁。包括平民、义警等职业。</p>
                </div>
                <div class="faction-card evil glass-panel card-hover">
                  <div class="faction-header">
                    <span class="faction-icon">😈</span>
                    <h3>坏人阵营</h3>
                  </div>
                  <p>隐藏身份，暗中破坏，消灭所有好人。包括杀手等职业。</p>
                </div>
                <div class="faction-card neutral glass-panel card-hover">
                  <div class="faction-header">
                    <span class="faction-icon">🎭</span>
                    <h3>中立阵营</h3>
                  </div>
                  <p>有自己独特的胜利条件，可能与任何阵营合作或对抗。</p>
                </div>
              </div>
            </section>
          </div>

          <!-- 右侧侧边栏 -->
          <div class="side-column">
            <!-- 快速导航 -->
            <section class="content-section">
              <h2 class="section-title">
                <span class="title-icon">🚀</span>
                快速导航
              </h2>
              <div class="quick-nav-list">
                <div v-for="(link, index) in quickLinks" :key="index" class="nav-item glass-panel card-hover">
                  <span class="nav-icon" :style="{ color: link.color }">{{ link.icon }}</span>
                  <div class="nav-info">
                    <h3>{{ link.title }}</h3>
                    <p>{{ link.desc }}</p>
                  </div>
                  <span class="nav-arrow">→</span>
                </div>
              </div>
            </section>

            <!-- 新手提示 -->
            <section class="content-section">
              <h2 class="section-title">
                <span class="title-icon">💡</span>
                新手提示
              </h2>
              <div class="tips-list glass-panel">
                <div v-for="(tip, index) in beginnerTips" :key="index" class="tip-item">
                  <span class="tip-number">{{ index + 1 }}</span>
                  <span class="tip-text">{{ tip }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="wiki-footer">
        <div class="footer-content">
          <div class="footer-logo">🚂 哈比列车</div>
          <p>哈比列车职业Wiki · 数据来源于哈比列车星琼铁道版</p>
          <p class="copyright">© 2023 Hobby Train Wiki. All rights reserved.</p>
        </div>
      </footer>
    </div>

    <!-- 职业详情页面 -->
    <article v-else class="profession-detail">
      <div class="detail-hero glass-panel">
        <div class="detail-header">
          <div class="icon-container">
            <span class="detail-icon">{{ profession.icon }}</span>
          </div>
          <div class="detail-titles">
            <div class="title-row">
              <h1>{{ profession.name }}</h1>
              <span class="category-badge">{{ profession.category }}</span>
            </div>
            <span class="name-en">{{ profession.nameEn || 'Profession Name' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-content">
        <section class="detail-section glass-panel">
          <h2 class="detail-title">
            <span class="title-icon">📖</span>
            职业介绍
          </h2>
          <p class="description">{{ profession.description }}</p>
        </section>

        <section class="detail-section glass-panel">
          <h2 class="detail-title">
            <span class="title-icon">✨</span>
            职业特点
          </h2>
          <ul class="features-list">
            <li v-for="(feature, index) in profession.features" :key="index">
              <span class="feature-dot"></span>
              {{ feature }}
            </li>
          </ul>
        </section>
      </div>
    </article>
  </main>
</template>

<style scoped>
.wiki-content {
  margin-left: 280px;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: margin-left var(--transition-normal);
  position: relative;
  padding-bottom: 40px;
  overflow-x: hidden;
  width: calc(100% - 280px);
}

.wiki-content.sidebar-collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* 展开按钮 */
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
  transition: all 0.2s ease;
}

.expand-sidebar-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.05);
}

/* 欢迎页面样式 */
.welcome-page {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;
}

/* Hero 横幅 */
.hero-banner {
  position: relative;
  padding: 80px 40px; /* 减小上下内边距 */
  margin-bottom: 60px;
  text-align: center;
  overflow: hidden;
  background: var(--hero-gradient);
  border-bottom: 1px solid var(--border-color);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 92, 141, 0.1) 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, rgba(66, 165, 245, 0.08) 0%, transparent 40%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 92, 141, 0.1);
  color: var(--accent-color);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 92, 141, 0.2);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 20px;
  letter-spacing: -1px;
  background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.35rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 14px 36px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 92, 141, 0.4);
}

.btn-secondary {
  padding: 14px 36px;
  background: var(--btn-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
}

/* 数据统计 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
  margin-top: -50px;
  position: relative;
  z-index: 2;
}

.stat-card {
  padding: 28px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.title-icon {
  font-size: 1.5rem;
}

.intro-card {
  padding: 36px;
  border-radius: 24px;
}

.intro-card p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 16px;
}

.intro-card p:last-child {
  margin-bottom: 0;
}

/* 阵营卡片 */
.factions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.faction-card {
  padding: 28px;
  border-radius: 24px;
  height: 100%;
}

.faction-card.good { border-top: 4px solid var(--good-color); }
.faction-card.evil { border-top: 4px solid var(--evil-color); }
.faction-card.neutral { border-top: 4px solid var(--neutral-color); }

.faction-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.faction-icon {
  font-size: 2rem;
}

.faction-header h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin: 0;
  font-weight: 700;
}

.faction-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 快速导航 */
.quick-nav-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  gap: 16px;
}

.nav-icon {
  font-size: 2rem;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 14px;
  flex-shrink: 0;
}

.nav-info {
  flex: 1;
}

.nav-info h3 {
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.nav-info p {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.nav-arrow {
  color: var(--text-tertiary);
  font-size: 1.2rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s;
}

.nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--accent-color);
}

/* 新手提示 */
.tips-list {
  padding: 12px 28px;
  border-radius: 24px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-color);
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-number {
  width: 26px;
  height: 26px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  margin-right: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 页脚 */
.wiki-footer {
  margin-top: 40px;
  padding: 24px 0;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.wiki-footer p {
  color: var(--text-tertiary);
  font-size: 0.85rem;
  margin: 4px 0;
}

.copyright {
  opacity: 0.6;
}

/* 职业详情样式 */
.profession-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}

.detail-hero {
  padding: 48px;
  border-radius: 32px;
  margin-bottom: 40px;
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--bg-secondary) 100%);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 40px;
}

.icon-container {
  width: 120px;
  height: 120px;
  background: var(--bg-primary);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.detail-icon {
  font-size: 5rem;
}

.detail-titles {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail-titles h1 {
  margin: 0;
  font-size: 3rem;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -1px;
}

.category-badge {
  background: rgba(255, 92, 141, 0.1);
  color: var(--accent-color);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid rgba(255, 92, 141, 0.2);
  white-space: nowrap;
}

.name-en {
  color: var(--text-tertiary);
  font-size: 1.2rem;
  font-weight: 500;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-section {
  padding: 40px;
  border-radius: 32px;
}

.detail-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.description {
  color: var(--text-secondary);
  font-size: 1.15rem;
  line-height: 1.8;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.features-list li {
  position: relative;
  padding: 20px 24px;
  background: var(--bg-primary);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.features-list li:hover {
  transform: translateX(4px);
  background: var(--hover-bg);
  color: var(--text-primary);
}

.feature-dot {
  width: 10px;
  height: 10px;
  background: var(--accent-color);
  border-radius: 50%;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1399px) and (min-width: 768px) {
  .wiki-content {
    margin-left: 280px;
    width: calc(100% - 280px);
  }
  
  .wiki-content.sidebar-collapsed {
    margin-left: 80px;
    width: calc(100% - 80px);
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .side-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}

@media (max-width: 992px) {
  .hero-title {
    font-size: 3.5rem;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wiki-content {
    margin-left: 0;
    padding-bottom: 80px;
    width: 100%;
  }
  
  .wiki-content.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }
  
  .expand-sidebar-btn {
    left: 20px;
  }

  .content-container {
    padding: 0 20px;
  }

  .hero-banner {
    padding: 80px 20px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    margin-top: 0;
  }
  
  .side-column {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .title-row {
    justify-content: center;
  }

  .profession-detail {
    padding: 20px;
  }

  .detail-hero {
    padding: 32px;
  }

  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
