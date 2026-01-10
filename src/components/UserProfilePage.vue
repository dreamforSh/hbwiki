<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const { user, updateProfile, logout } = useAuth()

const isEditing = ref(false)
const loading = ref(false)
const editForm = ref({
  username: user.value?.username || '',
  email: user.value?.email || '',
  avatar: user.value?.avatar || '👤'
})

const avatarOptions = ['👤', '😀', '😎', '🤓', '🥳', '🤠', '👻', '🤖', '👽', '🦸', '🧙', '🧚']

const userStats = computed(() => {
  // 这里可以添加用户统计数据
  return {
    visitDays: Math.floor((Date.now() - new Date(user.value?.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 0,
    favorites: 0,
    comments: 0
  }
})

const startEdit = () => {
  isEditing.value = true
  editForm.value = {
    username: user.value.username,
    email: user.value.email,
    avatar: user.value.avatar
  }
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  loading.value = true
  try {
    await updateProfile(editForm.value)
    isEditing.value = false
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    logout()
    emit('go-login')
  }
}
</script>

<template>
  <main class="profile-page" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 展开侧边栏按钮 -->
    <button 
      v-if="sidebarCollapsed" 
      class="expand-sidebar-btn glass-panel"
      @click="emit('toggle-sidebar')"
      title="展开侧边栏"
    >
      <span class="icon">☰</span>
    </button>

    <div class="profile-container">
      <!-- 用户卡片 -->
      <div class="profile-card glass-panel animate-fade-in-up">
        <div class="card-header">
          <div class="avatar-large">{{ user.avatar }}</div>
          <div v-if="!isEditing" class="user-info">
            <h1 class="username">{{ user.username }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <span class="user-badge">{{ user.role === 'admin' ? '管理员' : '普通用户' }}</span>
          </div>
          <div v-else class="edit-form">
            <!-- 头像选择 -->
            <div class="avatar-selector">
              <label class="form-label">选择头像</label>
              <div class="avatar-grid">
                <button
                  v-for="emoji in avatarOptions"
                  :key="emoji"
                  type="button"
                  class="avatar-option"
                  :class="{ selected: editForm.avatar === emoji }"
                  @click="editForm.avatar = emoji"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
            <!-- 用户名 -->
            <div class="form-group">
              <label class="form-label">用户名</label>
              <input 
                v-model="editForm.username"
                type="text" 
                class="form-input"
                placeholder="用户名"
              />
            </div>
            <!-- 邮箱 -->
            <div class="form-group">
              <label class="form-label">邮箱</label>
              <input 
                v-model="editForm.email"
                type="email" 
                class="form-input"
                placeholder="邮箱"
              />
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="card-actions">
          <button 
            v-if="!isEditing"
            class="btn-primary"
            @click="startEdit"
          >
            <span class="btn-icon">✏️</span>
            <span>编辑资料</span>
          </button>
          <template v-else>
            <button 
              class="btn-primary"
              @click="saveProfile"
              :disabled="loading"
            >
              <span class="btn-icon">💾</span>
              <span>保存</span>
            </button>
            <button 
              class="btn-secondary"
              @click="cancelEdit"
              :disabled="loading"
            >
              <span class="btn-icon">❌</span>
              <span>取消</span>
            </button>
          </template>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="stats-grid">
        <div class="stat-box glass-panel card-hover animate-fade-in-up animate-delay-100">
          <div class="stat-icon">📅</div>
          <div class="stat-value">{{ userStats.visitDays }}</div>
          <div class="stat-label">注册天数</div>
        </div>
        <div class="stat-box glass-panel card-hover animate-fade-in-up animate-delay-200">
          <div class="stat-icon">❤️</div>
          <div class="stat-value">{{ userStats.favorites }}</div>
          <div class="stat-label">收藏数</div>
        </div>
        <div class="stat-box glass-panel card-hover animate-fade-in-up animate-delay-300">
          <div class="stat-icon">💬</div>
          <div class="stat-value">{{ userStats.comments }}</div>
          <div class="stat-label">评论数</div>
        </div>
      </div>

      <!-- 账号操作 -->
      <div class="account-actions glass-panel animate-fade-in-up animate-delay-400">
        <h3 class="section-title">账号操作</h3>
        <div class="action-list">
          <button class="action-item" @click="handleLogout">
            <span class="action-icon">🚪</span>
            <span class="action-text">退出登录</span>
            <span class="action-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  margin-left: 280px;
  min-height: 100vh;
  background: transparent;
  transition: margin-left var(--transition-normal);
  position: relative;
  padding: 40px;
  width: calc(100% - 280px);
}

.profile-page.sidebar-collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expand-sidebar-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1) rotate(90deg);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  padding: 40px;
  border-radius: 24px;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.3);
  animation: float 3s ease-in-out infinite;
}

.user-info {
  text-align: center;
}

.username {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.user-email {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.user-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.edit-form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.avatar-option {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-option:hover {
  border-color: var(--accent-color);
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: var(--accent-color);
  background: var(--accent-glow);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 92, 141, 0.1);
}

.card-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 92, 141, 0.5);
}

.btn-secondary {
  background: var(--btn-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-box {
  padding: 24px;
  border-radius: 20px;
  text-align: center;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.account-actions {
  padding: 24px;
  border-radius: 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  padding: 16px;
  background: var(--bg-primary);
  border: none;
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.action-item:hover {
  background: var(--hover-bg);
  transform: translateX(8px);
}

.action-icon {
  font-size: 1.3rem;
}

.action-text {
  flex: 1;
  font-weight: 600;
}

.action-arrow {
  color: var(--text-tertiary);
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.action-item:hover .action-arrow {
  transform: translateX(5px);
  color: var(--accent-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .profile-page {
    margin-left: 0;
    width: 100%;
    padding: 20px;
  }

  .profile-page.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }

  .expand-sidebar-btn {
    left: 20px;
    top: 20px;
  }

  .profile-card {
    padding: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .card-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
