<script setup>
import GameIcon from './icons/GameIcons.vue'

const frameworks = [
  'nextjs',
  'nextjs-app',
  'sveltekit',
  'remix',
  'create-react-app',
  'nuxt',
  'vue',
  'astro',
  'other',
  'html'
]

const selectedFramework = ref('nextjs')

import { ref } from 'vue'
</script>

<template>
  <article class="vercel-analytics-page">
    <!-- 页面标题 -->
    <div class="page-header glass-panel">
      <div class="header-icon">
        <GameIcon name="chart" :size="40" color="var(--accent-color)" />
      </div>
      <div class="header-content">
        <h1 class="page-title">Vercel Web Analytics 指南</h1>
        <p class="page-subtitle">学习如何在你的项目中启用和使用 Vercel Web Analytics</p>
      </div>
    </div>

    <!-- 内容容器 -->
    <div class="analytics-content">
      <!-- 概述部分 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="info" :size="24" color="var(--accent-color)" />
          概述
        </h2>
        <p class="section-description">
          这份指南将帮助你在你的项目中快速开始使用 Vercel Web Analytics，
          展示如何启用它、将包添加到项目中、部署你的应用到 Vercel，以及在仪表板中查看你的数据。
        </p>
      </section>

      <!-- 前置条件 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="checkbox" :size="24" color="var(--accent-color)" />
          前置条件
        </h2>
        <ul class="requirements-list">
          <li>
            <span class="requirement-bullet">✓</span>
            一个 Vercel 账户。如果没有，你可以 <a href="https://vercel.com/signup" target="_blank">免费注册</a>
          </li>
          <li>
            <span class="requirement-bullet">✓</span>
            一个 Vercel 项目。如果没有，你可以 <a href="https://vercel.com/new" target="_blank">创建新项目</a>
          </li>
          <li>
            <span class="requirement-bullet">✓</span>
            已安装 Vercel CLI。使用以下命令安装：
            <div class="code-block">
              <code>npm i -D vercel</code>
            </div>
          </li>
        </ul>
      </section>

      <!-- 启用 Web Analytics -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="power" :size="24" color="var(--accent-color)" />
          启用 Web Analytics
        </h2>
        <div class="info-box">
          <p>
            在 <a href="/dashboard" target="_blank">Vercel 仪表板</a>中，选择你的项目，然后点击 <strong>Analytics</strong> 标签，
            再从对话框中点击 <strong>启用</strong>。
          </p>
          <div class="note-box">
            <span class="note-icon">💡</span>
            <strong>注意：</strong> 启用 Web Analytics 后，在下次部署后将添加新的路由（作用域为 <code>/_vercel/insights/*</code>）。
          </div>
        </div>
      </section>

      <!-- 添加包 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="package" :size="24" color="var(--accent-color)" />
          添加 @vercel/analytics 包
        </h2>
        <p class="section-description">
          使用你选择的包管理器，将 <code>@vercel/analytics</code> 包添加到你的项目：
        </p>
        <div class="package-managers">
          <div class="pm-option">
            <span class="pm-name">npm</span>
            <div class="code-block">
              <code>npm install @vercel/analytics</code>
            </div>
          </div>
          <div class="pm-option">
            <span class="pm-name">pnpm</span>
            <div class="code-block">
              <code>pnpm add @vercel/analytics</code>
            </div>
          </div>
          <div class="pm-option">
            <span class="pm-name">yarn</span>
            <div class="code-block">
              <code>yarn add @vercel/analytics</code>
            </div>
          </div>
          <div class="pm-option">
            <span class="pm-name">bun</span>
            <div class="code-block">
              <code>bun add @vercel/analytics</code>
            </div>
          </div>
        </div>
      </section>

      <!-- 框架集成 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="layers" :size="24" color="var(--accent-color)" />
          框架集成
        </h2>
        
        <div class="framework-info">
          <p class="framework-desc">
            根据你使用的框架，有不同的集成方式。下面是常见框架的实现示例：
          </p>

          <!-- Vue 3 示例 -->
          <div class="framework-section">
            <h3 class="framework-title">
              <span class="framework-icon">🖖</span>
              Vue 3 / Vite
            </h3>
            <p class="framework-subtitle">
              Analytics 组件提供了与 Vue 的无缝集成，包括路由支持。
            </p>
            <div class="code-block">
              <code>
// src/main.js<br />
import { createApp } from 'vue'<br />
import { Analytics } from '@vercel/analytics/vue'<br />
import App from './App.vue'<br />
<br />
const app = createApp(App)<br />
app.use(Analytics)<br />
app.mount('#app')
              </code>
            </div>
            <p class="code-note">或在你的主组件中使用：</p>
            <div class="code-block">
              <code>
&lt;script setup&gt;<br />
import { Analytics } from '@vercel/analytics/vue'<br />
&lt;/script&gt;<br />
<br />
&lt;template&gt;<br />
  &lt;Analytics /&gt;<br />
  &lt;!-- 你的内容 --&gt;<br />
&lt;/template&gt;
              </code>
            </div>
          </div>

          <!-- React 示例 -->
          <div class="framework-section">
            <h3 class="framework-title">
              <span class="framework-icon">⚛️</span>
              React
            </h3>
            <p class="framework-subtitle">
              Analytics 组件提供与 React 的无缝集成。
            </p>
            <div class="code-block">
              <code>
import { Analytics } from '@vercel/analytics/react'<br />
<br />
export default function App() {{'{'}} <br />
  return (<br />
    &lt;div&gt;<br />
      {{'{'}} /* 你的内容 */ {'}'}} <br />
      &lt;Analytics /&gt;<br />
    &lt;/div&gt;<br />
  )<br />
{{'}'}}
              </code>
            </div>
          </div>

          <!-- Next.js 示例 -->
          <div class="framework-section">
            <h3 class="framework-title">
              <span class="framework-icon">▲</span>
              Next.js
            </h3>
            <p class="framework-subtitle">
              Analytics 组件是跟踪脚本的包装器，提供与 Next.js 的更无缝集成，包括路由支持。
            </p>
            <p class="code-note">在 Pages Router 中：</p>
            <div class="code-block">
              <code>
