<template>
  <div class="puzzle-game" :style="rootStyle">
    <header class="game-topbar polished-panel">
      <button class="icon-button" aria-label="返回" @click="goBack">
        <span aria-hidden="true">←</span>
      </button>

      <div class="title-block">
        <p>第 {{ level.level }} / {{ PUZZLE_TOTAL_LEVELS }} 关</p>
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

    <main class="puzzle-stage">
      <section class="board-panel polished-panel" aria-label="拼图区域">
        <div class="board-title">
          <span>{{ level.imageName }}</span>
        </div>

        <div class="puzzle-board">
          <div
            v-for="slot in slots"
            :key="slot"
            class="puzzle-slot"
            :class="{
              'is-hot': hotSlotIndex === slot,
              'is-correct': lastSuccessSlotIndex === slot,
              'is-wrong': lastWrongSlotIndex === slot
            }"
            :data-slot-index="slot"
            role="group"
            :aria-label="`第${slot + 1}块位置`"
          >
            <div
              class="slot-guide"
              :style="pieceStyle(slot)"
              aria-hidden="true"
            ></div>
            <div
              v-if="placedPieceBySlot[slot]"
              class="placed-piece"
              :style="pieceStyle(slot)"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </section>

      <section class="piece-panel polished-panel" aria-label="拼图片区">
        <p>{{ level.prompt }}</p>
        <div class="piece-tray" :class="{ 'is-shaking': trayShaking }">
          <button
            v-for="piece in unplacedPieces"
            :key="piece.id"
            class="puzzle-piece"
            :class="{ 'is-dragging-source': dragState?.piece.id === piece.id }"
            type="button"
            :aria-label="`拖动第${piece.slotIndex + 1}块`"
            @pointerdown="startDrag($event, piece)"
          >
            <span :style="pieceStyle(piece.slotIndex)" aria-hidden="true"></span>
          </button>
        </div>
      </section>

      <div
        v-if="dragState"
        class="drag-ghost"
        :style="ghostStyle"
        aria-hidden="true"
      >
        <span :style="pieceStyle(dragState.piece.slotIndex)"></span>
      </div>

      <div v-if="feedbackText" class="feedback-bubble" :class="feedbackType">
        {{ feedbackText }}
      </div>
    </main>

    <div v-if="showWholeImage" class="whole-image-layer" role="status" aria-live="polite">
      <div class="whole-image-card polished-panel">
        <p class="complete-eyebrow">拼完整啦</p>
        <img :src="level.imageUrl" :alt="level.imageName" draggable="false" />
      </div>
    </div>

    <div v-if="completed" class="complete-layer" role="dialog" aria-modal="true" aria-labelledby="puzzle-complete-title">
      <div class="complete-card polished-panel">
        <p class="complete-eyebrow">拼好啦</p>
        <h2 id="puzzle-complete-title">真棒！</h2>
        <div class="complete-preview">
          <img :src="level.imageUrl" :alt="level.imageName" draggable="false" />
        </div>
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
import { PUZZLE_LEVELS, PUZZLE_TOTAL_LEVELS, createPuzzlePieces, type PuzzlePiece } from '@/config/puzzle-game'
import { STAR_REWARDS } from '@/config/games'
import { audioManager } from '@/modules/common/utils/audio'
import { storageManager } from '@/modules/common/utils/storage'

interface DragState {
  piece: PuzzlePiece
  pointerId: number
  x: number
  y: number
}

const router = useRouter()
const currentLevelIndex = ref(0)
const level = computed(() => PUZZLE_LEVELS[currentLevelIndex.value])
const gridSize = computed(() => level.value.gridSize)
const activePieces = ref<PuzzlePiece[]>([])
const placedPieceBySlot = reactive<Record<number, string | null>>({})
const dragState = ref<DragState | null>(null)
const hotSlotIndex = ref<number | null>(null)
const lastSuccessSlotIndex = ref<number | null>(null)
const lastWrongSlotIndex = ref<number | null>(null)
const feedbackText = ref('')
const feedbackType = ref<'success' | 'error'>('success')
const trayShaking = ref(false)
const showWholeImage = ref(false)
const completed = ref(false)
const earnedStars = ref(0)
const rewardStars = ref(0)
const errors = ref(0)
const startedAt = ref(Date.now())
const totalStars = ref(0)
let feedbackTimer = 0
let slotTimer = 0
let completionTimer = 0

