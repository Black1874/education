const base = 'http://127.0.0.1:5173'
const devices = [
  { name: 'iPhone SE', width: 375, height: 667, dpr: 2, mobile: true },
  { name: 'iPhone SE landscape', width: 667, height: 375, dpr: 2, mobile: true },
  { name: 'iPhone 14/15', width: 390, height: 844, dpr: 3, mobile: true },
  { name: 'iPhone 14/15 landscape', width: 844, height: 390, dpr: 3, mobile: true },
  { name: 'Android small', width: 360, height: 740, dpr: 3, mobile: true },
  { name: 'Android small landscape', width: 740, height: 360, dpr: 3, mobile: true },
  { name: 'Android large', width: 412, height: 915, dpr: 2.75, mobile: true },
  { name: 'Android large landscape', width: 915, height: 412, dpr: 2.75, mobile: true },
  { name: 'iPad portrait', width: 768, height: 1024, dpr: 2, mobile: true },
  { name: 'iPad landscape', width: 1024, height: 768, dpr: 2, mobile: true },
]
const cases = [
  { name: 'home', url: '/' },
  { name: 'games-list', url: '/games' },
  { name: 'game-detail', url: '/games/memory' },
  { name: 'login', url: '/login' },
  { name: 'learning-list', url: '/learning' },
  { name: 'mode-selection', url: '/learning/fruit' },
  { name: 'explore', url: '/learning/fruit', click: '选择自由探索' },
  { name: 'matching', url: '/learning/fruit', click: '选择配对游戏' },
  { name: 'quick', url: '/learning/fruit', click: '选择快速识别' },
  { name: 'sound', url: '/learning/fruit', click: '选择听声辨物' },
]
let seq = 0
async function newTarget(url) {
  const res = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })
  return await res.json()
}
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  const pending = new Map()
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result)
    }
  }
  return new Promise((resolve) => {
    ws.onopen = () => resolve({
      send(method, params = {}) {
        const id = ++seq
        ws.send(JSON.stringify({ id, method, params }))
        return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
      },
      close() { ws.close() }
    })
  })
}
async function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
async function measure(client, device, testCase) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: device.width,
    height: device.height,
    deviceScaleFactor: device.dpr,
    mobile: device.mobile,
    screenWidth: device.width,
    screenHeight: device.height,
  })
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: device.mobile })
  await client.send('Page.navigate', { url: base + testCase.url })
  await delay(900)
  if (testCase.click) {
    await client.send('Runtime.evaluate', { expression: `(() => { const label=${JSON.stringify(testCase.click)}; const el=[...document.querySelectorAll('[role="button"],button')].find(e => (e.getAttribute('aria-label')||e.textContent||'').includes(label.replace('选择','')) || (e.getAttribute('aria-label')||'')===label); if (el) { el.click(); return true } return false; })()` })
    await delay(testCase.name === 'matching' ? 1200 : 900)
  }
  const result = await client.send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
    const doc = document.documentElement
    const body = document.body
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight)
    const overflow = Math.max(0, scrollHeight - window.innerHeight)
    const main = document.querySelector('.interactive-area,.main-content,.mode-selection')
    const header = document.querySelector('.header')
    const change = document.querySelector('.change-mode-btn')
    const sound = document.querySelector('.sound-toggle')
    const options = [...document.querySelectorAll('.option-card,.matching-card,.category-card,.mode-card')].map(e => e.getBoundingClientRect())
    const maxBottom = options.length ? Math.max(...options.map(r => r.bottom)) : 0
    return {
      url: location.pathname,
      inner: { width: window.innerWidth, height: window.innerHeight },
      scrollHeight,
      overflow,
      headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : null,
      mainBottom: main ? Math.round(main.getBoundingClientRect().bottom) : null,
      cardMaxBottom: Math.round(maxBottom),
      changeTop: change ? Math.round(change.getBoundingClientRect().top) : null,
      soundTop: sound ? Math.round(sound.getBoundingClientRect().top) : null,
    }
  })()` })
  return result.result.value
}
async function main() {
  const target = await newTarget(base + '/learning')
  const client = await connect(target.webSocketDebuggerUrl)
  await client.send('Page.enable')
  const rows = []
  for (const device of devices) {
    for (const testCase of cases) {
      const data = await measure(client, device, testCase)
      rows.push({ device: device.name, case: testCase.name, overflow: data.overflow, scrollHeight: data.scrollHeight, innerH: data.inner.height, cardMaxBottom: data.cardMaxBottom, mainBottom: data.mainBottom, changeTop: data.changeTop, soundTop: data.soundTop })
    }
  }
  console.table(rows)
  const bad = rows.filter(r => r.overflow > 8)
  console.log('BAD_COUNT', bad.length)
  console.log(JSON.stringify(bad, null, 2))
  client.close()
}
main().catch(err => { console.error(err); process.exit(1) })
