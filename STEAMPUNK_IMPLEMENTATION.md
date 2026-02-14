# 星穹列车百科 - 蒸汽朋克风格改造实施文档

## 📋 项目概述

本文档记录了将"哈比列车百科"改造为"星穹列车百科"的蒸汽朋克风格升级项目。项目采用Vue 3 + Vite技术栈，目标是打造一个具有木质中世纪蒸汽朋克美学的游戏百科网站。

---

## 🎯 改造目标

### 1. 视觉风格升级
- ✅ **主题色调**：暖色系（棕色、琥珀金、铜色、深红棕）
- ✅ **纹理元素**：木质纹理背景、金属铆钉、皮革质感
- ✅ **装饰元素**：齿轮动画、蒸汽粒子、铜制边框、指针仪表盘
- ✅ **字体风格**：机械风格字体（Courier New）

### 2. 新增功能模块
- ✅ **道具系统页面**：展示30+种游戏道具
- ⏳ **阵营介绍页面**：三大阵营详细介绍（需完成）
- ⏳ **动画系统**：3D效果、视差滚动、粒子系统（需完成）

### 3. 内容优化
- ⏳ **删除投票系统**：移除GameplayPage和AdvancedTipsPage中的投票相关内容
- ⏳ **优化现有页面**：应用蒸汽朋克样式到所有页面

---

## 📁 已完成的文件

### 1. 蒸汽朋克主题样式
**文件路径**: `src/assets/steampunk-theme.css`

**功能**:
- CSS变量定义（色彩系统）
- 木质纹理背景类（`.wood-texture`, `.wood-panel`）
- 金属边框样式（`.metal-border`, `.copper-corners`）
- 齿轮装饰动画（`.gear-decoration`, `.gear-background`）
- 蒸汽粒子效果（`.steam-particle`）
- 3D卡片效果（`.card-3d`, `.card-3d-flip`）
- 视差滚动类（`.parallax-layer`）
- 机械风格按钮（`.btn-steampunk`）
- 发光效果（`.glow-amber`, `.glow-copper`）
- 滚动触发动画（`.scroll-fade-in`, `.scroll-slide-left`等）

**使用方法**:
```vue
<template>
  <div class="wood-texture">
    <div class="wood-panel metal-border copper-corners">
      <h1 class="text-glow">标题</h1>
    </div>
  </div>
</template>
```

### 2. 道具数据文件
**文件路径**: `src/data/items.js`

**内容**:
- `itemCategories`: 4个道具分类（武器、工具、消耗品、特殊）
- `items`: 33种道具的完整数据

**数据结构**:
```javascript
{
  id: 'knife',
  name: '刀',
  nameEn: 'Knife',
  category: 'weapon',
  icon: '🔪',
  description: '...',
  visibility: '可见',
  tips: ['...']
}
```

### 3. 道具介绍页面
**文件路径**: `src/components/ItemsPage.vue`

**功能特性**:
- 分类筛选（武器/工具/消耗品/特殊）
- 实时搜索
- 纵向卡片布局
- 蒸汽朋克风格设计
- 齿轮背景装饰
- 悬停3D效果

**组件结构**:
```
ItemsPage
├── 页面头部（wood-panel + rivets）
├── 筛选区域
│   ├── 搜索框
│   └── 分类按钮
└── 道具网格
    └── 道具卡片（metal-border + copper-corners）
```

---

## ⏳ 待完成的任务

### 任务1: 完成阵营介绍页面
**文件路径**: `src/components/FactionPage.vue`

**需求**:
1. 创建三大阵营卡片：
   - 好人阵营（绿色主题）
   - 坏人阵营（红色主题）
   - 中立阵营（橙色主题）

2. 每个阵营包含：
   - 阵营图标和名称
   - 阵营描述
   - 胜利条件
   - 阵营特色（列表）
   - 代表职业（可展开）

3. 添加阵营对比表格

4. 添加阵营策略提示

**参考代码结构**:
```vue
<script setup>
const factions = [
  {
    id: 'good',
    name: '好人阵营',
    icon: '😇',
    color: '#4caf50',
    description: '...',
    victory: '...',
    features: [...],
    representatives: [...]
  },
  // ... 其他阵营
]
</script>

<template>
  <div class="faction-page wood-texture">
    <!-- 齿轮背景 -->
    <div class="gear-background gear-bg-1">⚙️</div>
    
    <!-- 页面头部 -->
    <div class="page-header wood-panel rivets">
      <h1 class="page-title text-glow">阵营介绍</h1>
    </div>
    
    <!-- 阵营卡片网格 -->
    <div class="factions-grid">
      <div v-for="faction in factions" 
           class="faction-card wood-panel metal-border card-3d">
        <!-- 卡片内容 -->
      </div>
    </div>
  </div>
</template>
```

---

### 任务2: 删除投票系统内容

#### 2.1 修改 GameplayPage.vue
**文件路径**: `src/components/GameplayPage.vue`

