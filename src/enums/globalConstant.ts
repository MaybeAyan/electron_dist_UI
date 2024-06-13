import { isNumber } from '@/utils/is'

export const cfgConstants = {
  AbSdkServerAddress: '服务器域名',
  AppKey: 'AppKey',
  appId: '游戏Id',
  channelId: '渠道Id',
  gameVersion: '游戏版本',
  offerId: '虚拟支付id',
  version: 'SDK版本号',
  virtualPayEnv: '支付环境'
}

export const requireCfgMaps = [
  'AbSdkServerAddress',
  'AppKey',
  'appId',
  'channelId',
  'offerId',
  'virtualPayEnv'
]

export const readonlyKeys = ['appId', 'channelId']

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

const commonRequireValidator = (val: string) => {
  return [
    { required: true, message: `${val}必填`, type: 'error', trigger: 'blur' },
    { required: true, message: `${val}必填`, type: 'error', trigger: 'change' },
    { whitespace: true, message: `${val}不能为空` }
  ]
}

export const cfgRules = {
  AppKey: commonRequireValidator('AppKey'),
  appId: [{ required: true, message: 'APPId不能为空' }, { validator: appIdValidator }],
  channelId: [{ required: true, message: '渠道号不能为空' }, { validator: channelIdValidator }],
  AbSdkServerAddress: commonRequireValidator('服务器地址'),
  offerId: commonRequireValidator('虚拟支付id'),
  virtualPayEnv: commonRequireValidator('支付环境')
}

export const virtualPayEnvMap = ['正式环境', '沙箱环境']
