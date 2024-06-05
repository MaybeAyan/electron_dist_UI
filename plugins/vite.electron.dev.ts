import type { AddressInfo } from 'net'
import type { Plugin } from 'vite'
import { spawn } from 'child_process'
import fs from 'fs'

export const ElectronDevPlugin = (): Plugin => {
  return {
    name: 'electron-dev',
    // 配置钩子
    configureServer(server) {
      const initElectron = () => {
        // 使用esbuild编译TypeScript代码为JavaScript
        require('esbuild').buildSync({
          entryPoints: ['src/background.ts'],
          bundle: true,
          outfile: 'dist/background.js',
          platform: 'node',
          target: 'node12',
          external: ['electron']
        })
      }
      initElectron()
      server?.httpServer?.once('listening', () => {
        const addressInfo = server.httpServer?.address() as AddressInfo
        const IP = `http://localhost:${addressInfo.port}`
        let electronProcess = spawn(require('electron'), ['dist/background.js', IP])
        console.log(IP)

        fs.watchFile('src/background.ts', () => {
          // 杀死当前的Electron进程
          electronProcess.kill()
          // 重新编译主进程代码并重新启动Electron进程
          initElectron()
          electronProcess = spawn(require('electron'), ['dist/background.js', IP])
        })
      })
    }
  }
}
