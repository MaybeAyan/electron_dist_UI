<template>
  <div>
    <t-menu v-model="selectedKey">
      <template v-for="item in menuTree" :key="item.name">
        <div v-if="!item.children">
          <t-menu-item :value="item.name" @click="goto(item)">
            <template #icon>
              <component :is="item.meta?.icon"></component>
            </template>
            <div>
              {{ item.meta?.title }}
            </div>
          </t-menu-item>
        </div>

        <div v-else>
          <t-submenu :value="item.name" :title="item.meta?.title" @click="goto(item)">
            <t-menu-item
              v-for="ite in item.children"
              :key="ite.name"
              :value="ite.name"
              @click="goto(ite)"
            >
              {{ ite.meta?.title }}
            </t-menu-item>
          </t-submenu>
        </div>
      </template>
    </t-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw, RouteRecordNormalized } from 'vue-router'
import { listenerRouteChange } from '@/utils/route-listener'

const router = useRouter()

// 前端表
const appRoute = computed(() => {
  return router.getRoutes().find((el) => el.name === 'root') as RouteRecordNormalized
})

const menuTree = computed(() => {
  const copyRouter = JSON.parse(JSON.stringify(appRoute.value.children))
  copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
    return (a.meta.order || 0) - (b.meta.order || 0)
  })
  function travel(_routes: RouteRecordRaw[], layer: number) {
    if (!_routes) return null
    const collector: any = _routes.map((element) => {
      if (!element.children) {
        return element
      }

      // 通过meta筛选隐藏菜单
      element.children = element.children.filter((x) => x.meta?.hideInMenu !== true)

      const subItem = travel(element.children, layer)
      if (subItem.length) {
        element.children = subItem
        return element
      }

      if (layer > 1) {
        element.children = subItem
        return element
      }

      if (element.meta?.hideInMenu === false) {
        return element
      }

      return null
    })
    return collector.filter(Boolean)
  }
  return travel(copyRouter, 0)
})

const goto = (ite: RouteRecordRaw) => {
  router.push({
    name: ite.name
  })
}

const selectedKey = ref<string>()

listenerRouteChange((newRoute) => {
  if (!newRoute.meta.hideMenu) {
    const key = newRoute.matched[newRoute.matched.length - 1]?.name as string
    selectedKey.value = key
  }
}, true)
</script>

<style lang="less" scoped></style>