const hasNextLevel = computed(() => currentLevelIndex.value < PUZZLE_LEVELS.length - 1)
const unplacedPieces = computed(() => activePieces.value.filter(piece => !Object.values(placedPieceBySlot).includes(piece.id)))
const slots = computed(() => Array.from({ length: gridSize.value * gridSize.value }, (_, index) => index))

const rootStyle = computed(() => {
  const size = gridSize.value
  const slotRadius = size === 2 ? 22 : size === 3 ? 17 : 13
  const pieceRadius = size === 2 ? 18 : size === 3 ? 14 : 10
  const ghostSize = size === 2 ? 116 : size === 3 ? 96 : 78
  const trayColumns = size === 2 ? 2 : size === 3 ? 3 : 4
  const landscapeTrayColumns = size === 2 ? 4 : size === 3 ? 5 : 8

  return {
    '--theme-color': level.value.themeColor,
    '--grid-size': String(size),
    '--slot-radius': `${slotRadius}px`,
    '--piece-radius': `${pieceRadius}px`,
    '--ghost-size': `${ghostSize}px`,
    '--tray-columns': String(trayColumns),
    '--landscape-tray-columns': String(landscapeTrayColumns)
  }
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
  window.clearTimeout(slotTimer)
  window.clearTimeout(completionTimer)
})

const startLevel = () => {
  window.clearTimeout(completionTimer)
  activePieces.value = shuffle(createPuzzlePieces(gridSize.value))
  resetPlacements()
  dragState.value = null
  hotSlotIndex.value = null
  lastSuccessSlotIndex.value = null
  lastWrongSlotIndex.value = null
  feedbackText.value = ''
  trayShaking.value = false
  showWholeImage.value = false
  completed.value = false
  earnedStars.value = 0
  rewardStars.value = 0
  errors.value = 0
  startedAt.value = Date.now()
}