**需要删除的部分** (第36-44行):
```javascript
{
  title: '投票系统(未实现)',
  icon: '🗳️',
  items: [
    '玩家可以发起投票讨论',
    '投票可以淘汰可疑的玩家',
    '需要谨慎投票，避免误伤队友',
    '投票结果会影响游戏进程'
  ]
}
```

**操作步骤**:
1. 打开 `src/components/GameplayPage.vue`
2. 找到 `gameRules` 数组
3. 删除标题为"投票系统(未实现)"的对象
4. 保存文件

#### 2.2 修改 AdvancedTipsPage.vue
**文件路径**: `src/components/AdvancedTipsPage.vue`

**需要删除**:
- 搜索 "分析投票模式" 相关的tip对象
- 删除整个对象

---

### 任务3: 集成新页面到路由系统

#### 3.1 更新 WikiSidebar.vue
**文件路径**: `src/components/WikiSidebar.vue`

**需要添加的导航项**:
```javascript
const navItems = [
  // ... 现有项目
  { id: 'factions', name: '阵营介绍', icon: '⚔️' },
  { id: 'items', name: '道具系统', icon: '🎒' },
]
```

#### 3.2 更新 App.vue
**文件路径**: `src/App.vue`

**需要修改**:
1. 导入新组件:
```javascript
import FactionPage from './components/FactionPage.vue'
import ItemsPage from './components/ItemsPage.vue'
```

2. 在 `handleSelect` 函数中添加路由逻辑:
```javascript
else if (id === 'factions') {
  currentPage.value = 'factions'
  errorCode.value = null
} else if (id === 'items') {
  currentPage.value = 'items'
  errorCode.value = null
}
```

3. 在模板中添加条件渲染:
```vue
<FactionPage
  v-else-if="currentPage === 'factions'"
  :sidebar-collapsed="sidebarCollapsed"
  @toggle-sidebar="toggleSidebar"
/>
<ItemsPage
  v-else-if="currentPage === 'items'"
  :sidebar-collapsed="sidebarCollapsed"
  @toggle-sidebar="toggleSidebar"
/>
```

---

### 任务4: 应用蒸汽朋克样式到现有页面

#### 4.1 修改 main.js
**文件路径**: `src/main.js`

**添加样式导入**:
```javascript
import './assets/steampunk-theme.css'
```

#### 4.2 更新 GameplayPage.vue
**需要修改的类名**:
- 将 `.glass-panel` 替换为 `.wood-panel`
- 添加 `.metal-border` 类
- 为卡片添加 `.card-3d` 效果
- 添加齿轮背景装饰

**示例修改**:
```vue
<div class="rule-card wood-panel metal-border card-3d">
  <!-- 内容 -->
</div>
```

#### 4.3 更新 ProfessionsPage.vue
**需要修改**:
- 搜索框添加木质边框
- 职业卡片应用蒸汽朋克样式
- 添加齿轮装饰元素

---

### 任务5: 实现高级动画系统

#### 5.1 视差滚动效果
**文件路径**: `src/App.vue` 或创建 `src/composables/useParallax.js`

**实现思路**:
```javascript
// 监听滚动事件
onMounted(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY
    document.documentElement.style.setProperty('--scroll-y', scrollY)
  }
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
```

**CSS使用**:
```css
.parallax-slow {
  transform: translateY(calc(var(--scroll-y, 0) * 0.3px));
}
```

#### 5.2 粒子系统
**推荐方案1**: 使用 tsparticles

**安装**:
```bash
npm install @tsparticles/vue3
```

**配置示例**:
```javascript
{
  particles: {
    number: { value: 50 },
    shape: { type: "circle" },
    opacity: { value: 0.3 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 1,
      direction: "top"
    }
  }
}
```

**推荐方案2**: 纯CSS实现
- 使用多个 `.steam-particle` div
- 通过 `animation-delay` 控制时序
- 已在 steampunk-theme.css 中定义

#### 5.3 滚动触发动画
**已实现**: 在 `App.vue` 中有 IntersectionObserver

**需要扩展**:
1. 为新页面元素添加观察
2. 添加更多动画类型

```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

// 观察所有 .scroll-fade-in 元素
document.querySelectorAll('.scroll-fade-in').forEach(el => {
  observer.observe(el)
})
```

---

## 🎨 设计规范

### 色彩系统
```css
/* 木质色调 */
--wood-dark: #3d2817
--wood-medium: #5c3d2e
--wood-light: #8b6f47
--wood-lighter: #a88b68

/* 金属色调 */
--copper: #b87333
--brass: #e5c185
--bronze: #cd7f32

/* 蒸汽与光效 */
--steam-white: #f5f5dc
--amber: #ffbf00

/* 阵营颜色 */
--good-color: #4caf50    /* 绿色 */
--evil-color: #f44336    /* 红色 */
--neutral-color: #ff9800  /* 橙色 */
```

### 组件设计模式

#### 页面结构模板
```vue
<template>
  <div class="page-name wood-texture">
    <!-- 齿轮背景装饰 -->
    <div class="gear-background gear-bg-1">⚙️</div>
