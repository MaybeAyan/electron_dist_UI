<template>
  <div>
    <t-dialog
      v-model:visible="visible"
      attach="body"
      header="游戏配置"
      destroy-on-close
      :cancelBtn="null"
      @close="handleCancel"
      :confirmBtn="null"
    >
      <t-card>
        <t-form colon :data="game" :rules="cfgRules" @submit="onSubmit" ref="form">
          <t-form-item
            v-for="item in Object.keys(game)"
            :key="item"
            :label="cfgConstants[item as keyof typeof cfgConstants]"
            :name="item.toString()"
            :requiredMark="requireCfgMaps.includes(item)"
          >
            <t-select v-model="game[item]" v-if="item === 'virtualPayEnv'">
              <t-option :key="0" :value="0" label="正式环境">正式环境</t-option>
              <t-option :key="1" :value="1" label="沙箱环境">沙箱环境</t-option>
            </t-select>
            <t-input
              v-else
              v-model="game[item]"
              :disabled="readonlyKeys.includes(item)"
              :placeholder="`请输入${cfgConstants[item as keyof typeof cfgConstants]}`"
            />
          </t-form-item>
          <t-form-item>
            <t-button type="submit" theme="primary">确认</t-button>
          </t-form-item>
        </t-form>
      </t-card>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { IgameJsonCfg } from '../types'
import { cfgConstants, requireCfgMaps, cfgRules, readonlyKeys } from '@/enums/globalConstant'
import { MessagePlugin, type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

const { ipcRenderer } = require('electron')

type Props = {
  record: IgameJsonCfg
  flag: number
}

const props = defineProps<Props>()

const form = ref<FormInstanceFunctions | null>(null)

const visible = defineModel()

const handleCancel = () => {
  visible.value = false
  Object.assign(game, initRecordData())
}

const initRecordData = (): IgameJsonCfg => {
  return {
    appId: '',
    channelId: '',
    AppKey: '',
    AbSdkServerAddress: '',
    offerId: '',
    virtualPayEnv: 0,
    gameVersion: '',
    version: ''
  }
}

const game: IgameJsonCfg = reactive(initRecordData())

watch(
  () => props.flag,
  () => {
    Object.assign(game, props.record.data)
  },
  {
    deep: true
  }
)

const emit = defineEmits(['flash'])

const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError, e }) => {
  e?.preventDefault()
  if (validateResult === true) {
    try {
      writeConfg()
    } catch (error) {
      console.error(error)
    }
  } else {
    MessagePlugin.warning(firstError + '')
  }
}

const writeConfg = async () => {
  try {
    const obj: Record<string, any> = {}
    Object.assign(obj, game)
    const res = await ipcRenderer.invoke('write-config', game.channelId, obj)
    if (res.code === 200) {
      emit('flash')
      visible.value = false
      MessagePlugin.success('配置成功')
      Object.assign(form, initRecordData())
    }
  } catch (error) {
    console.error(error)
    MessagePlugin.error('写入配置失败')
  }
}
</script>

<style lang="less" scoped></style>
