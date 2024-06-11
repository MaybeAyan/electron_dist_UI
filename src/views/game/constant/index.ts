import { isNumber } from '@/utils/is'
import type { TableProps } from 'tdesign-vue-next'

export const gameColumns: TableProps['columns'] = [
  {
    colKey: 'appId',
    title: '游戏ID'
  },
  {
    colKey: 'channelId',
    title: '渠道ID'
  },
  {
    colKey: 'name',
    title: '游戏名称'
  },
  {
    colKey: 'operation',
    title: '操作',
    fixed: 'right'
  }
]

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

export const rules = {
  name: [
    { required: true, message: '游戏名必填', type: 'error', trigger: 'blur' },
    { required: true, message: '游戏名必填', type: 'error', trigger: 'change' },
    { whitespace: true, message: '游戏名不能为空' }
  ],
  appId: [{ required: true, message: 'APPId不能为空' }, { validator: appIdValidator }],
  channelId: [{ required: true, message: '渠道号不能为空' }, { validator: channelIdValidator }]
}
