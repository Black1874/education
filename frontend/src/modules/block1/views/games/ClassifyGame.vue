<template>
  <div class="classify-game">
    <header class="game-topbar polished-panel">
      <button class="icon-button back-button" aria-label="返回" @click="goBack">
        <span aria-hidden="true">←</span>
      </button>

      <div class="title-block">
        <p class="level-label">第 {{ level.level }} / {{ CLASSIFY_TOTAL_LEVELS }} 关</p>
        <h1>{{ level.title }}</h1>
      </div>

      <div class="status-group" aria-label="游戏状态">
        <div class="status-pill">
          <span aria-hidden="true">⭐</span>
          <strong>{{ totalStars }}</strong>
        </div>
        <button class="icon-button reset-button" aria-label="重新开始" @click="resetGame">
          <span aria-hidden="true">↻</span>
        </button>
      </div>
    </header>

    <main class="classify-stage" :class="{ 'is-complete': completed }">
      <section class="play-field" aria-label="分类游戏场景">
        <div
          v-for="target in CLASSIFY_TARGETS"
          :key="target.id"
          class="drop-scene"
          :class="[
            target.sceneClass,
            scenePositionByTarget[target.id],
            {
              'is-hot': hotTargetId === target.id,
              'is-correct': lastSuccessTargetId === target.id,
              'is-wrong': lastWrongTargetId === target.id
            }
          ]"
          :data-target-id="target.id"
          role="group"
          :aria-label="target.title"
        >
          <div class="scene-art" aria-hidden="true">
            <img :src="target.sceneImageUrl" :alt="target.title" draggable="false" />
          </div>

          <div class="scene-copy">
            <h2>{{ target.shortTitle }}</h2>
            <p>{{ target.hint }}</p>
          </div>

          <div class="placed-items" aria-hidden="true">
            <div
              v-for="placed in placedByTarget[target.id]"
              :key="placed.id"
              class="placed-item"
            >
              <img :src="placed.imageUrl" :alt="placed.name" draggable="false" />
            </div>
          </div>
        </div>

        <div class="center-nest polished-panel">
          <p>{{ level.prompt }}</p>
          <div class="item-tray" :class="{ 'is-shaking': trayShaking }">
            <button
              v-for="item in unplacedItems"
              :key="item.id"
              class="drag-card"
              :class="{ 'is-dragging-source': dragState?.item.id === item.id }"
              type="button"
              :aria-label="`拖动${item.name}`"
              @pointerdown="startDrag($event, item)"
            >
              <img :src="item.imageUrl" :alt="item.name" draggable="false" />
              <span>{{ item.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <div
        v-if="dragState"
        class="drag-ghost"
        :style="ghostStyle"
        aria-hidden="true"
      >
        <img :src="dragState.item.imageUrl" :alt="dragState.item.name" draggable="false" />
        <span>{{ dragState.item.name }}</span>
      </div>

      <div v-if="feedbackText" class="feedback-bubble" :class="feedbackType">
        {{ feedbackText }}
      </div>
    </main>

    <div v-if="completed" class="complete-layer" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <div class="complete-card polished-panel">
        <p class="complete-eyebrow">都回家啦</p>
        <h2 id="complete-title">真棒！</h2>
        <div class="earned-stars" aria-label="本关星级">
          <span v-for="star in 3" :key="star" :class="{ dim: star > earnedStars }">⭐</span>
        </div>
        <p class="reward-line">获得 {{ rewardStars }} 颗星星</p>
        <div class="complete-actions">
          <button class="secondary-action" @click="resetGame">再玩一次</button>
          <button v-if="hasNextLevel" class="primary-action" @click="goToNextLevel">下一关</button>
          <button v-else class="primary-action" @click="goBack">回游戏世界</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CLASSIFY_ITEM_POOL,
  CLASSIFY_LEVELS,
  CLASSIFY_TARGETS,
  CLASSIFY_TOTAL_LEVELS,
  type ClassifyCategory,
  type ClassifyItem
} from '@/config/classify-game'
import { STAR_REWARDS } from '@/config/games'
import { audioManager } from '@/modules/common/utils/audio'
import { storageManager } from '@/modules/common/utils/storage'

interface DragState {
  item: ClassifyItem
  pointerId: number
  x: number
  y: number
}

type ScenePositionClass = 'scene-position-a' | 'scene-position-b' | 'scene-position-c' | 'scene-position-d'

const router = useRouter()
const currentLevelIndex = ref(0)
const level = computed(() => CLASSIFY_LEVELS[currentLevelIndex.value])
const activeItems = ref<ClassifyItem[]>([])
const scenePositionByTarget = reactive<Record<ClassifyCategory, ScenePositionClass>>({
  fruit: 'scene-position-a',
  vegetable: 'scene-position-b',
  animal: 'scene-position-c',
  vehicle: 'scene-position-d'
})
const placedTargetByItem = reactive<Record<string, ClassifyCategory | null>>({})
const dragState = ref<DragState | null>(null)
const hotTargetId = ref<ClassifyCategory | null>(null)
const lastSuccessTargetId = ref<ClassifyCategory | null>(null)
const lastWrongTargetId = ref<ClassifyCategory | null>(null)
const feedbackText = ref('')
const feedbackType = ref<'success' | 'error'>('success')
const trayShaking = ref(false)
const completed = ref(false)
const earnedStars = ref(0)
const rewardStars = ref(0)
const errors = ref(0)
const startedAt = ref(Date.now())
const totalStars = ref(0)
let feedbackTimer = 0
let sceneTimer = 0

const hasNextLevel = computed(() => currentLevelIndex.value < CLASSIFY_LEVELS.length - 1)
const unplacedItems = computed(() => activeItems.value.filter(item => !placedTargetByItem[item.id]))

const placedByTarget = computed<Record<ClassifyCategory, ClassifyItem[]>>(() => {
  const groups: Record<ClassifyCategory, ClassifyItem[]> = {
    fruit: [],
    vegetable: [],
    animal: [],
    vehicle: []
  }

  activeItems.value.forEach((item) => {
    const target = placedTargetByItem[item.id]
    if (target) {
      groups[target].push(item)
    }
  })

  return groups
})

const ghostStyle = computed(() => {
  if (!dragState.value) return {}

  return {
    transform: `translate3d(${dragState.value.x}px, ${dragState.value.y}px, 0)`
  }
})

onMounted(() => {
  totalStars.value = storageManager.getUserData().totalStars
  startLevel()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', finishDrag)
  window.removeEventListener('pointercancel', cancelDrag)
  window.clearTimeout(feedbackTimer)
  window.clearTimeout(sceneTimer)
})

const startLevel = () => {
  activeItems.value = createRandomItems(level.value.itemsPerCategory)
  randomizeScenePositions()
  resetPlacements()
  dragState.value = null
  hotTargetId.value = null
  lastSuccessTargetId.value = null
  lastWrongTargetId.value = null
  feedbackText.value = ''
  trayShaking.value = false
  completed.value = false
  earnedStars.value = 0
  rewardStars.value = 0
  errors.value = 0
  startedAt.value = Date.now()
}

const resetPlacements = () => {
  Object.keys(placedTargetByItem).forEach((itemId) => {
    delete placedTargetByItem[itemId]
  })

  activeItems.value.forEach((item) => {
    placedTargetByItem[item.id] = null
  })
}

const goBack = () => {
  audioManager.playClick()
  router.back()
}

const resetGame = () => {
  audioManager.playClick()
  startLevel()
}

const goToNextLevel = () => {
  audioManager.playClick()
  if (!hasNextLevel.value) return

  currentLevelIndex.value += 1
  startLevel()
}

const startDrag = (event: PointerEvent, item: ClassifyItem) => {
  if (completed.value) return

  event.preventDefault()
  audioManager.playClick()

  dragState.value = {
    item,
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: false })
  window.addEventListener('pointerup', finishDrag)
  window.addEventListener('pointercancel', cancelDrag)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!dragState.value || event.pointerId !== dragState.value.pointerId) return

  event.preventDefault()
  dragState.value.x = event.clientX
  dragState.value.y = event.clientY
  hotTargetId.value = getTargetAtPoint(event.clientX, event.clientY)
}

