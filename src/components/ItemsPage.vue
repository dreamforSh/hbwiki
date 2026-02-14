<script setup>
import { ref, computed } from 'vue'
import { items, itemCategories } from '../data/items.js'

const selectedCategory = ref('all')
const searchQuery = ref('')

const filteredItems = computed(() => {
  let result = items

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  return result
})

const getCategoryInfo = (categoryId) => {
  return itemCategories.find(cat => cat.id === categoryId) || {}
}
</script>

<template>
  <div class="items-page wood-texture">
    <!-- 齿轮背景装饰 -->
    <div class="gear-background gear-bg-1">⚙️</div>
    <div class="gear-background gear-bg-2">⚙️</div>
    <div class="gear-background gear-bg-3">⚙️</div>

    <!-- 页面头部 -->
    <div class="page-header wood-panel rivets">
      <div class="page-icon gear-decoration large">🎒</div>
      <h1 class="page-title text-glow">道具系统</h1>
      <p class="page-subtitle">探索星穹列车上的各类道具与装备</p>
      
      <!-- 蒸汽粒子 -->
      <div class="steam-particle" style="left: 10%"></div>
      <div class="steam-particle" style="left: 30%"></div>
      <div class="steam-particle" style="left: 50%"></div>
    </div>

    <div class="content-container">
      <!-- 筛选和搜索 -->
      <section class="filter-section scroll-fade-in">
        <div class="search-box wood-panel metal-border">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索道具名称或描述..."
            class="search-input"
          />
        </div>
        
        <div class="category-filters">
          <button 
            :class="['category-btn btn-steampunk', { active: selectedCategory === 'all' }]"
            @click="selectedCategory = 'all'"
          >
            <span class="btn-icon">📦</span>
            全部道具
          </button>
          <button 
            v-for="category in itemCategories"
            :key="category.id"
            :class="['category-btn btn-steampunk', { active: selectedCategory === category.id }]"
            @click="selectedCategory = category.id"
          >
            <span class="btn-icon">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>
      </section>

      <!-- 道具列表 -->
      <section class="items-section">
        <div class="items-header scroll-fade-in">
          <h2 class="section-title gear-decoration">
            <span class="title-icon">📚</span>
            道具列表
            <span class="items-count">({{ filteredItems.length }})</span>
          </h2>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredItems.length === 0" class="empty-state wood-panel">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">未找到匹配的道具</p>
          <button class="btn-steampunk" @click="searchQuery = ''; selectedCategory = 'all'">
            清除筛选
          </button>
        </div>

        <!-- 道具卡片网格 -->
        <div v-else class="items-grid">
          <div 
            v-for="(item, index) in filteredItems" 
            :key="item.id"
            :class="['item-card wood-panel metal-border card-3d scroll-fade-in copper-corners']"
            :style="{ animationDelay: `${(index % 12) * 0.05}s` }"
          >
            <!-- 道具图标 -->
            <div class="item-icon-wrapper glow-copper">
              <span class="item-icon">{{ item.icon }}</span>
              <div class="icon-glow"></div>
            </div>

            <!-- 道具信息 -->
            <div class="item-info">
              <div class="item-header">
                <h3 class="item-name">{{ item.name }}</h3>
                <span 
                  class="item-category-badge"
                  :style="{ 
                    background: getCategoryInfo(item.category).color,
                    boxShadow: `0 0 10px ${getCategoryInfo(item.category).color}40`
                  }"
                >
                  {{ getCategoryInfo(item.category).icon }} {{ getCategoryInfo(item.category).name }}
                </span>
              </div>
              
              <p class="item-name-en">{{ item.nameEn }}</p>
              
              <div class="item-description">
                {{ item.description }}
              </div>

              <!-- 道具属性标签 -->
              <div class="item-attributes">
                <span class="attribute-tag" :class="item.visibility === '可见' ? 'visible' : 'hidden'">
                  {{ item.visibility === '可见' ? '👁️ 可见' : '🔒 不可见' }}
                </span>
              </div>

              <!-- 提示信息 -->
              <div v-if="item.tips && item.tips.length" class="item-tips">
                <div class="tip-label">
                  <span class="tip-icon">💡</span>
                  使用提示
                </div>
                <ul class="tips-list">
                  <li v-for="(tip, i) in item.tips" :key="i" class="tip-item">
                    <span class="tip-dot"></span>
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 装饰齿轮 -->
            <div class="card-gear">⚙️</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.items-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
  position: relative;
  overflow-x: hidden;
}

.page-header {
  text-align: center;
  padding: 60px 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(92, 61, 46, 0.95) 0%, 
    rgba(139, 111, 71, 0.90) 100%
  );
}

.page-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--steam-white);
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--brass);
  font-weight: 600;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.filter-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: rgba(92, 61, 46, 0.6);
}

.search-icon {
  font-size: 1.2rem;
  color: var(--brass);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--steam-white);
  font-size: 1rem;
  outline: none;
  font-family: 'Courier New', monospace;
}

.search-input::placeholder {
  color: var(--brass);
  opacity: 0.6;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  transition: all 0.3s;
  position: relative;
}

.category-btn.active {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    inset 0 2px 0 rgba(229, 193, 133, 0.5),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 191, 0, 0.4);
}

.btn-icon {
  font-size: 1.1rem;
}

.items-section {
  margin-top: 40px;
}

.items-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brass);
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', monospace;
}

.title-icon {
  font-size: 2rem;
}

.items-count {
  font-size: 1rem;
  color: var(--wood-lighter);
  font-weight: 400;
  margin-left: 8px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.item-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(92, 61, 46, 0.8);
}

.item-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    inset 0 2px 4px rgba(229, 193, 133, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(184, 115, 51, 0.3);
}

.item-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, var(--wood-dark) 0%, var(--gear-dark) 100%);
  border: 3px solid var(--brass);
  flex-shrink: 0;
  align-self: center;
  position: relative;
  transition: transform 0.3s;
}

.item-card:hover .item-icon-wrapper {
  transform: scale(1.1) rotate(10deg);
}

.item-icon {
  font-size: 2.5rem;
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 191, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.item-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--brass);
  margin: 0;
  font-family: 'Courier New', monospace;
}

.item-category-badge {
  padding: 4px 12px;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.item-name-en {
  color: var(--wood-lighter);
  font-size: 0.9rem;
  font-style: italic;
  margin: -8px 0 0 0;
}

.item-description {
  color: var(--steam-white);
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--copper);
  border-radius: 4px;
}

.item-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attribute-tag {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
}

.attribute-tag.visible {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
  color: #81c784;
}

.attribute-tag.hidden {
  background: rgba(158, 158, 158, 0.2);
  border-color: #9e9e9e;
  color: #bdbdbd;
}

.item-tips {
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 191, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 191, 0, 0.3);
}

.tip-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--amber);
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.tip-icon {
  font-size: 1rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--steam-gray);
  font-size: 0.85rem;
  line-height: 1.4;
}

.tip-dot {
  width: 4px;
  height: 4px;
  background: var(--amber);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.card-gear {
  position: absolute;
  bottom: -20px;
  right: -20px;
  font-size: 5rem;
  opacity: 0.05;
  pointer-events: none;
  animation: rotate-gear 30s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: rgba(92, 61, 46, 0.8);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  color: var(--steam-white);
  font-size: 1.1rem;
  margin-bottom: 24px;
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

  .items-grid {
    grid-template-columns: 1fr;
  }

  .category-filters {
    justify-content: center;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>