// pages/_app.tsx<br />
import type {{'{'}} AppProps {'}'}} from 'next/app'<br />
import {{'{'}} Analytics {'}'}} from '@vercel/analytics/next'<br />
<br />
export default function App({{'{'}} Component, pageProps {{'}'}} : AppProps) {{'{'}} <br />
  return (<br />
    &lt;&gt;<br />
      &lt;Component {...pageProps} /&gt;<br />
      &lt;Analytics /&gt;<br />
    &lt;/&gt;<br />
  )<br />
{{'}'}}
              </code>
            </div>
            <p class="code-note">在 App Router 中：</p>
            <div class="code-block">
              <code>
// app/layout.tsx<br />
import {{'{'}} Analytics {'}'}} from '@vercel/analytics/next'<br />
<br />
export default function RootLayout({{'{'}} children {{'}'}} : {{'{'}} children: React.ReactNode {{'}'}}) {{'{'}} <br />
  return (<br />
    &lt;html lang="en"&gt;<br />
      &lt;body&gt;<br />
        {{'{'}} children {{'}'}}<br />
        &lt;Analytics /&gt;<br />
      &lt;/body&gt;<br />
    &lt;/html&gt;<br />
  )<br />
{{'}'}}
              </code>
            </div>
          </div>

          <!-- Svelte/SvelteKit 示例 -->
          <div class="framework-section">
            <h3 class="framework-title">
              <span class="framework-icon">🔥</span>
              SvelteKit
            </h3>
            <p class="framework-subtitle">
              injectAnalytics 函数提供与 SvelteKit 的无缝集成，包括路由支持。
            </p>
            <div class="code-block">
              <code>
