import { app, BrowserWindow, dialog } from 'electron'
import { ipcMain } from 'electron'
import fs from 'fs'
import Jimp from 'jimp'
import path from 'path'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // 渲染进程使用 node
      contextIsolation: false, // 关闭渲染进程沙箱
      webSecurity: false // 关闭跨越检测
    },
    title: 'onlySDK'
  })
  win.setMenu(null)
  win.setSize(1280, 960)
  win.webContents.openDevTools() // 打开开发者工具
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
})

const listDirectories = (basePath: string, relativePath: string) => {
  const folderPath = path.join(basePath, relativePath)
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

const getExtraFilesPath = (filename: string) => {
  return path.join(process.cwd(), `/public/${filename}`)
}

/**读取文件夹名字 */
ipcMain.handle('list-directories', (event, relativePath) => {
  const basePath = path.join(`${getExtraFilesPath('')}`) // 或者使用 __dirname
  return listDirectories(basePath, relativePath)
})

// 创建文件夹
ipcMain.handle('create-directory', async (event, dirName, jsonData) => {
  const dirPath = path.join(`${getExtraFilesPath('config')}`, dirName)
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
      const filePath = path.join(dirPath, 'xyxGameCfg.json')
      if (jsonData) {
        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8')
      }

      return {
        code: 200,
        message: 'Success'
      }
    } else {
      return { code: 0, status: 'error', message: 'Directory already exists' }
    }
  } catch (error) {
    console.error('Failed to create directory:', error)
    return { code: 0, status: 'error', message: error }
  }
})

/**写入JSON */
ipcMain.handle('write-json', async (event, fileName, newData) => {
  const filePath = path.join(`${getExtraFilesPath('jsons')}`, fileName)
  try {
    // 尝试读取现有文件
    let existingData = {}
    if (fs.existsSync(filePath)) {
      const rawData = await fs.promises.readFile(filePath, 'utf8')
      existingData = JSON.parse(rawData)
    }

    // 合并现有数据和新数据
    const mergedData = { ...existingData, ...newData }

    // 写回合并后的数据到文件
    await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2))
    return {
      code: 200,
      message: 'Success'
    }
  } catch (error) {
    console.error('Failed to write JSON file:', error)
    return { status: 'error', message: error }
  }
})

/**写入JSON */
ipcMain.handle('edit-json', async (event, fileName, newData) => {
  const filePath = path.join(`${getExtraFilesPath('jsons')}`, fileName)
  try {
    // 尝试读取现有文件
    let existingData = {}
    if (fs.existsSync(filePath)) {
      const rawData = await fs.promises.readFile(filePath, 'utf8')
      existingData = JSON.parse(rawData)
    }

    // 合并现有数据和新数据
    const mergedData = { ...existingData, ...newData }

    // 写回合并后的数据到文件
    await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2))
    return {
      code: 200,
      message: 'Success'
    }
  } catch (error) {
    console.error('Failed to write JSON file:', error)
    return { status: 'error', message: error }
  }
})

/**写入具体JSON配置 */
ipcMain.handle('write-config', async (event, fileName, newData) => {
  const filePath = path.join(`${getExtraFilesPath(`config/${fileName}`)}`, 'xyxGameCfg.json')
  try {
    // 尝试读取现有文件
    let existingData = {}
    if (fs.existsSync(filePath)) {
      const rawData = await fs.promises.readFile(filePath, 'utf8')
      existingData = JSON.parse(rawData)
    }

    // 合并现有数据和新数据
    const mergedData = Object.assign(existingData, newData)

    // 写回合并后的数据到文件
    await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2))
    return {
      code: 200,
      message: 'Success'
    }
  } catch (error) {
    console.error('Failed to write JSON file:', error)
    return { status: 'error', message: error }
  }
})

ipcMain.handle('read-json', async (event, fileName) => {
  // 获取应用程序的安装目录
  const appPath = `${getExtraFilesPath('jsons')}`
  // 完整的文件路径
  const filePath = path.join(appPath, fileName)

  try {
    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      // 读取文件内容
      const rawData = await fs.promises.readFile(filePath, 'utf8')
      // 将 JSON 字符串转换为对象
      const data = JSON.parse(rawData)
      return { code: 200, status: 'success', data: data }
    } else {
      // 文件不存在
      return { status: 'not_found', message: 'File not found' }
    }
  } catch (error) {
    console.error('Failed to read JSON file:', error)
    return { status: 'error', message: error }
  }
})

ipcMain.handle('delete-json', async (event, fileName: string, channelId: string) => {
  try {
    // 获取应用程序的安装目录
    const appPath = `${getExtraFilesPath('jsons')}`
    // 完整的文件路径
    const filePath = path.join(appPath, fileName)
    const data = await fs.promises.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(data)
    if (channelId) {
      jsonData[channelId] && delete jsonData[channelId]
    }
    const filteredData = jsonData
    await fs.promises.writeFile(filePath, JSON.stringify(filteredData, null, 2), 'utf8')
    return {
      code: 200,
      message: 'Success'
    }
  } catch (err) {
    console.error('Error writing file:', err)
    throw err
  }
})

ipcMain.handle('delete-directory', async (event, fileName: string) => {
  try {
    const dirPath = path.join(`${getExtraFilesPath('config')}`, fileName)
    await fs.promises.rmdir(dirPath, { recursive: true })
    return {
      code: 200,
      message: 'Success'
    }
  } catch (err) {
    console.error('Error deleting folder:', err)
    throw err
  }
})

ipcMain.handle('get-game-config', async (event, channel: string) => {
  try {
    const appPath = `${getExtraFilesPath('config')}`
    const filePath = path.join(appPath, channel)
    const resPath = path.join(filePath, 'xyxGameCfg.json')
    const rawData = await fs.promises.readFile(resPath, 'utf8')
    const data = JSON.parse(rawData)
    return { code: 200, status: 'success', data: data }
  } catch (error) {
    console.error(error)
    throw error
  }
})

ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
  })
  return result.filePaths[0]
})
ipcMain.handle('remove-background', async (event, { imagePath, backgroundColor, tolerance }) => {
  try {
    const image = await Jimp.read(imagePath)

    const [bgRed, bgGreen, bgBlue] = backgroundColor

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx]
      const green = this.bitmap.data[idx + 1]
      const blue = this.bitmap.data[idx + 2]

      const colorDistance = Math.sqrt(
        Math.pow(red - bgRed, 2) + Math.pow(green - bgGreen, 2) + Math.pow(blue - bgBlue, 2)
      )

      if (colorDistance < tolerance) {
        this.bitmap.data[idx + 3] = 0
      }
    })

    const uniqueFileName = `output_${new Date().getTime()}.png`
    const outputPath = path.join(__dirname, uniqueFileName)
    await image.writeAsync(outputPath)
    return outputPath
  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
})
