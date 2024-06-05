import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'fs'
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
  win.setSize(1100, 700)
  win.webContents.openDevTools() // 打开开发者工具
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
})

function listDirectories(basePath: string, relativePath: string) {
  const folderPath = path.join(basePath, relativePath)
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

/**读取文件夹名字 */
ipcMain.handle('list-directories', (event, relativePath) => {
  const basePath = app.getAppPath() // 或者使用 __dirname
  return listDirectories(basePath, relativePath)
})

// 创建文件夹
ipcMain.handle('create-directory', async (event, dirName, jsonData) => {
  const dirPath = path.join(`${app.getAppPath()}/config`, dirName)
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
      return { status: 'error', message: 'Directory already exists' }
    }
  } catch (error) {
    console.error('Failed to create directory:', error)
    return { status: 'error', message: error }
  }
})

/**写入JSON */
ipcMain.handle('write-json', async (event, fileName, newData) => {
  const filePath = path.join(`${app.getAppPath()}/jsons`, fileName)
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

ipcMain.handle('read-json', async (event, fileName) => {
  // 获取应用程序的安装目录
  const appPath = `${app.getAppPath()}/jsons`
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
    const appPath = `${app.getAppPath()}/jsons`
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
    const dirPath = path.join(`${app.getAppPath()}/config`, fileName)
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
