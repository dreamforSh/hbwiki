<script setup>
import { ref, computed } from 'vue'

defineProps({
  sidebarCollapsed: Boolean
})

defineEmits(['toggle-sidebar'])

const factions = [
  {
    id: 'good',
    name: '好人阵营',
    nameEn: 'Good Faction',
    icon: '😇',
    color: '#4caf50',
    bgGradient: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
    description: '好人阵营代表正义与秩序，他们的目标是找出并淘汰所有坏人阵营成员，维护列车的和平与安全。',
    victory: '淘汰所有坏人阵营成员',
    features: [
      '人数优势：通常占玩家总数的50%以上',
      '信息收集：部分职业拥有查验身份的能力',
      '团队协作：需要通过投票和讨论找出坏人',
      '防御机制：医生等职业可以保护队友'
    ],
    representatives: [
      { name: '平民', icon: '👤', desc: '基础职业，无特殊能力但人数众多' },
      { name: '警长', icon: '👮', desc: '可以查验玩家身份' },
      { name: '医生', icon: '⚕️', desc: '可以保护玩家免受伤害' },
      { name: '猎人', icon: '🎯', desc: '死亡时可以带走一名玩家' }
    ]
  },
  {
    id: 'evil',
    name: '坏人阵营',
    nameEn: 'Evil Faction',
    icon: '😈',
    color: '#f44336',
    bgGradient: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
    description: '坏人阵营潜伏在好人之中，通过隐蔽的行动和伪装来消灭好人阵营，最终夺取列车的控制权。',
    victory: '好人阵营数量少于或等于坏人阵营',
    features: [
      '夜间行动：可以在夜晚秘密淘汰好人',
      '相互认识：坏人之间知道彼此身份',
      '伪装能力：需要在白天伪装成好人',
      '战术配合：通过协作误导好人阵营'
    ],
    representatives: [
      { name: '狼人', icon: '🐺', desc: '基础坏人，夜晚可以击杀玩家' },
      { name: '女巫', icon: '🧙‍♀️', desc: '拥有毒药和解药' },
      { name: '恶魔', icon: '👹', desc: '特殊杀人能力' },
      { name: '刺客', icon: '🗡️', desc: '可以指定击杀目标' }
    ]
  },
  {
    id: 'neutral',
    name: '中立阵营',
    nameEn: 'Neutral Faction',
    icon: '🎭',
    color: '#ff9800',
    bgGradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    description: '中立阵营不属于好人或坏人，他们有自己独特的胜利条件，需要根据局势灵活选择站队。',
    victory: '达成各自职业的特殊胜利条件',
    features: [
      '独立目标：拥有独特的胜利条件',
      '灵活站队：可以根据局势选择帮助某一方',
      '特殊能力：通常拥有强大的特殊技能',
      '生存优先：主要目标是存活到游戏结束'
    ],
    representatives: [
      { name: '丘比特', icon: '💘', desc: '可以连接两名玩家成为情侣' },
      { name: '守墓人', icon: '⚰️', desc: '可以知道死者的身份' },
      { name: '小丑', icon: '🤡', desc: '被投票出局即获胜' },
      { name: '狐狸', icon: '🦊', desc: '独自存活到最后即获胜' }
    ]
  }
]

const selectedFaction = ref(null)
const expandedRepresentatives = ref({})

const toggleRepresentatives = (factionId) => {
  expandedRepresentatives.value[factionId] = !expandedRepresentatives.value[factionId]
}
</script>

