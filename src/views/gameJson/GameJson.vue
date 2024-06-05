<template>
  <div>
    <t-card>游戏JSON配置</t-card>
    <t-card></t-card>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

watch(
  () => router.currentRoute.value.query,
  (newValue) => {
    console.log(newValue.channelId)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="less" scoped></style>
