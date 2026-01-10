<script setup>
import { ref, onMounted } from 'vue'
import GameIcon from './icons/GameIcons.vue'
import GameplayPage from './GameplayPage.vue'
import ProfessionsPage from './ProfessionsPage.vue'
import MapGuidePage from './MapGuidePage.vue'
import AdvancedTipsPage from './AdvancedTipsPage.vue'
import ChangelogIndexPage from './ChangelogIndexPage.vue'
import ChangelogDetailPage from './ChangelogDetailPage.vue'
import RegisterPage from './RegisterPage.vue'
import ForgotPasswordPage from './ForgotPasswordPage.vue'

const props = defineProps({
  currentPage: {
    type: String,
    default: 'home'
  },
  profession: {
    type: Object,
    default: null
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false
  },
  changelogVersion: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['navigate', 'toggle-sidebar', 'select-profession'])

const quickLinks = [
  { id: 'gameplay', icon: 'gamepad', title: '游戏玩法', desc: '了解基本游戏规则和玩法机制', color: '#66bb6a' },
  { id: 'professions', icon: 'users', title: '职业介绍', desc: '查看所有职业的详细技能说明', color: '#42a5f5' },
  { id: 'map', icon: 'map', title: '地图指南', desc: '熟悉列车各车厢的布局', color: '#ec407a' },
  { id: 'tips', icon: 'fire', title: '进阶技巧', desc: '学习高级玩家的实战技巧', color: '#ffa726' }
]

const beginnerTips = [
  '游戏开始时注意观察周围玩家的行为',
  '合理利用SAN值系统，避免精神崩溃',
  '不同职业有不同的胜利条件，请仔细阅读',
  '善用列车上的各种道具和机关',
  '与队友保持沟通，但要小心伪装者'
]

// 数字计数动画
const stats = ref({
  professions: 0,
  factions: 0,
  skills: 0,
  carriages: 0
})

const targetStats = {
  professions: 36,
  factions: 3,
  skills: 10,
  carriages: 8
}

const animateNumber = (target, key, duration = 2000) => {
  const start = 0
  const increment = target / (duration / 16)
  const timer = setInterval(() => {
    stats.value[key] = Math.min(Math.ceil(stats.value[key] + increment), target)
    if (stats.value[key] >= target) {
      stats.value[key] = target
      clearInterval(timer)
    }
  }, 16)
}

// 视频加载状态
const videoLoading = ref(true)
const videoError = ref(false)

const handleVideoLoad = () => {
  videoLoading.value = false
}

const handleVideoError = () => {
  videoLoading.value = false
  videoError.value = true
}

onMounted(() => {
  // 延迟启动数字动画
  setTimeout(() => {
    Object.keys(targetStats).forEach(key => {
      animateNumber(targetStats[key], key)
    })
  }, 500)
  
  // 视频加载超时处理（10秒后如果还在加载就显示错误）
  setTimeout(() => {
    if (videoLoading.value) {
      videoLoading.value = false
      videoError.value = true
    }
  }, 10000)
})
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
      <GameIcon name="menu" :size="24" />
    </button>
    
    <!-- 返回首页按钮 -->
      <button 
      v-if="currentPage !== 'home'"
      class="back-home-btn glass-panel"
      @click="emit('navigate', 'home')"
      title="返回首页"
    >
      <GameIcon name="chevronLeft" :size="20" />
      <span class="back-text">返回首页</span>
    </button>

    <!-- 游戏玩法页面 -->
    <GameplayPage v-if="currentPage === 'gameplay'" />
    
    <!-- 职业介绍页面 -->
    <ProfessionsPage 
      v-else-if="currentPage === 'professions'" 
      @select-profession="emit('select-profession', $event)"
    />
    
    <!-- 地图指南页面 -->
    <MapGuidePage v-else-if="currentPage === 'map'" />
    
    <!-- 进阶技巧页面 -->
    <AdvancedTipsPage v-else-if="currentPage === 'tips'" />
    
    <!-- 更新日志索引页面 -->
    <ChangelogIndexPage 
      v-else-if="currentPage === 'changelog' && !changelogVersion"
      @navigate-to-version="(version) => emit('navigate', 'changelog', version)"
    />
    
    <!-- 更新日志详情页面 -->
    <ChangelogDetailPage 
      v-else-if="currentPage === 'changelog' && changelogVersion"
      :version="changelogVersion"
      @back-to-index="emit('navigate', 'changelog')"
      @navigate-to-version="(version) => emit('navigate', 'changelog', version)"
    />
    
    <!-- 注册页面 -->
    <RegisterPage 
      v-else-if="currentPage === 'register'"
      @register-success="(data) => emit('navigate', 'login')"
      @go-login="emit('navigate', 'login')"
    />
    
    <!-- 忘记密码页面 -->
    <ForgotPasswordPage
      v-else-if="currentPage === 'forgot-password'"
      @reset-success="emit('navigate', 'login')"
      @go-login="emit('navigate', 'login')"
    />
    
    <!-- 职业详情页面 -->
    <article v-else-if="currentPage === 'profession-detail' && profession" class="profession-detail">
      <button 
        class="back-professions-btn glass-panel"
        @click="emit('navigate', 'professions')"
        title="返回职业列表"
      >
        <GameIcon name="chevronLeft" :size="20" />
        <span class="back-text">返回职业列表</span>
      </button>
      
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
            <GameIcon name="book" :size="24" color="var(--accent-color)" />
            职业介绍
          </h2>
          <p class="description">{{ profession.description }}</p>
        </section>

        <section class="detail-section glass-panel">
          <h2 class="detail-title">
            <GameIcon name="star" :size="24" color="var(--accent-color)" />
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
    
    <!-- 欢迎页面 -->
    <div v-else class="welcome-page">
      <!-- 头部横幅 -->
      <div class="hero-banner">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">星琼铁道版 Wiki</div>
          <h1 class="hero-title">哈比列车</h1>
          <p class="hero-subtitle">在这趟神秘的列车上，每个人都有自己的秘密...</p>
          <div class="hero-actions">
            <button class="btn-primary" @click="emit('navigate', 'professions')">开始探索</button>
            <button class="btn-secondary" @click="emit('navigate', 'changelog')">查看更新日志</button>
          </div>
        </div>
      </div>

      <div class="content-container">
        <!-- 数据统计 -->
        <section class="stats-section">
          <div class="stat-card glass-panel card-hover animate-fade-in-up animate-delay-100">
            <div class="stat-icon-wrapper" style="background: rgba(255, 92, 141, 0.1); color: #ff5c8d;">
              <GameIcon name="users" :size="32" />
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.professions }}</span>
              <span class="stat-label">职业总数</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover animate-fade-in-up animate-delay-200">
            <div class="stat-icon-wrapper" style="background: rgba(66, 165, 245, 0.1); color: #42a5f5;">
              <GameIcon name="shield" :size="32" />
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.factions }}</span>
              <span class="stat-label">阵营分类</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover animate-fade-in-up animate-delay-300">
            <div class="stat-icon-wrapper" style="background: rgba(255, 167, 38, 0.1); color: #ffa726;">
              <GameIcon name="star" :size="32" />
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.skills }}+</span>
              <span class="stat-label">特殊技能</span>
            </div>
          </div>
          <div class="stat-card glass-panel card-hover animate-fade-in-up animate-delay-400">
            <div class="stat-icon-wrapper" style="background: rgba(102, 187, 106, 0.1); color: #66bb6a;">
              <GameIcon name="train" :size="32" />
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.carriages }}</span>
              <span class="stat-label">列车车厢</span>
            </div>
          </div>
        </section>

        <!-- 宣传视频 -->
        <section class="video-section animate-fade-in-up animate-delay-300">
          <h2 class="section-title">
            <GameIcon name="video" :size="24" color="var(--accent-color)" />
            游戏实况
          </h2>
          <div class="video-card glass-panel card-hover">
            <div class="video-header">
              <h3 class="video-title">7位经典台湾Youtuber - 全新狼人杀回归！</h3>
              <p class="video-description">45种职业的沉浸式谋杀案，体验最刺激的社交推理游戏</p>
            </div>
            <div class="video-wrapper">
              <!-- 加载状态 -->
              <div v-if="videoLoading" class="video-loading">
                <div class="loading-spinner-video">
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                </div>
                <p class="loading-text">加载视频中...</p>
              </div>
              
              <!-- 错误状态 -->
              <div v-if="videoError" class="video-error">
                <div class="error-icon">📺</div>
                <p class="error-title">视频加载失败</p>
                <p class="error-desc">请点击下方链接前往 Bilibili 观看</p>
              </div>
              
              <!-- 视频播放器 -->
              <iframe 
                v-show="!videoLoading && !videoError"
                src="https://player.bilibili.com/player.html?bvid=BV1xNivBYE2P&page=1&high_quality=1&danmaku=0&autoplay=0" 
                scrolling="no" 
                border="0" 
                frameborder="no" 
                framespacing="0" 
                allowfullscreen="true"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                class="bilibili-video"
                @load="handleVideoLoad"
                @error="handleVideoError"
              ></iframe>
            </div>
            <div class="video-footer">
              <a 
                href="https://www.bilibili.com/video/BV1xNivBYE2P/?share_source=copy_web&vd_source=0db9d643f66b109173a1c8886d56b96b" 
                target="_blank" 
                rel="noopener noreferrer"
                class="video-link"
              >
                <GameIcon name="externalLink" :size="18" />
                <span>在 Bilibili 观看完整版</span>
                <GameIcon name="chevronRight" :size="18" class="link-arrow" />
              </a>
            </div>
          </div>
        </section>

        <div class="content-grid">
          <!-- 左侧主要内容 -->
          <div class="main-column">
            <!-- 游戏简介 -->
            <section class="content-section animate-fade-in-up">
              <h2 class="section-title">
                <GameIcon name="book" :size="22" color="var(--accent-color)" />
                游戏简介
              </h2>
              <div class="intro-card glass-panel card-hover">
                <p>《哈比列车》是一款多人社交推理游戏，玩家将在一列神秘的火车上扮演不同的职业角色。</p>
                <p>每个职业都有独特的技能和胜利条件，玩家需要通过观察、推理和交流来达成目标。</p>
                <p>游戏融合了狼人杀、太空狼人杀等经典社交推理元素，加入了独特的SAN值系统和列车场景互动。</p>
              </div>
            </section>

            <!-- 阵营介绍 -->
            <section class="content-section animate-fade-in-up animate-delay-200">
              <h2 class="section-title">
                <GameIcon name="shield" :size="22" color="var(--accent-color)" />
                阵营介绍
              </h2>
              <div class="factions-grid">
                <div class="faction-card good glass-panel card-hover">
                  <div class="faction-header">
                    <GameIcon name="heart" :size="28" class="faction-icon" />
                    <h3>好人阵营</h3>
                  </div>
                  <p>维护列车秩序，找出并消灭所有威胁。包括平民、义警等职业。</p>
                  <div class="faction-glow"></div>
                </div>
                <div class="faction-card evil glass-panel card-hover">
                  <div class="faction-header">
                    <GameIcon name="skull" :size="28" class="faction-icon" />
                    <h3>坏人阵营</h3>
                  </div>
                  <p>隐藏身份，暗中破坏，消灭所有好人。包括杀手等职业。</p>
                  <div class="faction-glow"></div>
                </div>
                <div class="faction-card neutral glass-panel card-hover">
                  <div class="faction-header">
                    <GameIcon name="cube" :size="28" class="faction-icon" />
                    <h3>中立阵营</h3>
                  </div>
                  <p>有自己独特的胜利条件，可能与任何阵营合作或对抗。</p>
                  <div class="faction-glow"></div>
                </div>
              </div>
            </section>
          </div>

          <!-- 右侧侧边栏 -->
          <div class="side-column">
            <!-- 快速导航 -->
            <section class="content-section">
              <h2 class="section-title">
                <GameIcon name="collection" :size="22" color="var(--accent-color)" />
                快速导航
              </h2>
              <div class="quick-nav-list">
                <div 
                  v-for="(link, index) in quickLinks" 
                  :key="index" 
                  class="nav-item glass-panel card-hover"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                  @click="emit('navigate', link.id)"
                >
                  <div class="nav-icon" :style="{ color: link.color }">
                    <GameIcon :name="link.icon" :size="24" />
                  </div>
                  <div class="nav-info">
                    <h3>{{ link.title }}</h3>
                    <p>{{ link.desc }}</p>
                  </div>
                  <GameIcon name="chevronRight" :size="20" class="nav-arrow" />
                  <div class="nav-hover-bg"></div>
                </div>
              </div>
            </section>

            <!-- 新手提示 -->
            <section class="content-section">
              <h2 class="section-title">
                <GameIcon name="lightbulb" :size="22" color="var(--accent-color)" />
                新手提示
              </h2>
              <div class="tips-list glass-panel">
                <div 
                  v-for="(tip, index) in beginnerTips" 
                  :key="index" 
                  class="tip-item card-hover"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
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
  </main>
