export default {
  path: '/demo',
  name: 'demo',
  component: () => import('@/views/demo/LongList.vue'),
  meta: {
    title: '优化Demo',
    icon: 'CalendarTwoTone',
    order: 1,
    roles: ['admin']
  },
  children: [
    {
      path: '/demo/longlist',
      name: 'longList',
      component: () => import('@/views/demo/LongList.vue'),
      meta: {
        title: '表格切片渲染',
        icon: 'icon-user',
        noAffix: false,
        order: 0
      }
    }
  ]
}