// src/routes/+layout.ts<br />
import {{'{'}} dev {'}'}} from '$app/environment'<br />
import {{'{'}} injectAnalytics {'}'}} from '@vercel/analytics/sveltekit'<br />
<br />
injectAnalytics({{'{'}} mode: dev ? 'development' : 'production' {{'}'}})
              </code>
            </div>
          </div>

          <!-- HTML 示例 -->
          <div class="framework-section">
            <h3 class="framework-title">
              <span class="framework-icon">📄</span>
              HTML / 静态网站
            </h3>
            <p class="framework-subtitle">
              对于纯 HTML 网站，你可以将脚本标签添加到你的 HTML 文件中。
            </p>
            <div class="code-block">
              <code>
&lt;!-- index.html --&gt;<br />
&lt;script&gt;<br />
  window.va = window.va || function () {{'{'}} (window.vaq = window.vaq || []).push(arguments); {{'}'}}<br />
&lt;/script&gt;<br />
&lt;script defer src="/_vercel/insights/script.js"&gt;&lt;/script&gt;
              </code>
            </div>
            <div class="note-box">
              <span class="note-icon">💡</span>
              <strong>注意：</strong> 使用 HTML 实现时，无需安装 @vercel/analytics 包。但是，没有路由支持。
            </div>
          </div>
        </div>
      </section>

      <!-- 部署应用 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="upload" :size="24" color="var(--accent-color)" />
          部署应用到 Vercel
        </h2>
        <p class="section-description">
          使用以下命令部署你的应用：
        </p>
        <div class="code-block">
          <code>vercel deploy</code>
        </div>
        <p class="section-description">
          如果还没有，我们还建议 <a href="/docs/git#deploying-a-git-repository" target="_blank">将你的项目的 Git 仓库连接到 Vercel</a>，
          这将使 Vercel 能够自动部署你的主分支最新提交，而无需终端命令。
        </p>
        <p class="section-description">
          应用部署后，它将开始跟踪访问者和页面浏览。
        </p>
        <div class="note-box">
          <span class="note-icon">💡</span>
          <strong>注意：</strong> 如果一切设置正确，当你访问任何页面时，你应该能够在浏览器的网络标签中看到来自 <code>/_vercel/insights/view</code> 的 Fetch/XHR 请求。
        </div>
      </section>

      <!-- 查看数据 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="eye" :size="24" color="var(--accent-color)" />
          在仪表板中查看数据
        </h2>
        <p class="section-description">
          应用部署后，用户访问你的网站，你就可以在仪表板中查看数据。
        </p>
        <p class="section-description">
          要查看数据，请转到你的 <a href="/dashboard" target="_blank">仪表板</a>，选择你的项目，然后点击 <strong>Analytics</strong> 标签。
        </p>
        <p class="section-description">
          在有数天的访问者后，你将能够开始通过查看和 <a href="/docs/analytics/filtering" target="_blank">筛选</a> 面板来探索你的数据。
        </p>
        <p class="section-description">
          Pro 和 Enterprise 计划上的用户也可以向他们的数据中添加 <a href="/docs/analytics/custom-events" target="_blank">自定义事件</a> 来跟踪用户交互，如按钮点击、表单提交或购买。
        </p>
      </section>

      <!-- 隐私和合规 -->
      <section class="content-section glass-panel">
        <h2 class="section-title">
          <GameIcon name="lock" :size="24" color="var(--accent-color)" />
          隐私和合规
        </h2>
        <p class="section-description">
          Vercel Web Analytics 支持 <a href="/docs/analytics/privacy-policy" target="_blank">隐私和数据合规标准</a>。
          了解更多关于数据安全和用户隐私的信息。
        </p>
      </section>

      <!-- 下一步 -->
      <section class="content-section glass-panel next-steps">
        <h2 class="section-title">
          <GameIcon name="arrowRight" :size="24" color="var(--accent-color)" />
          下一步
        </h2>
        <p class="section-description">
          现在你已经设置了 Vercel Web Analytics，你可以探索以下主题了解更多：
        </p>
        <ul class="next-steps-list">
          <li><a href="/docs/analytics/package" target="_blank">了解 @vercel/analytics 包的使用</a></li>
          <li><a href="/docs/analytics/custom-events" target="_blank">了解如何设置自定义事件</a></li>
          <li><a href="/docs/analytics/filtering" target="_blank">了解如何筛选数据</a></li>
          <li><a href="/docs/analytics/privacy-policy" target="_blank">阅读隐私和合规信息</a></li>
          <li><a href="/docs/analytics/limits-and-pricing" target="_blank">浏览定价和限制</a></li>
          <li><a href="/docs/analytics/troubleshooting" target="_blank">故障排除</a></li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