</template>

<style scoped>
.wiki-content {
  margin-left: 280px;
  min-height: 100vh;
  background: transparent;
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
.expand-sidebar-btn,
.back-home-btn {
  position: fixed;
  top: 24px;
  left: 92px;
  min-width: 44px;
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
  gap: 8px;
  padding: 0 16px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.back-home-btn {
  left: auto;
  right: 24px;
}

.expand-sidebar-btn::before,
.back-home-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 92, 141, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.expand-sidebar-btn:hover::before,
.back-home-btn:hover::before {
  width: 100px;
  height: 100px;
}

.expand-sidebar-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.back-home-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: translateX(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.back-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.back-home-btn:hover .back-icon {
  transform: translateX(-4px);
}

.back-text {
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .back-home-btn {
    right: 20px;
    padding: 0 12px;
  }
  
  .back-text {
    display: none;
  }
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
  animation: fadeIn 0.8s ease-out;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 92, 141, 0.1) 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, rgba(66, 165, 245, 0.08) 0%, transparent 40%);
  animation: float 6s ease-in-out infinite;
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
  background: linear-gradient(135deg, var(--text-primary), var(--accent-color), var(--text-secondary));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  position: relative;
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
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent-hover), var(--accent-color));
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.5);
}

.btn-primary:active {
  transform: translateY(-1px) scale(1.02);
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.btn-secondary:hover::before {
  left: 100%;
}

.btn-secondary:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.btn-secondary:active {
  transform: translateY(-1px) scale(1.02);
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

/* 视频区域 */
.video-section {
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.video-section.animate-fade-in-up {
  opacity: 1;
  transform: translateY(0);
}

.video-card {
  padding: 32px;
  border-radius: 24px;
  overflow: hidden;
}

.video-header {
  margin-bottom: 24px;
  text-align: center;
}

.video-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.video-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  height: 0;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s, box-shadow 0.3s;
}

.video-card:hover .video-wrapper {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.bilibili-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
}

/* 视频加载状态 */
.video-loading,
.video-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 16px;
}

.loading-spinner-video {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
  border-top-color: var(--accent-color);
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: var(--good-color);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: var(--neutral-color);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.video-error {
  gap: 12px;
}

.error-icon {
  font-size: 4rem;
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.error-title {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 700;
}

.error-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  max-width: 80%;
}

.video-footer {
  margin-top: 24px;
  text-align: center;
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.video-link:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 92, 141, 0.3);
}

.link-icon {
  font-size: 1.1rem;
}

.link-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.video-link:hover .link-arrow {
  transform: translateX(5px);
}

.stat-card {
  padding: 28px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.6s;
}

.stat-card:hover::before {
  left: 100%;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.15) rotate(5deg);
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
  transition: color 0.3s;
  display: inline-block;
}

