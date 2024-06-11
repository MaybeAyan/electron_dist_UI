<template>
  <div>
    <t-card>
      <span>游戏配置</span>
      <t-button class="btn" @click="handleShow()" variant="outline">新增游戏</t-button>
      <div class="mt-4">
        <t-table
          row-key="channelId"
          :data="games"
          :columns="gameColumns"
          stripe
          hover
          cell-empty-content="-"
          lazy-load
        >
          <template #operation="{ row }: { row: Games }">
            <div class="flex">
              <div>
                <t-button
                  class="mr-4"
                  size="small"
                  variant="outline"
                  theme="primary"
                  @click="setJson(row.channelId)"
                  >配置</t-button
                >
              </div>
              <div class="cursor-pointer mr-4" @click="handleEdit(row)">
                <EditIcon />
              </div>
              <div class="cursor-pointer" @click="handleDelete(row.channelId)"><DeleteIcon /></div>
            </div>
          </template>
        </t-table>
      </div>
    </t-card>

    <AddGameModal
      v-model="visible"
      @flash="handleClick"
      :record="record"
      :isAdd="isAdd"
      :flag="flag"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AddGameModal from './components/AddGameModal.vue'
import { DeleteIcon, EditIcon } from 'tdesign-icons-vue-next'
import useConfirmDia from '@/hooks/useConfirmDia'
import type { Games, IGameJson } from './types'
import { useRouter } from 'vue-router'
import { gameColumns } from './constant/index'

const { handleConfirm } = useConfirmDia()

const { ipcRenderer } = require('electron')

const directories = ref<string[]>([])

const gameList = ref<Record<string, IGameJson>>()

const fetchDirectories = async () => {
  try {
    const result = await ipcRenderer.invoke('list-directories', 'config')
    directories.value = result

    const { data } = await ipcRenderer.invoke('read-json', 'gameMap.json')
    gameList.value = data
    games.value = []
    directories.value.forEach((ite) => {
      const temp = games.value.map((ite) => ite.channelId)
      if (!temp.includes(ite)) {
        games.value.push({
          name: gameList.value![ite].name,
          channelId: ite,
          appId: gameList.value![ite].appId
        })
      }
    })
  } catch (error) {
    console.error('读取目录失败：', error)
  }
}

const handleClick = async () => {
  await fetchDirectories()
}

fetchDirectories()

const games = ref<Games[]>([])

const visible = ref<boolean>(false)

const handleDelete = async (id: string | number) => {
  handleConfirm({
    title: '删除',
    body: '是否确认删除该游戏',
    cancelTxt: '取消',
    confirmTxt: '确认',
    onConfirm: () => delJsonByChannelId(id.toString())
  })
}

const delJsonByChannelId = async (id: string) => {
  const res = await ipcRenderer.invoke('delete-json', 'gameMap.json', id)
  if (res.code === 200) {
    const res = await ipcRenderer.invoke('delete-directory', id)
    if (res.code === 200) {
      await fetchDirectories()
    }
  }
}

const router = useRouter()

const setJson = async (id: string | number) => {
  router.push({
    path: './json',
    query: {
      channelId: id
    }
  })
}

const isAdd = ref(false)
const record = ref<Games>()
const flag = ref(1)

const handleShow = () => {
  isAdd.value = true
  visible.value = true
}

const handleEdit = (input: Games) => {
  flag.value++
  record.value = input
  isAdd.value = false
  visible.value = true
}
</script>

<style lang="less" scoped>
.btn {
  margin-left: 20px;
}
</style>
