<script setup>
const tips = [
  {
    category: '观察技巧',
    icon: '👁️',
    items: [
      {
        title: '观察玩家行为模式',
        description: '注意玩家在不同情况下的反应，异常行为往往暴露身份',
        level: '初级'
      },
      {
        title: '记录关键时间点',
        description: '记录重要事件发生的时间，有助于分析玩家位置和行动',
        level: '中级'
      },
      {
        title: '分析投票模式',
        description: '观察投票时的选择，可以推断玩家之间的关系和阵营',
        level: '高级'
      }
    ]
  },
  {
    category: '沟通策略',
    icon: '💬',
    items: [
      {
        title: '建立信任关系',
        description: '通过分享真实信息建立信任，但要小心被利用',
        level: '初级'
      },
      {
        title: '信息交换技巧',
        description: '学会在保护自己的同时获取有用信息',
        level: '中级'
      },
      {
        title: '心理战术',
        description: '利用心理压力让对手露出破绽',
        level: '高级'
      }
    ]
  },
  {
    category: '策略规划',
    icon: '🎯',
    items: [
      {
        title: '制定行动计划',
        description: '根据职业特点制定清晰的行动路线',
        level: '初级'
      },
      {
        title: '灵活应变',
        description: '根据游戏进程及时调整策略',
        level: '中级'
      },
      {
        title: '长期布局',
        description: '提前规划多步行动，建立优势',
        level: '高级'
      }
    ]
  },
  {
    category: '职业技巧',
    icon: '⚔️',
    items: [
      {
        title: '技能时机把握',
        description: '在关键时刻使用技能，最大化效果',
        level: '中级'
      },
      {
        title: '技能组合使用',
        description: '学会组合使用多个技能，产生协同效果',
        level: '高级'
      },
      {
        title: '职业克制关系',
        description: '了解不同职业之间的克制关系，制定针对性策略',
        level: '高级'
      }
    ]
  }
]

const getLevelColor = (level) => {
  switch(level) {
    case '初级':
      return 'var(--good-color)'
    case '中级':
      return 'var(--neutral-color)'
    case '高级':
      return 'var(--evil-color)'
    default:
      return 'var(--text-tertiary)'
  }
}
</script>

<template>
  <div class="advanced-tips-page">
    <div class="page-header">
      <div class="page-icon">💡</div>
      <h1 class="page-title">进阶技巧</h1>
      <p class="page-subtitle">学习高级玩家的实战技巧和策略</p>
    </div>

    <div class="content-container">
      <div 
        v-for="(category, categoryIndex) in tips" 
        :key="categoryIndex"
        class="content-section animate-fade-in-up"
        :style="{ animationDelay: `${categoryIndex * 0.1}s` }"
      >
        <h2 class="section-title">
          <span class="title-icon">{{ category.icon }}</span>
          {{ category.category }}
        </h2>
        <div class="tips-list">
          <div 
            v-for="(tip, tipIndex) in category.items" 
            :key="tipIndex"
            class="tip-card glass-panel card-hover"
            :style="{ animationDelay: `${(categoryIndex * 0.1) + (tipIndex * 0.05)}s` }"
          >
            <div class="tip-header">
              <h3 class="tip-title">{{ tip.title }}</h3>
              <span 
                class="tip-level"
                :style="{ color: getLevelColor(tip.level), borderColor: getLevelColor(tip.level) }"
              >
                {{ tip.level }}
              </span>
            </div>
            <p class="tip-description">{{ tip.description }}</p>
            <div class="tip-footer">
              <div class="tip-difficulty">
                <span class="difficulty-label">难度：</span>
                <div class="difficulty-stars">
                  <span 
                    v-for="n in (tip.level === '初级' ? 1 : tip.level === '中级' ? 2 : 3)" 
                    :key="n"
                    class="star"
                  >⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合建议 -->
      <section class="content-section animate-fade-in-up animate-delay-300">
        <h2 class="section-title">
          <span class="title-icon">🎓</span>
          综合建议
        </h2>
        <div class="advice-grid glass-panel">
          <div class="advice-card">
            <div class="advice-icon">🎯</div>
            <h3>保持冷静</h3>
            <p>在紧张的情况下保持冷静，理性分析局势</p>
          </div>
          <div class="advice-card">
            <div class="advice-icon">🤝</div>
            <h3>团队合作</h3>
            <p>与队友建立良好的沟通和信任关系</p>
          </div>
          <div class="advice-card">
            <div class="advice-icon">📚</div>
            <h3>持续学习</h3>
            <p>每局游戏后总结经验，不断改进策略</p>
          </div>
          <div class="advice-card">
            <div class="advice-icon">🎮</div>
            <h3>享受游戏</h3>
            <p>最重要的是享受游戏过程，不要过于紧张</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.advanced-tips-page {
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

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.tip-card {
  padding: 24px;
  border-radius: 20px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;
}

.tip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.tip-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.tip-level {
  padding: 4px 12px;
  border: 1px solid;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.tip-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.tip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.tip-difficulty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.difficulty-label {
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.difficulty-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 0.9rem;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 32px;
  border-radius: 24px;
}

.advice-card {
  text-align: center;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 16px;
  transition: transform 0.3s;
}

.advice-card:hover {
  transform: translateY(-4px);
}

.advice-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.advice-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.advice-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
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

  .tips-list {
    grid-template-columns: 1fr;
  }

  .advice-grid {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>
