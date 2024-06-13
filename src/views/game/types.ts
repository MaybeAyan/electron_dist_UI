export type Games = {
  name: string
  channelId: string | number
  appId: string | number
}

export type IGameJson = {
  name: string
  appId: string | number
}

export interface IEdit {
  visible: boolean
  flag: number
  record: IgameJsonCfg
}

export type IgameJsonCfg = {
  [key: string]: string | number
  appId: string | number
  AppKey: string
  channelId: string | number
  version: string
  AbSdkServerAddress: string
  offerId: string | number
  virtualPayEnv: string | number
  gameVersion: string
}