<template>
  <div class="faction-page wood-texture">
    <!-- 齿轮背景装饰 -->
    <div class="gear-background gear-bg-1">⚙️</div>
    <div class="gear-background gear-bg-2">⚙️</div>
    <div class="gear-background gear-bg-3">⚙️</div>

    <!-- 蒸汽粒子效果 -->
    <div class="steam-particle steam-1"></div>
    <div class="steam-particle steam-2"></div>
    <div class="steam-particle steam-3"></div>

    <!-- 页面头部 -->
    <div class="page-header wood-panel rivets scroll-fade-in">
      <div class="copper-corners"></div>
      <h1 class="page-title text-glow">⚔️ 阵营介绍</h1>
      <p class="page-subtitle">了解三大阵营的特点与胜利条件</p>
    </div>

    <!-- 阵营卡片网格 -->
    <div class="factions-grid">
      <div 
        v-for="faction in factions" 
        :key="faction.id"
        class="faction-card wood-panel metal-border card-3d scroll-fade-in"
        :style="{ '--faction-color': faction.color }"
      >
        <div class="copper-corners"></div>
        
        <!-- 卡片头部 -->
        <div class="faction-header" :style="{ background: faction.bgGradient }">
          <div class="faction-icon">{{ faction.icon }}</div>
          <div class="faction-title-group">
            <h2 class="faction-name">{{ faction.name }}</h2>
            <span class="faction-name-en">{{ faction.nameEn }}</span>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="faction-body">
          <p class="faction-description">{{ faction.description }}</p>

          <div class="faction-victory">
            <div class="victory-label">
              <span class="label-icon">🏆</span>
              <span class="label-text">胜利条件</span>
            </div>
            <p class="victory-text">{{ faction.victory }}</p>
          </div>

          <div class="faction-features">
            <div class="features-label">
              <span class="label-icon">✨</span>
              <span class="label-text">阵营特色</span>
            </div>
            <ul class="features-list">
              <li v-for="(feature, index) in faction.features" :key="index" class="feature-item">
                <span class="feature-bullet">▸</span>
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="faction-representatives">
            <button 
              class="representatives-toggle btn-steampunk"
              @click="toggleRepresentatives(faction.id)"
            >
              <span class="label-icon">👥</span>
              <span class="label-text">代表职业</span>
              <span class="toggle-arrow" :class="{ expanded: expandedRepresentatives[faction.id] }">
                ▼
              </span>
            </button>

            <transition name="expand">
              <div v-if="expandedRepresentatives[faction.id]" class="representatives-list">
                <div 
                  v-for="rep in faction.representatives" 
                  :key="rep.name"
                  class="representative-item"
                >
                  <span class="rep-icon">{{ rep.icon }}</span>
                  <div class="rep-info">
                    <h4 class="rep-name">{{ rep.name }}</h4>
                    <p class="rep-desc">{{ rep.desc }}</p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- 阵营对比表格 -->
    <div class="comparison-section wood-panel metal-border scroll-fade-in">
      <div class="copper-corners"></div>
      <h2 class="section-title text-glow">📊 阵营对比</h2>
      
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>对比项</th>
              <th class="good-col">好人阵营</th>
              <th class="evil-col">坏人阵营</th>
              <th class="neutral-col">中立阵营</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label-col">人数比例</td>
              <td>50-60%</td>
              <td>30-40%</td>
              <td>0-20%</td>
            </tr>
            <tr>
              <td class="label-col">行动时间</td>
              <td>白天讨论投票</td>
              <td>夜晚秘密行动</td>
              <td>取决于职业</td>
            </tr>
            <tr>
              <td class="label-col">信息优势</td>
              <td>部分职业可查验</td>
              <td>相互认识</td>
              <td>特殊视角</td>
            </tr>
            <tr>
              <td class="label-col">获胜难度</td>
              <td>中等</td>
              <td>较高</td>
              <td>高</td>
            </tr>
            <tr>
              <td class="label-col">策略重点</td>
              <td>逻辑推理</td>
              <td>伪装欺骗</td>
              <td>灵活应变</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 阵营策略提示 -->
    <div class="strategy-section wood-panel metal-border scroll-fade-in">
      <div class="copper-corners"></div>
      <h2 class="section-title text-glow">💡 策略提示</h2>
      
      <div class="strategy-grid">
        <div class="strategy-card good-strategy">
          <h3 class="strategy-title">
            <span class="strategy-icon">😇</span>
            好人阵营策略
          </h3>
          <ul class="strategy-list">
            <li>仔细观察发言，寻找逻辑破绽</li>
            <li>重要职业隐藏身份，避免被针对</li>
            <li>合理利用投票权，形成多数优势</li>
            <li>警惕跳反水和假装受害者的行为</li>
          </ul>
        </div>

        <div class="strategy-card evil-strategy">
          <h3 class="strategy-title">
            <span class="strategy-icon">😈</span>
            坏人阵营策略
          </h3>
          <ul class="strategy-list">
            <li>伪装成好人，制造信任</li>
            <li>夜晚优先击杀关键职业</li>
            <li>误导投票方向，栽赃嫁祸</li>
            <li>坏人之间配合演戏，扰乱视线</li>
          </ul>
        </div>

        <div class="strategy-card neutral-strategy">
          <h3 class="strategy-title">
            <span class="strategy-icon">🎭</span>
            中立阵营策略
          </h3>
          <ul class="strategy-list">
            <li>优先确保自己的生存</li>
            <li>根据局势选择合适的站队</li>
            <li>利用特殊能力影响游戏走向</li>
            <li>避免过早暴露真实身份</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faction-page {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* 页面头部 */
.page-header {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  position: relative;
  border: 3px solid var(--copper);
}

.page-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--wood-light);
  opacity: 0.9;
}

