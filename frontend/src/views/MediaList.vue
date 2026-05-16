<template>
  <div class="media-list-page polished-shell">
    <header class="header polished-panel">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
      <div class="item-count">{{ contents.length }}项</div>
    </header>

    <main class="main-content">
      <div class="media-grid">
        <article v-for="item in contents" :key="item.id" class="media-card">
          <div class="media-icon">{{ item.icon }}</div>
          <div class="media-body">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <div class="media-meta">
              <span>{{ item.duration }}</span>
              <span>{{ item.ageRange }}</span>
            </div>
            <div class="tag-row">
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CLASSIC_SONGS, FEATURED_ANIMATIONS } from '@/config/home-content'
import { audioManager } from '@/modules/common/utils/audio'

const route = useRoute()
const router = useRouter()

const type = computed(() => route.params.type as string)
const pageTitle = computed(() => type.value === 'animations' ? '精选动画' : '经典儿歌')
const contents = computed(() => type.value === 'animations' ? FEATURED_ANIMATIONS : CLASSIC_SONGS)

const goBack = () => {
  audioManager.playClick()
  router.back()
}
</script>

<style scoped lang="scss">
.media-list-page {
  min-height: 100dvh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 14%, rgba(255, 214, 228, 0.9) 0 90px, transparent 92px),
    radial-gradient(circle at 88% 18%, rgba(194, 232, 255, 0.85) 0 110px, transparent 112px),
    linear-gradient(135deg, #FFF8E7 0%, #FFEAF3 45%, #EAF7FF 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: max(12px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) 0 max(14px, env(safe-area-inset-left));
  padding: 18px 28px;
  border: 4px solid rgba(255, 255, 255, 0.78);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 14px 36px rgba(255, 160, 190, 0.18);
  backdrop-filter: blur(10px);
}

.btn-back,
.item-count {
  min-height: 52px;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  font-size: 18px;
  font-weight: 800;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFFFFF, #F3FBFF);
  color: #4B6175;
  cursor: pointer;
  box-shadow: inset 0 -4px 0 rgba(93, 173, 226, 0.12), 0 8px 18px rgba(93, 173, 226, 0.14);
}

.page-title {
  flex: 1;
  margin: 0;
  color: #4A5F7A;
  font-size: clamp(30px, 4vw, 42px);
  text-align: center;
  text-shadow: 0 3px 0 rgba(255, 255, 255, 0.9);
}

.item-count {
  display: inline-flex;
  align-items: center;
  color: white;
  background: linear-gradient(135deg, #FFB86B, #FF8DB3);
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 34px max(18px, env(safe-area-inset-right)) calc(32px + env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left));
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.media-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  min-height: 190px;
  padding: 24px;
  border: 5px solid rgba(255, 255, 255, 0.82);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 -8px 0 rgba(255, 215, 170, 0.22), 0 18px 38px rgba(116, 139, 170, 0.16);
}

.media-icon {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background: linear-gradient(135deg, #FFF3D8, #E9F8FF);
  font-size: 54px;
}

.media-body {
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    color: #4A5F7A;
    font-size: clamp(24px, 3vw, 32px);
    line-height: 1.15;
  }

  p {
    margin: 0 0 12px;
    color: #6F8299;
    font-size: 17px;
    line-height: 1.45;
  }
}

.media-meta,
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-meta span,
.tag-row span {
  padding: 5px 10px;
  border-radius: 999px;
  color: #4A5F7A;
  background: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  font-weight: 800;
}

.tag-row {
  margin-top: 8px;
}

@media (max-width: 820px) {
  .media-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header {
    gap: 8px;
    padding: 10px 12px;
    border-radius: 26px;
  }

  .btn-back,
  .item-count {
    min-height: 42px;
    padding: 7px 11px;
    font-size: 14px;
  }

  .page-title {
    font-size: 24px;
    white-space: nowrap;
  }

  .main-content {
    padding-top: 18px;
  }

  .media-card {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    min-height: 136px;
    padding: 14px;
    border-radius: 26px;
  }

  .media-icon {
    width: 62px;
    height: 62px;
    border-radius: 20px;
    font-size: 36px;
  }

  .media-body h2 {
    font-size: 20px;
  }

  .media-body p {
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 1.32;
  }

  .media-meta span,
  .tag-row span {
    padding: 3px 7px;
    font-size: 11px;
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .media-list-page {
    height: 100dvh;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    flex-shrink: 0;
    margin: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 0 max(8px, env(safe-area-inset-left));
    padding: 6px 10px;
    border-width: 2px;
    border-radius: 18px;
  }

  .btn-back,
  .item-count {
    min-height: 32px;
    padding: 4px 10px;
    font-size: 12px;
  }

  .page-title {
    font-size: clamp(18px, 3.4vw, 24px);
  }

  .main-content {
    flex: 1;
    min-height: 0;
    width: 100%;
    max-width: none;
    padding: 8px calc(max(10px, env(safe-area-inset-right)) + 42px) calc(8px + env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
    overflow: auto;
  }

  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .media-card {
    min-height: 112px;
    gap: 10px;
    padding: 10px;
    border-width: 2px;
    border-radius: 20px;
  }

  .media-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    font-size: 32px;
  }

  .media-body h2 {
    margin-bottom: 4px;
    font-size: 16px;
  }

  .media-body p {
    margin-bottom: 5px;
    font-size: 11px;
    line-height: 1.2;
  }
}
</style>
