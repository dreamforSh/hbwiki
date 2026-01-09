<script setup>
import { ref } from 'vue'

const gameRules = [
  {
    title: '基本规则',
    icon: '📋',
    items: [
      '玩家将在一列神秘的火车上扮演不同的职业角色',
      '每个职业都有独特的技能和胜利条件',
      '游戏分为多个阵营：好人、坏人、中立',
      '通过观察、推理和交流来达成目标'
    ]
  },
  {
    title: 'SAN值系统',
    icon: '🧠',
    items: [
      '每个玩家都有SAN值（理智值）',
      'SAN值过低会导致精神崩溃',
      '可以通过完成任务恢复SAN值',
      '不同职业的SAN值上限不同'
    ]
  },
  {
    title: '任务系统',
    icon: '✅',
    items: [
      '好人阵营需要完成任务来推进游戏',
      '完成任务可以获得奖励和恢复SAN值',
      '任务类型多样，包括解谜、收集等',
      '坏人阵营可以伪装完成任务'
    ]
  },
  {
    title: '投票系统',
    icon: '🗳️',
    items: [
      '玩家可以发起投票讨论',
      '投票可以淘汰可疑的玩家',
      '需要谨慎投票，避免误伤队友',
      '投票结果会影响游戏进程'
    ]
  }
]

const gamePhases = [
  {
    phase: '准备阶段',
    description: '玩家选择职业，了解自己的技能和胜利条件',
    duration: '2-3分钟'
  },
  {
    phase: '游戏阶段',
    description: '玩家在列车上自由行动，完成任务、观察其他玩家',
    duration: '15-30分钟'
  },
  {
    phase: '讨论阶段',
    description: '玩家可以发起讨论，分享信息，进行推理',
    duration: '5-10分钟'
  },
  {
    phase: '投票阶段',
    description: '玩家投票决定是否淘汰某个玩家',
    duration: '1-2分钟'
  },
  {
    phase: '结算阶段',
    description: '根据投票结果和游戏进程，判断各阵营是否达成胜利条件',
    duration: '即时'
  }
]
</script>

<template>
  <div class="gameplay-page">
    <div class="page-header">
      <div class="page-icon">🎮</div>
      <h1 class="page-title">游戏玩法</h1>
      <p class="page-subtitle">了解哈比列车的基本规则和玩法机制</p>
    </div>

    <div class="content-container">
      <!-- 游戏规则 -->
      <section class="content-section animate-fade-in-up">
        <h2 class="section-title">
          <span class="title-icon">📖</span>
          游戏规则
        </h2>
        <div class="rules-grid">
          <div 
            v-for="(rule, index) in gameRules" 
            :key="index"
            class="rule-card glass-panel card-hover"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="rule-header">
              <span class="rule-icon">{{ rule.icon }}</span>
              <h3>{{ rule.title }}</h3>
            </div>
            <ul class="rule-list">
              <li v-for="(item, i) in rule.items" :key="i">
                <span class="rule-dot"></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 游戏流程 -->
      <section class="content-section animate-fade-in-up animate-delay-200">
        <h2 class="section-title">
          <span class="title-icon">⏱️</span>
          游戏流程
        </h2>
        <div class="phases-timeline">
          <div 
            v-for="(phase, index) in gamePhases" 
            :key="index"
            class="phase-item glass-panel card-hover"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="phase-number">{{ index + 1 }}</div>
            <div class="phase-content">
              <h3 class="phase-title">{{ phase.phase }}</h3>
              <p class="phase-description">{{ phase.description }}</p>
              <div class="phase-duration">
                <span class="duration-icon">⏰</span>
                <span>{{ phase.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 胜利条件 -->
      <section class="content-section animate-fade-in-up animate-delay-300">
        <h2 class="section-title">
          <span class="title-icon">🏆</span>
          胜利条件
        </h2>
        <div class="victory-conditions">
          <div class="victory-card good glass-panel card-hover">
            <div class="victory-header">
              <span class="victory-icon">😇</span>
              <h3>好人阵营</h3>
            </div>
            <p>找出并消灭所有坏人，或完成所有任务</p>
          </div>
          <div class="victory-card evil glass-panel card-hover">
            <div class="victory-header">
              <span class="victory-icon">😈</span>
              <h3>坏人阵营</h3>
            </div>
            <p>消灭所有好人，或阻止好人完成任务</p>
          </div>
          <div class="victory-card neutral glass-panel card-hover">
            <div class="victory-header">
              <span class="victory-icon">🎭</span>
              <h3>中立阵营</h3>
            </div>
            <p>达成自己独特的胜利条件（每个职业不同）</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.gameplay-page {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.rule-card {
  padding: 28px;
  border-radius: 24px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.rule-icon {
  font-size: 2rem;
}

.rule-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.rule-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.phases-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-item {
  display: flex;
  gap: 24px;
  padding: 28px;
  border-radius: 24px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  position: relative;
}

.phase-item::before {
  content: '';
  position: absolute;
  left: 40px;
  top: 60px;
  bottom: -20px;
  width: 2px;
  background: var(--border-color);
  z-index: -1;
}

.phase-item:last-child::before {
  display: none;
}

.phase-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.phase-content {
  flex: 1;
}

.phase-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.phase-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.phase-duration {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.duration-icon {
  font-size: 1rem;
}

.victory-conditions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.victory-card {
  padding: 32px;
  border-radius: 24px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.victory-card.good {
  border-top: 4px solid var(--good-color);
}

.victory-card.evil {
  border-top: 4px solid var(--evil-color);
}

.victory-card.neutral {
  border-top: 4px solid var(--neutral-color);
}

.victory-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.victory-icon {
  font-size: 2rem;
}

.victory-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.victory-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1rem;
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

  .rules-grid {
    grid-template-columns: 1fr;
  }

  .phase-item {
    flex-direction: column;
    gap: 16px;
  }

  .phase-item::before {
    display: none;
  }

  .victory-conditions {
    grid-template-columns: 1fr;
  }
}
</style>