const finishDrag = (event: PointerEvent) => {
  if (!dragState.value || event.pointerId !== dragState.value.pointerId) return

  const item = dragState.value.item
  const targetId = getTargetAtPoint(event.clientX, event.clientY)
  cleanupDragListeners()

  if (targetId === item.category) {
    placeItem(item, targetId)
  } else {
    rejectItem(targetId)
  }

  dragState.value = null
  hotTargetId.value = null
}

const cancelDrag = () => {
  cleanupDragListeners()
  dragState.value = null
  hotTargetId.value = null
}

const cleanupDragListeners = () => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', finishDrag)
  window.removeEventListener('pointercancel', cancelDrag)
}

const getTargetAtPoint = (x: number, y: number): ClassifyCategory | null => {
  const element = document.elementFromPoint(x, y)
  const target = element?.closest<HTMLElement>('[data-target-id]')
  const targetId = target?.dataset.targetId as ClassifyCategory | undefined
  return targetId || null
}

const placeItem = (item: ClassifyItem, targetId: ClassifyCategory) => {
  placedTargetByItem[item.id] = targetId
  lastSuccessTargetId.value = targetId
  audioManager.playSuccess()
  showFeedback('放好啦！', 'success')

  window.clearTimeout(sceneTimer)
  sceneTimer = window.setTimeout(() => {
    lastSuccessTargetId.value = null
  }, 520)

  if (unplacedItems.value.length === 0) {
    completeLevel()
  }
}

