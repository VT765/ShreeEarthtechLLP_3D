// Drives headless Chrome over the DevTools protocol: one transparent screenshot per grade. See render-pouches.sh.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SIZE = 800
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const chrome = spawn(process.env.CHROME, [
  '--headless=new', '--remote-debugging-port=9334', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'pouch-'))}`,
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--window-size=${SIZE},${SIZE}`, 'about:blank',
], { stdio: 'ignore' })

try {
  let tabs
  for (let i = 0; !tabs && i < 50; i++) tabs = await fetch('http://127.0.0.1:9334/json').then((r) => r.json(), () => wait(200))
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  let id = 0
  const pending = new Map()
  ws.addEventListener('message', (m) => {
    const d = JSON.parse(m.data)
    pending.get(d.id)?.(d.result)
    pending.delete(d.id)
  })
  const send = (method, params = {}) => new Promise((r) => (pending.set(++id, r), ws.send(JSON.stringify({ id, method, params }))))
  await send('Emulation.setDeviceMetricsOverride', { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })

  for (const slug of process.argv.slice(2)) {
    await send('Page.navigate', { url: `http://localhost:${process.env.PORT}/scripts/render-pouches.html?grade=${slug}` })
    for (let i = 0; i < 120; i++) {
      const r = await send('Runtime.evaluate', { expression: '!!window.pouchReady', returnByValue: true })
      if (r.result.value) break
      await wait(250)
    }
    const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 90 })
    writeFileSync(`public/products/${slug}.webp`, Buffer.from(shot.data, 'base64'))
    console.log(`public/products/${slug}.webp`)
  }
  ws.close()
} finally {
  chrome.kill()
}
