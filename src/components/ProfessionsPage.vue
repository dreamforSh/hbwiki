<script setup>
import { ref, computed } from 'vue'
import { professions, categories } from '../data/professions.js'

const emit = defineEmits(['select-profession'])

const selectedCategory = ref('all')
const searchQuery = ref('')

const filteredProfessions = computed(() => {
  let result = professions

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    const category = categories.find(cat => cat.id === selectedCategory.value)
    if (category) {
      result = result.filter(p => p.category === category.name)
    }
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.nameEn.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return result
})

const handleSelectProfession = (profession) => {
  emit('select-profession', profession)
}

const getFactionColor = (category) => {
  // 根据职业分类返回对应的颜色
  if (category.includes('好人') || category.includes('平民')) {
    return 'var(--good-color)'
  } else if (category.includes('坏人') || category.includes('杀手')) {
    return 'var(--evil-color)'
  }
  return 'var(--neutral-color)'
}
</script>

<template>
  <div class="professions-page wood-texture">
    <!-- 齿轮背景装饰 -->
    <div class="gear-background gear-bg-1">⚙️</div>
    <div class="gear-background gear-bg-3">⚙️</div>

    <div class="page-header wood-panel rivets">
      <div class="copper-corners"></div>

      <div class="page-icon">👥</div>
      <h1 class="page-title text-glow">职业介绍</h1>
      <p class="page-subtitle">探索所有职业的详细技能和特点</p>
    </div>

    <div class="content-container">
      <!-- 筛选和搜索 -->
      <section class="filter-section">
        <div class="search-box wood-panel metal-border">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索职业名称或描述..."
            class="search-input"
          />
        </div>
        <div class="category-filters">
          <button 
            v-for="category in [{ id: 'all', name: '全部' }, ...categories]"
            :key="category.id"
            :class="['category-btn btn-steampunk', { active: selectedCategory === category.id }]"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
            <span v-if="category.count" class="count">({{ category.count }})</span>
          </button>
        </div>
      </section>

      <!-- 职业列表 -->
      <section class="professions-section">
        <div class="professions-header">
          <h2 class="section-title">
            <span class="title-icon">📚</span>
            职业列表
            <span class="professions-count">({{ filteredProfessions.length }})</span>
          </h2>
        </div>

        <div v-if="filteredProfessions.length === 0" class="empty-state wood-panel metal-border">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">未找到匹配的职业</p>
          <button class="btn-secondary" @click="searchQuery = ''; selectedCategory = 'all'">
            清除筛选
          </button>
        </div>

        <div v-else class="professions-grid">
          <div 
            v-for="profession in filteredProfessions" 
            :key="profession.id"
            class="profession-card wood-panel metal-border card-3d"
            @click="handleSelectProfession(profession)"
          >
            <div class="copper-corners"></div>
            <div class="profession-icon-wrapper" :style="{ borderColor: getFactionColor(profession.category) }">
              <span class="profession-icon">{{ profession.icon }}</span>
            </div>
            <div class="profession-info">
              <div class="profession-header">
                <h3 class="profession-name">{{ profession.name }}</h3>
                <span class="profession-category">{{ profession.category }}</span>
              </div>
              <p class="profession-name-en">{{ profession.nameEn }}</p>
              <p class="profession-description">{{ profession.description }}</p>
              <div class="profession-features">
                <span 
                  v-for="(feature, index) in profession.features.slice(0, 2)" 
                  :key="index"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
                <span v-if="profession.features.length > 2" class="feature-more">
                  +{{ profession.features.length - 2 }}
                </span>
              </div>
            </div>
            <div class="profession-arrow">→</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.professions-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 60px 40px;
  position: relative;
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
  font-family: 'Courier New', monospace;
  margin-bottom: 12px;
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

.filter-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.search-icon {
  font-size: 1.2rem;
  color: var(--text-tertiary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--amber);
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: rgba(61, 40, 23, 0.6);
  color: var(--wood-light);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  background: var(--copper);
  border-color: var(--amber);
  color: white;
  transform: translateY(-2px);
}

.category-btn.active {
  background: var(--copper);
  border-color: var(--amber);
  color: white;
}

.count {
  opacity: 0.8;
  font-size: 0.85rem;
}

.professions-section {
  margin-top: 40px;
}

.professions-header {
  margin-bottom: 24px;
}

.professions-count {
  font-size: 1rem;
  color: var(--wood-light);
  font-weight: 400;
  margin-left: 8px;
}

.professions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.profession-card {
  padding: 24px;
  border-radius: 20px;
  display: flex;
  gap: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.profession-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.profession-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border: 3px solid;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.profession-card:hover .profession-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.profession-icon {
  font-size: 2rem;
}

.profession-info {
  flex: 1;
  min-width: 0;
}

.profession-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.profession-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--amber);
  margin: 0;
}

.profession-category {
  padding: 4px 12px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.profession-name-en {
  color: var(--wood-light);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.profession-description {
  color: var(--wood-lighter);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profession-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-tag {
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.2);
  color: var(--wood-lighter);
  border-radius: 8px;
  font-size: 0.75rem;
}

.feature-more {
  padding: 4px 10px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.profession-arrow {
  color: var(--wood-light);
  font-size: 1.5rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
  align-self: center;
}

.profession-card:hover .profession-arrow {
  opacity: 1;
  transform: translateX(5px);
  color: var(--amber);
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  border-radius: 24px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  color: var(--wood-lighter);
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

  .professions-grid {
    grid-template-columns: 1fr;
  }

  .category-filters {
    justify-content: center;
  }
}
</style>
