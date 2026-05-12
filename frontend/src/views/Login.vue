<template>
  <div class="login-page polished-shell">
    <main class="login-card polished-panel">
      <div class="mascot" aria-hidden="true">🐣</div>
      <p class="eyebrow">宝宝专属入口</p>
      <h1>欢迎回来，小宝贝</h1>
      <p class="subtitle">先用游客身份体验，后续可接入家长登录与成长档案。</p>

      <button class="primary-btn" @click="goHome">🏠 回到首页</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { audioManager } from '@/modules/common/utils/audio'

const router = useRouter()

const goHome = () => {
  audioManager.playClick()
  router.push('/')
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 18px;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 216, 118, 0.34), transparent 28%),
    radial-gradient(circle at 82% 22%, rgba(139, 214, 255, 0.28), transparent 28%),
    linear-gradient(135deg, #fff9e6 0%, #ffe8f0 54%, #eaf8ff 100%);
}

.login-card {
  width: min(520px, 100%);
  padding: clamp(28px, 7vw, 54px) clamp(20px, 6vw, 44px);
  border-radius: 36px;
  text-align: center;
}

.mascot {
  width: clamp(86px, 20vw, 132px);
  height: clamp(86px, 20vw, 132px);
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  border-radius: 34px;
  font-size: clamp(54px, 13vw, 82px);
  background: linear-gradient(135deg, #fff6c9, #ffd6e8);
  box-shadow: var(--shadow-pop);
  animation: floatBaby 2.4s ease-in-out infinite;
}

.eyebrow {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  color: #5d7fa6;
  font-size: clamp(13px, 3vw, 16px);
  font-weight: 800;
  background: rgba(93, 173, 226, 0.12);
}

h1 {
  margin: 14px 0 8px;
  color: #2c3e50;
  font-size: clamp(28px, 7vw, 42px);
  line-height: 1.18;
}

.subtitle {
  max-width: 360px;
  margin: 0 auto 24px;
  color: #5d6d7e;
  font-size: clamp(15px, 3.6vw, 18px);
  line-height: 1.7;
}

.primary-btn {
  min-width: min(260px, 100%);
  min-height: 64px;
  border: 0;
  border-radius: 999px;
  color: white;
  font-size: clamp(20px, 5vw, 26px);
  font-weight: 900;
  cursor: pointer;
  background: linear-gradient(135deg, #ff9f6e, #ff6fa8);
  box-shadow: 0 12px 0 rgba(207, 102, 119, 0.16), 0 18px 32px rgba(255, 111, 168, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:active {
    transform: translateY(4px) scale(0.98);
    box-shadow: 0 6px 0 rgba(207, 102, 119, 0.16), 0 12px 22px rgba(255, 111, 168, 0.22);
  }
}

@keyframes floatBaby {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
</style>