const rejectItem = (targetId: ClassifyCategory | null) => {
  errors.value += 1
  lastWrongTargetId.value = targetId
  trayShaking.value = true
  audioManager.playError()
  showFeedback('再试试', 'error')

  window.clearTimeout(sceneTimer)
  sceneTimer = window.setTimeout(() => {
    lastWrongTargetId.value = null
    trayShaking.value = false
  }, 520)
}

const showFeedback = (text: string, type: 'success' | 'error') => {
  feedbackText.value = text
  feedbackType.value = type
  window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => {
    feedbackText.value = ''
  }, 900)
}

const completeLevel = () => {
  const stars = errors.value === 0 ? 3 : errors.value <= 2 ? 2 : 1
  const timeSpent = Math.max(1, Math.round((Date.now() - startedAt.value) / 1000))
  const previousStars = storageManager.getGameProgress('classify')?.levels[level.value.level]?.stars || 0
  const nextReward = getReward(stars)
  const previousReward = getReward(previousStars)
  const deltaReward = Math.max(0, nextReward - previousReward)

  earnedStars.value = stars
  rewardStars.value = deltaReward
  storageManager.updateGameProgress('classify', level.value.level, {
    completed: true,
    stars,
    time: timeSpent
  })

  if (deltaReward > 0) {
    storageManager.addStars(deltaReward, `classify_level_${level.value.level}`)
  }

  totalStars.value = storageManager.getUserData().totalStars
  completed.value = true
  audioManager.playSuccess()
}

const getReward = (stars: number) => {
  if (stars >= 3) return STAR_REWARDS.game.threeStars
  if (stars === 2) return STAR_REWARDS.game.twoStars
  if (stars === 1) return STAR_REWARDS.game.oneStar
  return 0
}

const createRandomItems = (itemsPerCategory: number) => {
  const items = CLASSIFY_TARGETS.flatMap((target) => {
    const pool = CLASSIFY_ITEM_POOL[target.id]
    return shuffle(pool).slice(0, itemsPerCategory)
  })

  return shuffle(items)
}