.vercel-analytics-page {
  width: 100%;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--accent-color, #ff5c8d) 0%, var(--secondary-color, #42a5f5) 100%);
  border-radius: 1rem;
  color: white;
}

.header-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  color: white;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section {
  padding: 2rem;
  border-radius: 1rem;
  animation: fadeInUp 0.6s ease;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text-primary, #000);
}

.section-description {
  font-size: 1rem;
  line-height: 1.6;
  margin: 1rem 0;
  color: var(--text-secondary, #666);
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.requirements-list li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 1rem;
  color: var(--text-secondary, #666);
  line-height: 1.6;
}

.requirement-bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--accent-color, #ff5c8d);
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.requirements-list a {
  color: var(--accent-color, #ff5c8d);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.requirements-list a:hover {
  opacity: 0.8;
}

.code-block {
  background: var(--code-bg, #f5f5f5);
  border-left: 3px solid var(--accent-color, #ff5c8d);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--code-color, #333);
  line-height: 1.5;
}

.info-box {
  background: var(--info-bg, #e3f2fd);
  border-left: 4px solid #2196f3;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.note-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--note-bg, #f5f5f5);
  border-radius: 0.5rem;
  margin: 1rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.note-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.package-managers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.pm-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pm-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary, #000);
}

.framework-info {
  margin: 1rem 0;
}

.framework-desc {
  font-size: 1rem;
  color: var(--text-secondary, #666);
  margin-bottom: 1.5rem;
}

.framework-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--section-bg, #f9f9f9);
  border-radius: 0.75rem;
  border-left: 4px solid var(--accent-color, #ff5c8d);
}

.framework-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary, #000);
}

.framework-icon {
  font-size: 1.5rem;
}

.framework-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary, #666);
  margin: 0.5rem 0 1rem 0;
}

.code-note {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  font-style: italic;
  margin: 1rem 0 0.5rem 0;
}

.next-steps-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.next-steps-list li {
  padding-left: 2rem;
  position: relative;
}

.next-steps-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent-color, #ff5c8d);
  font-weight: bold;
}

.next-steps-list a {
  color: var(--accent-color, #ff5c8d);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.next-steps-list a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.next-steps {
  margin-top: 3rem;
  border-top: 2px solid var(--border-color, #e0e0e0);
  padding-top: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vercel-analytics-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .content-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .package-managers {
    grid-template-columns: 1fr;
  }

  .framework-section {
    padding: 1rem;
  }

  .framework-title {
    font-size: 1.1rem;
  }
}

/* 暗色模式支持 */
:global([data-theme='dark']) .code-block {
  --code-bg: #1e1e1e;
  --code-color: #e0e0e0;
}

:global([data-theme='dark']) .info-box {
  --info-bg: #1a3a52;
}

:global([data-theme='dark']) .note-box {
  --note-bg: #2a2a2a;
  color: #e0e0e0;
}

:global([data-theme='dark']) .framework-section {
  --section-bg: #2a2a2a;
}
</style>
