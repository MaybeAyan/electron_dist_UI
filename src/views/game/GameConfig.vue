<template>
  <div>
    <t-card>
      <span>游戏配置</span>
      <!-- <t-button class="btn" @click="handleClick" variant="outline">读取配置</t-button> -->
      <t-button class="btn" @click="() => (visible = true)" variant="outline">新增游戏</t-button>
      <div class="cards">
        <t-card
          v-for="item in games"
          :key="item.channelId"
          class="game_cfg"
          @click="setJson(item.channelId)"
        >
          <div class="warp">
            <div class="texts">
              <span>{{ item.channelId }}</span>
              <br />
              <span class="title">{{ item.name }}</span>
            </div>
            <div @click.stop="handleDelete(item.channelId)" class="mb-2">
              <DeleteIcon />
            </div>
          </div>
        </t-card>
      </div>
    </t-card>

    <AddGameModal v-model="visible" @flash="handleClick" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AddGameModal from './components/AddGameModal.vue'
import { DeleteIcon } from 'tdesign-icons-vue-next'
import useConfirmDia from '@/hooks/useConfirmDia'
import type { Games, IGameJson } from './types'
import { useRouter } from 'vue-router'

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
  console.log(id)
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
</script>

<style lang="less" scoped>
.btn {
  margin-left: 20px;
}

.cards {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;

  .game_cfg {
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
    min-width: 180px;
    height: auto;

    .warp {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .texts {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .title {
          font-weight: 550;
          margin-top: -15px;
        }
      }
    }
  }
}
</style>