const randomizeScenePositions = () => {
  const positions: ScenePositionClass[] = ['scene-position-a', 'scene-position-b', 'scene-position-c', 'scene-position-d']
  const shuffledPositions = shuffle(positions)

  CLASSIFY_TARGETS.forEach((target, index) => {
    scenePositionByTarget[target.id] = shuffledPositions[index]
  })
}

const shuffle = <T,>(items: T[]) => {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = current
  }

  return result
}
</script>

<style scoped lang="scss">
.classify-game {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  padding: max(10px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  background:
    linear-gradient(180deg, rgba(133, 204, 255, 0.62) 0 38%, transparent 38%),
    linear-gradient(180deg, #dff5ff 0%, #fff4d7 48%, #dff3c4 100%);
  overflow: hidden;
  touch-action: none;
}

.game-topbar {
  position: relative;
  z-index: 8;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 74px;
  padding: 10px 14px;
  border-radius: 26px;
}

.icon-button {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  color: #4a5f7a;
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff, #f1fbff);
  box-shadow: inset 0 -4px 0 rgba(93, 173, 226, 0.12), 0 8px 18px rgba(93, 173, 226, 0.14);

  &:active {
    transform: translateY(2px) scale(0.97);
  }
}

.title-block {
  min-width: 0;
  text-align: center;

  .level-label {
    color: #6f8299;
    font-size: 13px;
    font-weight: 900;
    line-height: 1.1;
  }

  h1 {
    margin: 2px 0 0;
    color: #36526b;
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-pill {
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  color: white;
  font-size: 20px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd35d, #ff9f43);
  box-shadow: inset 0 -5px 0 rgba(255, 140, 0, 0.2), 0 10px 22px rgba(255, 190, 60, 0.28);
}

.classify-stage {
  position: relative;
  z-index: 1;
  min-height: 0;
  border-radius: 30px;
}

.play-field {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 640px;
  border-radius: 30px;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.28) 0 2px, transparent 2px 44px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0 2px, transparent 2px 44px);
}

.drop-scene {
  position: absolute;
  width: min(28vw, 330px);
  min-width: 230px;
  height: min(30vh, 230px);
  min-height: 170px;
  padding: 0;
  border: 0;
  background: transparent;
  filter: drop-shadow(0 14px 18px rgba(74, 95, 122, 0.16));
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;

  &::after {
    content: '';
    position: absolute;
    left: 12%;
    right: 12%;
    bottom: 2px;
    z-index: 0;
    height: 26px;
    border-radius: 999px;
    background: radial-gradient(ellipse at center, rgba(75, 107, 68, 0.22), rgba(75, 107, 68, 0));
    transform: rotate(var(--scene-shadow-rotate, 0deg));
    pointer-events: none;
  }
}

.drop-scene.is-hot {
  transform: translateY(-4px) scale(1.025);
  filter: drop-shadow(0 16px 22px rgba(74, 95, 122, 0.22)) saturate(1.08);

  &::after {
    background: radial-gradient(ellipse at center, rgba(255, 211, 93, 0.46), rgba(255, 211, 93, 0));
  }
}

.drop-scene.is-correct {
  animation: scene-pop 0.48s ease;
}

.drop-scene.is-wrong {
  animation: scene-wrong 0.42s ease;
}

.scene-position-a {
  top: 14px;
  left: 18px;
}

.scene-position-b {
  top: 14px;
  right: 18px;
}

.scene-position-c {
  bottom: 16px;
  left: 18px;
}

.scene-position-d {
  right: 18px;
  bottom: 16px;
}

.fruit-scene {
  --scene-label-bg: rgba(255, 247, 218, 0.88);
  --scene-label-color: #8b5434;
  --scene-rotate: -2deg;
  --scene-shadow-rotate: -2deg;
  --placed-top: 22%;
  --placed-bottom: 28%;
}

.vegetable-scene {
  --scene-label-bg: rgba(237, 255, 220, 0.9);
  --scene-label-color: #487234;
  --scene-rotate: 2deg;
  --scene-shadow-rotate: 2deg;
  --placed-top: 24%;
  --placed-bottom: 24%;
}

.animal-scene {
  --scene-label-bg: rgba(231, 248, 255, 0.9);
  --scene-label-color: #3f667d;
  --scene-rotate: -1deg;
  --scene-shadow-rotate: -1deg;
  --placed-top: 30%;
  --placed-bottom: 24%;
}

.vehicle-scene {
  --scene-label-bg: rgba(238, 244, 252, 0.9);
  --scene-label-color: #4c5d72;
  --scene-rotate: 1.5deg;
  --scene-shadow-rotate: 1.5deg;
  --placed-top: 36%;
  --placed-bottom: 18%;
}

.scene-art {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform: rotate(var(--scene-rotate, 0deg));
  transform-origin: 50% 68%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }
}

.scene-copy {
  position: absolute;
  left: 50%;
  bottom: 4px;
  z-index: 5;
  display: grid;
  gap: 2px;
  justify-items: center;
  min-width: 86px;
  padding: 5px 11px;
  border: 2px solid rgba(255, 255, 255, 0.82);
  border-radius: 999px;
  color: var(--scene-label-color, #36526b);
  text-align: center;
  transform: translateX(-50%);
  background: var(--scene-label-bg, rgba(255, 255, 255, 0.88));
  box-shadow: 0 8px 16px rgba(74, 95, 122, 0.14);
  backdrop-filter: blur(6px);

  h2 {
    margin: 0;
    color: inherit;
    font-size: clamp(17px, 2.4vw, 22px);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: 0;
  }

  p {
    display: none;
    color: currentColor;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.2;
  }
}

.placed-items {
  position: absolute;
  top: var(--placed-top, 20%);
  right: 18px;
  bottom: var(--placed-bottom, 26%);
  left: 18px;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  pointer-events: none;
}

.placed-item {
  width: clamp(42px, 5.6vw, 62px);
  height: clamp(42px, 5.6vw, 62px);
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.36));
  box-shadow: 0 8px 14px rgba(74, 95, 122, 0.12);
  animation: item-land 0.34s ease;

  img {
    width: 82%;
    height: 82%;
    object-fit: contain;
  }
}

