<template>
  <router-view v-if="isRouterAlive" />
</template>

<script lang="ts" setup>
import { provide, nextTick, ref } from 'vue'

const isRouterAlive = ref<boolean>(true)
const reload = (): void => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('reload', reload)
</script>
