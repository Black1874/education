<template>
  <div class="game-detail-page">
    <h1>游戏详情页 - 开发中</h1>
    <p>游戏ID: {{ gameId }}</p>
    <button @click="goBack">返回</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const gameId = route.params.gameId

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.game-detail-page {
  padding: 40px;
  text-align: center;
}
</style>