.center-nest {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 4;
  width: min(42vw, 500px);
  min-width: 350px;
  min-height: 330px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  padding: 18px;
  border-radius: 34px;
  transform: translate(-50%, -50%);
  text-align: center;

  > p {
    color: #4a5f7a;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 900;
    line-height: 1.2;
  }
}

.item-tray {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  align-content: center;
}

.item-tray.is-shaking {
  animation: tray-shake 0.42s ease;
}

.drag-card {
  min-width: 0;
  aspect-ratio: 1 / 1.08;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  align-items: center;
  justify-items: center;
  gap: 3px;
  padding: 8px 6px 7px;
  border: 0;
  border-radius: 22px;
  color: #36526b;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.1;
  cursor: grab;
  background: linear-gradient(135deg, #ffffff, #f8fdff);
  box-shadow: inset 0 -5px 0 rgba(93, 173, 226, 0.1), 0 10px 18px rgba(74, 95, 122, 0.13);
  touch-action: none;
  transition: opacity 0.12s ease, transform 0.12s ease;

  img {
    width: min(66px, 80%);
    height: min(66px, 80%);
    object-fit: contain;
    pointer-events: none;
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.96);
  }
}

.drag-card.is-dragging-source {
  opacity: 0.32;
}

.drag-ghost {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  width: 104px;
  height: 112px;
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: center;
  padding: 10px 8px 8px;
  border-radius: 26px;
  color: #36526b;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.1;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 36px rgba(74, 95, 122, 0.24);
  pointer-events: none;
  translate: -50% -68%;

  img {
    width: 74px;
    height: 74px;
    object-fit: contain;
  }
}

