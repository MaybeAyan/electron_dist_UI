import { defineStore } from 'pinia'
import type { UserInfoState } from './types'
import { Names } from '@/store/store-name'

const useUserStore = defineStore(Names.USER, {
  state: (): UserInfoState => {
    return {
      allow_uid: 0,
      is_admin: true,
      menus: []
    }
  },
  getters: {},
  actions: {}
})

export default useUserStore
