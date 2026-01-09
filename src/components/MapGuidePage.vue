<script setup>
const carriages = [
  {
    id: 1,
    name: '车头',
    icon: '🚂',
    description: '列车的控制室，通常只有特定职业可以进入',
    features: ['控制列车运行', '查看列车状态', '紧急制动装置']
  },
  {
    id: 2,
    name: '一等车厢',
    icon: '🛋️',
    description: '豪华舒适的车厢，适合重要人物休息',
    features: ['高级座椅', '私密空间', '特殊任务点']
  },
  {
    id: 3,
    name: '餐车',
    icon: '🍽️',
    description: '提供食物和饮品的车厢，是玩家聚集的地方',
    features: ['恢复SAN值', '获取道具', '社交互动']
  },
  {
    id: 4,
    name: '卧铺车厢',
    icon: '🛏️',
    description: '供乘客休息的车厢，可以恢复体力',
    features: ['休息恢复', '隐藏地点', '任务触发点']
  },
  {
    id: 5,
    name: '货物车厢',
    icon: '📦',
    description: '存放货物和行李的车厢，可能藏有重要线索',
    features: ['道具搜索', '隐藏通道', '特殊机关']
  },
  {
    id: 6,
    name: '医疗车厢',
    icon: '🏥',
    description: '提供医疗服务的车厢，可以治疗和恢复',
    features: ['恢复生命值', '治疗状态', '医疗道具']
  },
  {
    id: 7,
    name: '娱乐车厢',
    icon: '🎮',
    description: '提供娱乐设施的车厢，可以放松心情',
    features: ['小游戏', '恢复SAN值', '社交活动']
  },
  {
    id: 8,
    name: '车尾',
    icon: '🚃',
    description: '列车的尾部，通常较为隐蔽',
    features: ['紧急出口', '隐藏通道', '特殊任务']
  }
]

const mapTips = [
  '熟悉每个车厢的布局和功能',
  '注意观察其他玩家的移动路线',
  '利用车厢之间的通道快速移动',
  '某些车厢可能有隐藏的机关或通道',
  '不同时间段车厢的可用性可能不同'
]
</script>

<template>
  <div class="map-guide-page">
    <div class="page-header">
      <div class="page-icon">🗺️</div>
      <h1 class="page-title">地图指南</h1>
      <p class="page-subtitle">熟悉列车各车厢的布局和功能</p>
    </div>

    <div class="content-container">
      <!-- 车厢列表 -->
      <section class="content-section animate-fade-in-up">
        <h2 class="section-title">
          <span class="title-icon">🚂</span>
          列车车厢
        </h2>
        <div class="carriages-grid">
          <div 
            v-for="carriage in carriages" 
            :key="carriage.id"
            class="carriage-card glass-panel card-hover"
            :style="{ animationDelay: `${(carriage.id - 1) * 0.1}s` }"
          >
            <div class="carriage-header">
              <div class="carriage-icon-wrapper">
                <span class="carriage-icon">{{ carriage.icon }}</span>
              </div>
              <div class="carriage-number">#{{ carriage.id }}</div>
            </div>
            <h3 class="carriage-name">{{ carriage.name }}</h3>
            <p class="carriage-description">{{ carriage.description }}</p>
            <div class="carriage-features">
              <div 
                v-for="(feature, index) in carriage.features" 
                :key="index"
                class="feature-item"
              >
                <span class="feature-dot"></span>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 地图提示 -->
      <section class="content-section animate-fade-in-up animate-delay-200">
        <h2 class="section-title">
          <span class="title-icon">💡</span>
          地图使用技巧
        </h2>
        <div class="tips-grid glass-panel">
          <div 
            v-for="(tip, index) in mapTips" 
            :key="index"
            class="tip-card card-hover"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="tip-number">{{ index + 1 }}</div>
            <p class="tip-text">{{ tip }}</p>
          </div>
        </div>
      </section>

      <!-- 地图概览 -->
      <section class="content-section animate-fade-in-up animate-delay-300">
        <h2 class="section-title">
          <span class="title-icon">📐</span>
          列车布局概览
        </h2>
        <div class="map-overview glass-panel">
          <div class="train-visualization">
            <div 
              v-for="carriage in carriages" 
              :key="carriage.id"
              class="train-carriage-visual"
            >
              <div class="visual-icon">{{ carriage.icon }}</div>
              <div class="visual-name">{{ carriage.name }}</div>
            </div>
          </div>
          <div class="map-legend">
            <div class="legend-item">
              <span class="legend-dot good"></span>
              <span>安全区域</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot evil"></span>
              <span>危险区域</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot neutral"></span>
              <span>中立区域</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.map-guide-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 60px 40px;
  background: var(--hero-gradient);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 40px;
}

.page-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
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

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.carriages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.carriage-card {
  padding: 28px;
  border-radius: 24px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;
}

.carriage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.carriage-icon-wrapper {
  width: 64px;
  height: 64px;
  background: var(--bg-primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.carriage-card:hover .carriage-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.carriage-icon {
  font-size: 2.5rem;
}

.carriage-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.carriage-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.carriage-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.carriage-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.feature-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  transition: all 0.3s;
}

.tip-card:hover {
  transform: translateX(8px);
  background: var(--hover-bg);
}

.tip-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.tip-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.map-overview {
  padding: 40px;
  border-radius: 24px;
}

.train-visualization {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.train-carriage-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 12px;
  min-width: 100px;
  transition: transform 0.3s;
}

.train-carriage-visual:hover {
  transform: translateY(-4px);
}

.visual-icon {
  font-size: 2rem;
}

.visual-name {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: center;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.good {
  background: var(--good-color);
}

.legend-dot.evil {
  background: var(--evil-color);
}

.legend-dot.neutral {
  background: var(--neutral-color);
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .content-container {
    padding: 0 20px;
  }

  .carriages-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .train-visualization {
    flex-direction: column;
  }

  .map-overview {
    padding: 24px;
  }
}
</style>