.feedback-bubble {
  position: fixed;
  left: 50%;
  top: 92px;
  z-index: 45;
  min-width: 112px;
  padding: 9px 18px;
  border-radius: 999px;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
  box-shadow: 0 12px 22px rgba(74, 95, 122, 0.16);
  animation: feedback-in 0.22s ease;
}

.feedback-bubble.success {
  background: linear-gradient(135deg, #63d471, #3fc0a2);
}

.feedback-bubble.error {
  background: linear-gradient(135deg, #ffb86b, #ff7f7f);
}

.complete-layer {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(73, 96, 120, 0.28);
  backdrop-filter: blur(8px);
}

.complete-card {
  width: min(420px, 100%);
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 28px 24px;
  border-radius: 34px;
  text-align: center;
  animation: complete-pop 0.3s ease;

  h2 {
    margin: 0;
    color: #36526b;
    font-size: clamp(34px, 8vw, 48px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: 0;
  }
}

.complete-eyebrow {
  display: inline-flex;
  padding: 5px 13px;
  border-radius: 999px;
  color: #3f8b80;
  font-size: 14px;
  font-weight: 900;
  background: rgba(99, 212, 113, 0.16);
}

.earned-stars {
  display: flex;
  gap: 6px;
  font-size: 34px;
  line-height: 1;

  .dim {
    filter: grayscale(1);
    opacity: 0.35;
  }
}

.reward-line {
  color: #5d6d7e;
  font-size: 18px;
  font-weight: 900;
}

.complete-actions {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.primary-action,
.secondary-action {
  min-height: 54px;
  border: 0;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(2px) scale(0.98);
  }
}

.primary-action {
  color: white;
  background: linear-gradient(135deg, #5dade2, #7dd6c8);
  box-shadow: 0 10px 18px rgba(93, 173, 226, 0.24);
}

.secondary-action {
  color: #4a5f7a;
  background: #eef8ff;
}

@media (min-width: 900px) and (max-width: 1400px) {
  .play-field {
    min-height: 610px;
  }

  .drop-scene {
    width: 30vw;
    min-width: 250px;
  }

  .center-nest {
    width: 38vw;
    min-width: 360px;
  }
}

@media (max-width: 820px) {
  .classify-game {
    overflow: auto;
    touch-action: pan-y;
  }

  .game-topbar {
    position: sticky;
    top: max(8px, env(safe-area-inset-top));
  }

  .play-field {
    min-height: 820px;
  }

  .drop-scene {
    width: calc(50% - 18px);
    min-width: 0;
    height: 190px;
    min-height: 0;
    padding: 10px;
    border-radius: 24px;
  }

  .scene-position-a {
    top: 8px;
    left: 8px;
  }

  .scene-position-b {
    top: 8px;
    right: 8px;
  }

  .scene-position-c {
    top: 214px;
    left: 8px;
    bottom: auto;
  }

  .scene-position-d {
    top: 214px;
    right: 8px;
    bottom: auto;
  }

  .center-nest {
    top: 530px;
    width: calc(100% - 24px);
    min-width: 0;
    min-height: 250px;
  }

}

@media (max-width: 430px) {
  .classify-game {
    gap: 8px;
    padding: max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
  }

  .game-topbar {
    min-height: 58px;
    gap: 7px;
    padding: 7px 8px;
    border-width: 3px;
    border-radius: 20px;
  }

  .icon-button {
    width: 42px;
    height: 42px;
    font-size: 22px;
  }

  .title-block {
    .level-label {
      font-size: 11px;
    }

    h1 {
      font-size: 21px;
    }
  }

  .status-group {
    gap: 5px;
  }

  .status-pill {
    min-height: 42px;
    padding: 6px 9px;
    font-size: 15px;
  }

  .reset-button {
    display: none;
  }

  .play-field {
    min-height: 760px;
    border-radius: 22px;
  }

  .drop-scene {
    width: calc(50% - 9px);
    height: 166px;
    padding: 8px;
    border-width: 3px;
    border-radius: 21px;
  }

  .scene-position-a {
    top: 4px;
    left: 4px;
  }

  .scene-position-b {
    top: 4px;
    right: 4px;
  }

  .scene-position-c {
    top: 182px;
    left: 4px;
  }

  .scene-position-d {
    top: 182px;
    right: 4px;
  }

  .scene-copy {
    h2 {
      font-size: 18px;
    }

    p {
      font-size: 11px;
    }
  }

  .placed-items {
    top: var(--placed-top, 20%);
    right: 8px;
    bottom: var(--placed-bottom, 26%);
    left: 8px;
    gap: 2px;
  }

  .placed-item {
    width: 40px;
    height: 40px;
  }

  .center-nest {
    top: 490px;
    width: calc(100% - 8px);
    min-height: 248px;
    padding: 13px 10px;
    border-width: 3px;
    border-radius: 24px;

    > p {
      font-size: 20px;
    }
  }

  .item-tray {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 7px;
  }

  .drag-card {
    border-radius: 18px;
    padding: 6px 4px 5px;
    font-size: 11px;

    img {
      width: min(52px, 82%);
      height: min(52px, 82%);
    }
  }

  .drag-ghost {
    width: 86px;
    height: 94px;
    border-radius: 22px;
    font-size: 12px;

    img {
      width: 60px;
      height: 60px;
    }
  }

  .feedback-bubble {
    top: 76px;
    font-size: 17px;
  }

  .complete-actions {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 900px) and (orientation: portrait) {
  .play-field {
    min-height: 900px;
  }

  .drop-scene {
    width: calc(50% - 32px);
    max-width: none;
    height: 250px;
  }

  .scene-position-a {
    top: 22px;
    left: 22px;
  }

  .scene-position-b {
    top: 22px;
    right: 22px;
  }

  .scene-position-c {
    bottom: 22px;
    left: 22px;
    top: auto;
  }

  .scene-position-d {
    right: 22px;
    bottom: 22px;
    top: auto;
  }

  .center-nest {
    width: min(560px, 58vw);
    min-height: 370px;
  }
}

@media (orientation: landscape) and (max-height: 720px) {
  .classify-game {
    gap: 8px;
  }

  .game-topbar {
    min-height: 56px;
    padding: 6px 10px;
    border-radius: 22px;
  }

  .icon-button {
    width: 42px;
    height: 42px;
    font-size: 21px;
  }

  .status-pill {
    min-height: 42px;
    font-size: 16px;
  }

  .play-field {
    min-height: 0;
    height: calc(100dvh - 88px);
  }

  .drop-scene {
    height: min(31vh, 188px);
    min-height: 132px;
    padding: 9px;
    border-radius: 22px;
  }

  .scene-copy h2 {
    font-size: 20px;
  }

  .scene-copy p {
    display: none;
  }

  .center-nest {
    width: min(38vw, 430px);
    min-width: 310px;
    min-height: 250px;
    padding: 12px;
    border-radius: 26px;

    > p {
      font-size: 20px;
    }
  }

  .drag-card {
    border-radius: 18px;
    font-size: 11px;

    img {
      width: min(54px, 76%);
      height: min(54px, 76%);
    }
  }

  .placed-items {
    bottom: var(--placed-bottom, 24%);
  }

  .placed-item {
    width: 46px;
    height: 46px;
  }
}

@keyframes scene-pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}

@keyframes scene-wrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

@keyframes item-land {
  from {
    transform: translateY(-12px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes tray-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

@keyframes feedback-in {
  from {
    transform: translate(-50%, -10px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
}

@keyframes complete-pop {
  from {
    transform: translateY(14px) scale(0.94);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
