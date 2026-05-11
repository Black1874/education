<template>
  <div class="login-page">
    <h1>登录页 - 开发中</h1>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.login-page {
  padding: 40px;
  text-align: center;
}
</style>
