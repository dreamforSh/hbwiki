<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { deleteAccount } from '../api/auth.api'

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

// 账号注销相关
const showDeleteModal = ref(false)
const deleteForm = ref({
  password: '',
  confirmText: ''
})
const deleteLoading = ref(false)
const deleteError = ref('')

const canDeleteAccount = computed(() => {
  return deleteForm.value.password.length >= 6 && 
         deleteForm.value.confirmText === '删除我的账号'
})

const openDeleteModal = () => {
  showDeleteModal.value = true
  deleteForm.value = { password: '', confirmText: '' }
  deleteError.value = ''
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteForm.value = { password: '', confirmText: '' }
  deleteError.value = ''
}

const handleDeleteAccount = async () => {
  if (!canDeleteAccount.value) return

  deleteLoading.value = true
  deleteError.value = ''

  try {
    const result = await deleteAccount(user.value.email, deleteForm.value.password)
    
    if (result.success) {
      // 成功后退出登录
      closeDeleteModal()
      alert('账号已成功注销')
      logout()
      emit('go-login')
    } else {
      deleteError.value = result.message || '注销失败，请检查密码是否正确'
    }
  } catch (error) {
    deleteError.value = '注销失败，请稍后重试'
  } finally {
    deleteLoading.value = false
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

      <!-- 危险操作区 -->
      <div class="danger-zone glass-panel animate-fade-in-up animate-delay-500">
        <h3 class="section-title danger-title">
          <span class="danger-icon">⚠️</span>
          危险操作
        </h3>
        <div class="danger-content">
          <div class="danger-description">
            <p class="danger-text">注销账号后，您的所有数据将被永久删除且无法恢复。</p>
          </div>
          <button class="danger-btn" @click="openDeleteModal">
            <span class="btn-icon">🗑️</span>
            <span>注销账号</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 账号注销确认对话框 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
          <div class="modal-container danger-modal">
            <div class="modal-header">
              <div class="modal-icon danger">
                <span>⚠️</span>
              </div>
              <h2 class="modal-title">确认注销账号</h2>
              <button class="modal-close" @click="closeDeleteModal">✕</button>
            </div>

            <div class="modal-body">
              <div class="warning-box">
                <h4 class="warning-title">⚠️ 此操作无法撤销</h4>
                <ul class="warning-list">
                  <li>您的所有个人资料将被永久删除</li>
                  <li>所有收藏和评论将被清除</li>
                  <li>账号注销后无法恢复</li>
                </ul>
              </div>

              <div class="form-group">
                <label class="form-label">请输入您的密码以确认</label>
                <input
                  v-model="deleteForm.password"
                  type="password"
                  class="form-input"
                  placeholder="请输入登录密码"
                  @keyup.enter="canDeleteAccount && handleDeleteAccount()"
                />
              </div>

              <div class="form-group">
                <label class="form-label">请输入"删除我的账号"以确认</label>
                <input
                  v-model="deleteForm.confirmText"
                  type="text"
                  class="form-input"
                  placeholder="删除我的账号"
                  @keyup.enter="canDeleteAccount && handleDeleteAccount()"
                />
              </div>

              <div v-if="deleteError" class="error-message">
                <span class="error-icon">⚠️</span>
                <span>{{ deleteError }}</span>
              </div>
            </div>

            <div class="modal-footer">
              <button 
                class="btn-secondary"
                @click="closeDeleteModal"
                :disabled="deleteLoading"
              >
                取消
              </button>
              <button
                class="btn-danger"
                :class="{ disabled: !canDeleteAccount }"
                :disabled="!canDeleteAccount || deleteLoading"
                @click="handleDeleteAccount"
              >
                <span v-if="deleteLoading">注销中...</span>
                <span v-else>确认注销账号</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

/* 危险操作区 */
.danger-zone {
  padding: 24px;
  border-radius: 20px;
  border: 2px solid rgba(239, 83, 80, 0.3);
}

.danger-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--evil-color);
}

.danger-icon {
  font-size: 1.3rem;
}

.danger-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 16px;
}

.danger-description {
  flex: 1;
}

.danger-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.danger-btn {
  padding: 12px 24px;
  background: rgba(239, 83, 80, 0.1);
  border: 2px solid var(--evil-color);
  border-radius: 12px;
  color: var(--evil-color);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.danger-btn:hover {
  background: var(--evil-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.3);
}

/* 对话框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: var(--bg-secondary);
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.danger-modal {
  border: 2px solid var(--evil-color);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.modal-icon.danger {
  background: rgba(239, 83, 80, 0.1);
  border: 2px solid var(--evil-color);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: var(--evil-color);
  color: white;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.warning-box {
  padding: 16px;
  background: rgba(239, 83, 80, 0.05);
  border: 1px solid var(--evil-color);
  border-radius: 12px;
}

.warning-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--evil-color);
  margin-bottom: 12px;
}

.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warning-list li {
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding-left: 20px;
  position: relative;
}

.warning-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: var(--evil-color);
  font-weight: bold;
}

.error-message {
  padding: 12px 16px;
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid var(--evil-color);
  border-radius: 10px;
  color: var(--evil-color);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 1.1rem;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-danger {
  padding: 12px 24px;
  background: var(--evil-color);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover:not(.disabled):not(:disabled) {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.4);
}

.btn-danger.disabled,
.btn-danger:disabled {
  background: var(--border-color);
  color: var(--text-tertiary);
  cursor: not-allowed;
  transform: none;
}

/* 对话框动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s, opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
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

  .danger-content {
    flex-direction: column;
    align-items: stretch;
  }

  .danger-btn {
    justify-content: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-danger,
  .btn-secondary {
    width: 100%;
  }
}
</style>
