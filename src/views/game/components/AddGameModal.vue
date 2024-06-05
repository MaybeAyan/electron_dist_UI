<template>
  <div>
    <t-dialog
      v-model:visible="visible"
      attach="body"
      header="新增游戏"
      destroy-on-close
      :cancelBtn="null"
      @close="handleCancel"
      :confirmBtn="null"
    >
      <t-form
        ref="form"
        :data="game"
        class="mt-6"
        colon
        labelAlign="left"
        labelWidth="80px"
        :rules="rules"
        @submit="onSubmit"
      >
        <t-form-item label="游戏名" requiredMark name="name">
          <t-input clearable placeholder="请输入游戏名" v-model="game.name"
        /></t-form-item>
        <t-form-item label="appId" requiredMark name="appId">
          <t-input clearable placeholder="请输入appId" v-model="game.appId"
        /></t-form-item>
        <t-form-item label="渠道号" requiredMark name="channelId">
          <t-input clearable placeholder="请输入渠道号" v-model="game.channelId"
        /></t-form-item>
        <t-form-item>
          <t-button type="submit" theme="primary">确认</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { isNumber } from '@/utils/is'
import { MessagePlugin, type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
import { defineModel, reactive, ref } from 'vue'
import type { IGameJson } from '../types'

const { ipcRenderer } = require('electron')

const visible = defineModel<boolean>()

const form = ref<FormInstanceFunctions | null>(null)

const emit = defineEmits(['flash'])

const handleCancel = () => {
  visible.value = false
  Object.assign(game, initGame())
}

const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError, e }) => {
  e?.preventDefault()
  if (validateResult === true) {
    // 写入json
    try {
      createDirectory(game)
      writeData()
      emit('flash')
      visible.value = false
      MessagePlugin.success('提交成功')
      Object.assign(game, initGame())
    } catch (error) {
      console.error(error)
    }
  } else {
    MessagePlugin.warning(firstError + '')
  }
}

const createDirectory = async (json: typeof game) => {
  try {
    await ipcRenderer.invoke('create-directory', game.channelId, {
      appId: json.appId,
      channelId: json.channelId
    })
  } catch (error) {
    MessagePlugin.error('写入失败！')
  }
}

const writeData = async () => {
  try {
    const obj: Record<string, IGameJson> = {}
    obj[game.channelId!] = { name: game.name, appId: game.appId }
    await ipcRenderer.invoke('write-json', 'gameMap.json', obj)
  } catch (error) {
    MessagePlugin.error('写入【gameMap.json】数据失败')
  }
}

const initGame = (): {
  appId: string
  name: string
  channelId: string
} => {
  return {
    appId: '',
    name: '',
    channelId: ''
  }
}
const game = reactive(initGame())

const channelIdValidator = (val: string) => {
  const res = isNumber(val)
  if (!res) {
    return {
      result: false,
      message: '请输入数字',
      type: 'error'
    }
  } else {
    return { result: true, type: 'success' }
  }
}

const appIdValidator = (val: string) => {
  const res = isNumber(val)
  if (!res) {
    return {
      result: false,
      message: '请输入数字',
      type: 'error'
    }
  } else {
    return { result: true, type: 'success' }
  }
}

const rules = {
  name: [
    { required: true, message: '游戏名必填', type: 'error', trigger: 'blur' },
    { required: true, message: '游戏名必填', type: 'error', trigger: 'change' },
    { whitespace: true, message: '游戏名不能为空' }
  ],
  appId: [{ required: true, message: 'APPId不能为空' }, { validator: appIdValidator }],
  channelId: [{ required: true, message: '渠道号不能为空' }, { validator: channelIdValidator }]
}
</script>

<style lang="less" scoped></style>
