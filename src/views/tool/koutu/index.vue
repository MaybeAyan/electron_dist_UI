<template>
  <t-card>
    <div class="font-semibold">抠图消除背景</div>
    <t-button theme="primary" class="mt-4" @click="selectImage" variant="outline"
      >选择图片</t-button
    >
    <p v-if="imagePath" class="mt-4">已选择图片: {{ imagePath }}</p>
    <div class="flex" v-if="imagePath">
      <img class="mt-4 w-1/3" v-if="imagePath" :src="imagePath" alt="Selected Image" width="300" />
      <div class="flex flex-col w-1/3 justify-center items-center">
        <div class="min-w-60">
          <label for="background-color" class="mr-2 cursor-pointer">需要消除的背景色: </label>
          <input class="" type="color" id="background-color" v-model="backgroundColor" />
        </div>
        <div class="mt-4 min-w-60">
          <label for="tolerance" class="mr-2">容忍度 : </label>
          <input type="number" id="tolerance" v-model="tolerance" value="10" />
        </div>

        <t-button @click="removeBackground" class="mt-6" variant="outline" theme="primary"
          >一键消除</t-button
        >
      </div>
      <img v-if="outputPath" :src="outputPath" class="mt-4 w-1/3" alt="Output Image" width="300" />
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { ipcRenderer } = require('electron')
const imagePath = ref<string | null>(null)
const backgroundColor = ref<string>('#ffffff')
const tolerance = ref<number>(10)
const outputPath = ref<string | null>(null)

const selectImage = async () => {
  const selectedPath = await ipcRenderer.invoke('select-image')
  imagePath.value = selectedPath
  outputPath.value = null
}

const removeBackground = async () => {
  if (!imagePath.value) return

  const bgColorHex = backgroundColor.value.replace('#', '')
  const bgColorArray = [
    parseInt(bgColorHex.substring(0, 2), 16),
    parseInt(bgColorHex.substring(2, 4), 16),
    parseInt(bgColorHex.substring(4, 6), 16)
  ]

  const data = {
    imagePath: imagePath.value,
    backgroundColor: bgColorArray,
    tolerance: tolerance.value
  }

  console.log(data)
  const resultPath = await ipcRenderer.invoke('remove-background', data)
  outputPath.value = resultPath
  console.log('resultPath:', resultPath)
}
</script>
