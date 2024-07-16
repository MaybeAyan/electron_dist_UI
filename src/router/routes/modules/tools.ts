export default {
  path: '/tool',
  name: 'tool',
  component: () => import('@/views/tool/koutu/index.vue'),
  meta: {
    title: '工具',
    icon: 'CalendarTwoTone',
    order: 1,
    roles: ['admin']
  },
  children: [
    {
      path: '/tool/koutu',
      name: 'koutu',
      component: () => import('@/views/tool/koutu/index.vue'),
      meta: {
        title: '抠图工具',
        icon: 'CalendarTwoTone',
        order: 1,
        roles: ['admin']
      }
    }
  ]
}
