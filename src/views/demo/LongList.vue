<template>
  <div>
    <t-card>
      <t-button @click="handleQuery">直接请求10000条数据</t-button>
      <t-button class="ml-6" @click="handleQueryForSlice">切片渲染</t-button>
      <t-button class="ml-6" @click="reset">清空</t-button>

      <t-table
        class="mt-6"
        row-key="index"
        stripe
        hover
        :data="data"
        :columns="columns"
        cell-empty-content="-"
        lazy-load
      >
      </t-table>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const columns = [
  { colKey: 'index', title: '索引' },
  { colKey: 'txt', title: '数据' },
  { colKey: 'xx', title: '测试' },
  { colKey: 'xx2', title: '测试2' },
  { colKey: 'xx3', title: '测试3' },
  { colKey: 'xx4', title: '测试4' },
  { colKey: 'xx5', title: '测试5' },
  { colKey: 'xx6', title: '测试6' },
  { colKey: 'xx7', title: '测试7' },
  { colKey: 'xx8', title: '测试8' },
  { colKey: 'xx9', title: '测试9' },
  { colKey: 'xx10', title: '测试10' },
  { colKey: 'xx11', title: '测试11' }
]

const data: any = ref([])

const mockData = () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 10000 }, (_, index) => ({
          index: index + 1,
          txt: `数据${index + 1}`,
          xx: `测试${index + 1}`,
          xx2: `测试${index + 1}`,
          xx3: `测试${index + 1}`,
          xx4: `测试${index + 1}`,
          xx5: `测试${index + 1}`,
          xx6: `测试${index + 1}`,
          xx7: `测试${index + 1}`,
          xx8: `测试${index + 1}`,
          xx9: `测试${index + 1}`,
          xx10: `测试${index + 1}`,
          xx11: `测试${index + 1}`
        }))
      )
    }, 2000)
  })
}

const handleQuery = async () => {
  const res = await mockData()
  data.value = res
}

const handleQueryForSlice = async () => {
  const res = await mockData()
  console.log(res)
  await setTableData(res)
}

const setTableData = (input: any[]) => {
  if (!input.length) {
    return
  }

  requestAnimationFrame(async () => {
    const num = 2000
    data.value.push(...input.slice(0, num))
    setTableData(input.slice(num))
  })
}

const reset = () => {
  data.value = []
}
</script>

<style lang="less" scoped></style>
