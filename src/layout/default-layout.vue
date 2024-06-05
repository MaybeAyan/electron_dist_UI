<template>
  <t-layout class="layout">
    <!-- v-model:collapsed="collapsed" -->
    <t-aside>
      <div class="logo">
        <!-- <p v-show="!collapsed">OnlySDK</p> -->
        <!-- <p>OnlySDK</p> -->
        <p></p>
      </div>
      <MenuView />
    </t-aside>
    <t-layout>
      <t-header class="header"> </t-header>
      <t-content>
        <PageLayout />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MenuView from './components/MenuNav.vue'
import PageLayout from './page-layout.vue'
import { useWatchWindow } from '@/hooks/web/useWatchWindow'

const collapsed = ref<boolean>(false)

const { foldMenu } = useWatchWindow()

window.addEventListener('resize', () => {
  foldMenu(
    () => {
      collapsed.value = true
    },
    () => {
      collapsed.value = false
    }
  )
})
</script>

<style lang="less">
.logo {
  text-align: center;
  margin-left: -120px;
  height: 30px;
}
</style>