/* 阵营卡片网格 */
.factions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.faction-card {
  position: relative;
  border: 2px solid var(--copper);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.faction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 卡片头部 */
.faction-header {
  padding: 2rem;
  text-align: center;
  color: white;
  position: relative;
}

.faction-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.faction-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faction-name {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.faction-name-en {
  font-size: 1rem;
  opacity: 0.9;
  font-style: italic;
}

/* 卡片内容 */
.faction-body {
  padding: 2rem;
}

.faction-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--wood-lighter);
}

.faction-victory,
.faction-features {
  margin-bottom: 1.5rem;
}

.victory-label,
.features-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--amber);
}

.label-icon {
  font-size: 1.5rem;
}

.victory-text {
  padding: 1rem;
  background: rgba(184, 115, 51, 0.1);
  border-left: 3px solid var(--copper);
  margin: 0;
  color: var(--wood-lighter);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(61, 40, 23, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--wood-lighter);
}

.feature-bullet {
  color: var(--copper);
  font-weight: bold;
}

/* 代表职业 */
.faction-representatives {
  margin-top: 1.5rem;
}

.representatives-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
}

.toggle-arrow {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.toggle-arrow.expanded {
  transform: rotate(180deg);
}

.representatives-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.representative-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(61, 40, 23, 0.3);
  border-radius: 4px;
  border-left: 3px solid var(--copper);
}

.rep-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.rep-info {
  flex: 1;
}

.rep-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--amber);
}

.rep-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--wood-light);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 对比表格 */
.comparison-section {
  margin-bottom: 3rem;
  padding: 2rem;
  position: relative;
  border: 2px solid var(--copper);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  font-family: 'Courier New', monospace;
}

.comparison-table-wrapper {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(61, 40, 23, 0.3);
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: center;
  border: 1px solid var(--copper);
}

.comparison-table th {
  background: rgba(184, 115, 51, 0.3);
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--amber);
}

.comparison-table .label-col {
  font-weight: bold;
  color: var(--wood-lighter);
  text-align: left;
}

.good-col {
  color: #4caf50 !important;
}

.evil-col {
  color: #f44336 !important;
}

.neutral-col {
  color: #ff9800 !important;
}

/* 策略提示 */
.strategy-section {
  padding: 2rem;
  position: relative;
  border: 2px solid var(--copper);
}

.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.strategy-card {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
}

.good-strategy {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
}

.evil-strategy {
  background: rgba(244, 67, 54, 0.1);
  border-color: #f44336;
}

.neutral-strategy {
  background: rgba(255, 152, 0, 0.1);
  border-color: #ff9800;
}

.strategy-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--amber);
}

.strategy-icon {
  font-size: 2rem;
}

.strategy-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.strategy-list li {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(61, 40, 23, 0.3);
  border-radius: 4px;
  border-left: 3px solid currentColor;
  color: var(--wood-lighter);
}

.good-strategy .strategy-list li {
  border-left-color: #4caf50;
}

.evil-strategy .strategy-list li {
  border-left-color: #f44336;
}

.neutral-strategy .strategy-list li {
  border-left-color: #ff9800;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .faction-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .factions-grid {
    grid-template-columns: 1fr;
  }

  .strategy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