.stat-card:hover .stat-number {
  color: var(--accent-color);
  transform: scale(1.1);
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

.content-section {
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.content-section.animate-fade-in-up {
  opacity: 1;
  transform: translateY(0);
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.section-title:hover .title-icon {
  transform: scale(1.2) rotate(10deg);
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
  position: relative;
  overflow: hidden;
}

.faction-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.faction-card:hover .faction-glow {
  opacity: 1;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.faction-card:hover .faction-icon {
  transform: scale(1.2) rotate(10deg);
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
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.nav-hover-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 92, 141, 0.1), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.nav-item:hover .nav-hover-bg {
  left: 100%;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s;
  position: relative;
  z-index: 1;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15) rotate(5deg);
  background: var(--accent-color);
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(5px);
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
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
  transition: all 0.3s;
  border-radius: 8px;
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
}

.tip-item:hover {
  background: var(--hover-bg);
  transform: translateX(8px);
  border-color: var(--accent-color);
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-number {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(255, 92, 141, 0.3);
}

.tip-item:hover .tip-number {
  transform: scale(1.2) rotate(360deg);
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.5);
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
  position: relative;
}

.back-professions-btn {
  position: absolute;
  top: 0;
  left: 40px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: var(--glass-bg);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.back-professions-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: translateX(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.4);
}

.back-professions-btn .back-icon {
  font-size: 1rem;
  transition: transform 0.3s;
}

.back-professions-btn:hover .back-icon {
  transform: translateX(-4px);
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
    top: 20px;
  }

  .content-container {
    padding: 0 20px;
  }

  .hero-banner {
    padding: 60px 20px;
    margin-bottom: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    margin-top: 0;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .video-card {
    padding: 24px 20px;
  }
  
  .video-title {
    font-size: 1.2rem;
  }
  
  .video-description {
    font-size: 0.9rem;
  }
  
  .video-link {
    width: 100%;
    justify-content: center;
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
  
  .back-professions-btn {
    position: relative;
    left: 0;
    top: 0;
    margin-bottom: 20px;
    width: 100%;
    justify-content: center;
  }
  
  .back-professions-btn .back-text {
    display: inline;
  }

  .detail-hero {
    padding: 24px;
  }

  .features-list {
    grid-template-columns: 1fr;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
  
  .factions-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-item {
    padding: 16px;
  }
  
  .tip-item {
    padding: 14px 0;
  }
}
</style>