const resetPlacements = () => {
  Object.keys(placedPieceBySlot).forEach((slot) => {
    delete placedPieceBySlot[Number(slot)]
  })

  slots.value.forEach((slot) => {
    placedPieceBySlot[slot] = null
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

const startDrag = (event: PointerEvent, piece: PuzzlePiece) => {
  if (completed.value) return

  event.preventDefault()
  audioManager.playClick()
  dragState.value = {
    piece,
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
  hotSlotIndex.value = getSlotAtPoint(event.clientX, event.clientY)
}

const finishDrag = (event: PointerEvent) => {
  if (!dragState.value || event.pointerId !== dragState.value.pointerId) return

  const piece = dragState.value.piece
  const slotIndex = getSlotAtPoint(event.clientX, event.clientY)
  cleanupDragListeners()

  if (slotIndex === piece.slotIndex && !placedPieceBySlot[slotIndex]) {
    placePiece(piece, slotIndex)
  } else {
    rejectPiece(slotIndex)
  }

  dragState.value = null
  hotSlotIndex.value = null
}

const cleanupDragListeners = () => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', finishDrag)
  window.removeEventListener('pointercancel', cancelDrag)
}

const cancelDrag = () => {
  cleanupDragListeners()
  dragState.value = null
  hotSlotIndex.value = null
}

const getSlotAtPoint = (x: number, y: number) => {
  const element = document.elementFromPoint(x, y)
  const slot = element?.closest<HTMLElement>('[data-slot-index]')
  const value = slot?.dataset.slotIndex
  return value === undefined ? null : Number(value)
}

const placePiece = (piece: PuzzlePiece, slotIndex: number) => {
  placedPieceBySlot[slotIndex] = piece.id
  lastSuccessSlotIndex.value = slotIndex
  audioManager.playPuzzleMatch()
  showFeedback('拼上啦！', 'success')

  window.clearTimeout(slotTimer)
  slotTimer = window.setTimeout(() => {
    lastSuccessSlotIndex.value = null
  }, 520)

  if (slots.value.every(slot => placedPieceBySlot[slot])) {
    completeLevel()
  }
}

const rejectPiece = (slotIndex: number | null) => {
  errors.value += 1
  lastWrongSlotIndex.value = slotIndex
  trayShaking.value = true
  audioManager.playError()
  showFeedback('换个位置', 'error')

  window.clearTimeout(slotTimer)
  slotTimer = window.setTimeout(() => {
    lastWrongSlotIndex.value = null
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
  const previousStars = storageManager.getGameProgress('puzzle')?.levels[level.value.level]?.stars || 0
  const nextReward = getReward(stars)
  const previousReward = getReward(previousStars)
  const deltaReward = Math.max(0, nextReward - previousReward)

  earnedStars.value = stars
  rewardStars.value = deltaReward
  storageManager.updateGameProgress('puzzle', level.value.level, {
    completed: true,
    stars,
    time: timeSpent
  })

  if (deltaReward > 0) {
    storageManager.addStars(deltaReward, `puzzle_level_${level.value.level}`)
  }

  totalStars.value = storageManager.getUserData().totalStars
  showWholeImage.value = true
  audioManager.playSuccess()

  completionTimer = window.setTimeout(() => {
    showWholeImage.value = false
    completed.value = true
  }, 2000)
}

const getReward = (stars: number) => {
  if (stars >= 3) return STAR_REWARDS.game.threeStars
  if (stars === 2) return STAR_REWARDS.game.twoStars
  if (stars === 1) return STAR_REWARDS.game.oneStar
  return 0
}

const pieceStyle = (slotIndex: number) => {
  const size = gridSize.value
  const column = slotIndex % size
  const row = Math.floor(slotIndex / size)
  const denominator = size - 1
  const x = denominator === 0 ? 0 : (column / denominator) * 100
  const y = denominator === 0 ? 0 : (row / denominator) * 100

  return {
    backgroundImage: `url(${level.value.imageUrl})`,
    backgroundPosition: `${x}% ${y}%`,
    backgroundSize: `${size * 100}% ${size * 100}%`
  }
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
.puzzle-game {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  padding: max(10px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  background:
    radial-gradient(circle at 16% 16%, rgba(255, 232, 160, 0.48), transparent 24%),
    radial-gradient(circle at 86% 20%, rgba(148, 218, 255, 0.36), transparent 26%),
    linear-gradient(180deg, #e7f8ff 0%, #fff6df 48%, #e3f6d0 100%);
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
}

.title-block {
  min-width: 0;
  text-align: center;

  p {
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

.puzzle-stage {
  position: relative;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(320px, 520px) minmax(280px, 460px);
  justify-content: center;
  align-items: center;
  gap: clamp(14px, 3vw, 32px);
}

.board-panel,
.piece-panel {
  position: relative;
  z-index: 1;
  border-radius: 34px;
}

.board-panel {
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 18px;
}

.board-title {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 999px;
  color: #3f756d;
  font-size: 18px;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 8px 14px rgba(74, 95, 122, 0.1);
}

.puzzle-board {
  width: min(450px, 72dvh, 100%);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(var(--grid-size), minmax(0, 1fr));
  grid-template-rows: repeat(var(--grid-size), minmax(0, 1fr));
  gap: 8px;
  padding: 10px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.46));
  box-shadow: inset 0 -10px 0 rgba(105, 160, 150, 0.08), 0 18px 34px rgba(74, 95, 122, 0.14);
}

.puzzle-slot {
  position: relative;
  overflow: hidden;
  border: 3px dashed rgba(92, 142, 132, 0.28);
  border-radius: var(--slot-radius);
  background: rgba(255, 255, 255, 0.54);
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.puzzle-slot.is-hot {
  transform: scale(1.025);
  border-color: rgba(255, 174, 67, 0.7);
  box-shadow: 0 0 0 6px rgba(255, 211, 93, 0.22);
}

.puzzle-slot.is-correct {
  animation: slot-pop 0.42s ease;
}

.puzzle-slot.is-wrong {
  animation: slot-wrong 0.38s ease;
}

.slot-guide,
.placed-piece,
.puzzle-piece span,
.drag-ghost span {
  background-repeat: no-repeat;
}

.slot-guide {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  filter: grayscale(0.2);
}

.placed-piece {
  position: absolute;
  inset: 0;
  opacity: 1;
  animation: piece-land 0.26s ease;
}

.piece-panel {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 14px;
  padding: 20px;

  > p {
    color: #4a5f7a;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 900;
    line-height: 1.2;
    text-align: center;
  }
}

.piece-tray {
  display: grid;
  grid-template-columns: repeat(var(--tray-columns), minmax(0, 1fr));
  gap: 14px;
  align-content: center;
}

.piece-tray.is-shaking {
  animation: tray-shake 0.42s ease;
}

.puzzle-piece {
  min-width: 0;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 8px;
  border: 0;
  border-radius: 24px;
  cursor: grab;
  background: linear-gradient(135deg, #ffffff, #f5fcff);
  box-shadow: inset 0 -6px 0 rgba(93, 173, 226, 0.09), 0 12px 20px rgba(74, 95, 122, 0.13);
  touch-action: none;
  transition: opacity 0.12s ease, transform 0.12s ease;

  span {
    width: 100%;
    height: 100%;
    border-radius: var(--piece-radius);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.68);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.97);
  }
}

.puzzle-piece.is-dragging-source {
  opacity: 0.32;
}

.drag-ghost {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  width: var(--ghost-size);
  height: var(--ghost-size);
  display: grid;
  place-items: center;
  padding: 8px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 36px rgba(74, 95, 122, 0.24);
  pointer-events: none;
  translate: -50% -58%;

  span {
    width: 100%;
    height: 100%;
    border-radius: var(--piece-radius);
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

.whole-image-layer,
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

.whole-image-card {
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100dvh - 40px);
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: clamp(14px, 3vw, 24px);
  border-radius: 34px;
  animation: complete-pop 0.3s ease;

  img {
    width: 100%;
    max-height: min(68dvh, 560px);
    object-fit: contain;
    border-radius: 24px;
    box-shadow: 0 18px 34px rgba(74, 95, 122, 0.16);
  }
}

.complete-card {
  width: min(420px, 100%);
  display: grid;
  gap: 10px;
  justify-items: center;
  padding: 24px;
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

.complete-preview {
  width: 112px;
  height: 112px;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 18px rgba(74, 95, 122, 0.12);

  img {
    width: 86%;
    height: 86%;
    object-fit: contain;
  }
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

@media (max-width: 820px) {
  .puzzle-game {
    overflow: auto;
    touch-action: pan-y;
  }

  .game-topbar {
    position: sticky;
    top: max(8px, env(safe-area-inset-top));
  }

  .puzzle-stage {
    grid-template-columns: 1fr;
    align-content: start;
    gap: 12px;
  }

  .board-panel,
  .piece-panel {
    border-radius: 26px;
  }

  .board-panel {
    padding: 12px;
  }

  .puzzle-board {
    width: min(100%, 360px);
    gap: 6px;
    padding: 8px;
    border-radius: 24px;
  }

  .piece-panel {
    padding: 14px;

    > p {
      font-size: 20px;
    }
  }

  .piece-tray {
    gap: 8px;
  }

  .puzzle-piece {
    border-radius: 18px;
    padding: 6px;
  }
}

@media (orientation: portrait) and (min-width: 821px) and (max-width: 1180px) {
  .puzzle-game {
    overflow: auto;
    touch-action: pan-y;
  }

  .game-topbar {
    position: sticky;
    top: max(10px, env(safe-area-inset-top));
  }

  .puzzle-stage {
    grid-template-columns: 1fr;
    align-content: start;
    justify-items: center;
    gap: clamp(14px, 2vw, 22px);
  }

  .board-panel,
  .piece-panel {
    width: min(900px, 100%);
    border-radius: 30px;
  }

  .board-panel {
    padding: clamp(14px, 2vw, 20px);
  }

  .puzzle-board {
    width: min(620px, 76vw, 48dvh);
    gap: 7px;
    padding: 9px;
    border-radius: 26px;
  }

  .piece-panel {
    grid-template-rows: auto minmax(0, 1fr);
    gap: 12px;
    padding: clamp(14px, 2vw, 20px);

    > p {
      font-size: clamp(22px, 2.8vw, 28px);
    }
  }

  .piece-tray {
    grid-template-columns: repeat(var(--landscape-tray-columns), minmax(0, 1fr));
    gap: 10px;
    width: min(820px, 100%);
    justify-self: center;
  }

  .puzzle-piece {
    padding: 7px;
    border-radius: 20px;
  }
}

@media (max-width: 430px) {
  .puzzle-game {
    height: 100dvh;
    min-height: 0;
    gap: 8px;
    padding: max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
    overflow: hidden;
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
    p {
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

  .board-title {
    font-size: 15px;
  }

  .puzzle-board {
    width: min(100%, 292px);
    gap: 5px;
    padding: 7px;
  }

  .puzzle-slot {
    border-width: 2px;
  }

  .puzzle-piece span {
    border-radius: var(--piece-radius);
  }

  .puzzle-stage {
    min-height: 0;
    align-content: start;
    gap: 10px;
    overflow: hidden;
  }

  .board-panel {
    gap: 6px;
    padding: 8px;
  }

  .piece-panel {
    min-height: 0;
    gap: 8px;
    padding: 10px;

    > p {
      font-size: 18px;
      line-height: 1.15;
    }
  }

  .piece-tray {
    width: min(100%, 292px);
    justify-self: center;
  }

  .feedback-bubble {
    top: 76px;
    font-size: 17px;
  }

  .complete-actions {
    grid-template-columns: 1fr;
  }
}

@media (orientation: landscape) and (max-height: 480px) {
  .puzzle-game {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    gap: 6px;
    padding: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
  }

  .game-topbar {
    min-height: 42px;
    padding: 4px 8px;
    border-width: 2px;
    border-radius: 18px;
    gap: 8px;
  }

  .icon-button {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }

  .title-block {
    p {
      font-size: 10px;
    }

    h1 {
      font-size: clamp(17px, 3vw, 21px);
    }
  }

  .status-pill {
    min-height: 34px;
    padding: 4px 9px;
    font-size: 13px;
  }

  .reset-button {
    display: none;
  }

  .puzzle-stage {
    grid-template-columns: minmax(230px, 34%) minmax(0, 1fr);
    gap: 10px;
    height: calc(100dvh - 64px);
    align-items: stretch;
    overflow: hidden;
  }

  .board-panel,
  .piece-panel {
    min-height: 0;
    padding: 8px;
    border-width: 2px;
    border-radius: 18px;
  }

  .board-title {
    display: none;
  }

  .puzzle-board {
    width: min(100%, calc(100dvh - 84px));
    align-self: center;
    gap: 5px;
    padding: 6px;
    border-radius: 18px;
  }

  .puzzle-slot {
    border-width: 2px;
    border-radius: var(--slot-radius);
  }

  .piece-panel {
    grid-template-rows: auto minmax(0, 1fr);
    gap: 6px;
    overflow: hidden;

    > p {
      font-size: clamp(15px, 2.8vw, 18px);
      line-height: 1.1;
    }
  }

  .piece-tray {
    grid-template-columns: repeat(var(--landscape-tray-columns), minmax(0, 1fr));
    gap: 6px;
    min-height: 0;
    align-content: center;
  }

  .puzzle-piece {
    padding: 5px;
    border-radius: 14px;

    span {
      border-radius: var(--piece-radius);
    }
  }

  .drag-ghost {
    border-radius: 18px;
  }

  .feedback-bubble {
    top: 48px;
    padding: 6px 14px;
    font-size: 15px;
  }

  .complete-card {
    width: min(360px, 92vw);
    padding: 16px 18px;
    gap: 8px;

    h2 {
      font-size: 30px;
    }
  }

  .whole-image-card {
    width: min(520px, 92vw);
    max-height: calc(100dvh - 24px);
    padding: 12px;
    border-radius: 22px;

    img {
      max-height: 66dvh;
      border-radius: 18px;
    }
  }

  .complete-preview {
    width: 74px;
    height: 74px;
    border-radius: 20px;
  }

  .earned-stars {
    font-size: 26px;
  }

  .primary-action,
  .secondary-action {
    min-height: 42px;
    font-size: 15px;
  }
}

@keyframes slot-pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}

@keyframes slot-wrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

@keyframes piece-land {
  from {
    transform: translateY(-10px) scale(0.86);
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
