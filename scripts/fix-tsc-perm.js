const fs = require('fs')
const path = require('path')

function safeChmod(p) {
  try {
    if (fs.existsSync(p)) {
      fs.chmodSync(p, 0o755)
      console.log(`chmod +x ${p}`)
    } else {
      // console.log(`not found: ${p}`)
    }
  } catch (e) {
    console.warn(`chmod failed for ${p}:`, e.message)
  }
}

const projRoot = process.cwd()
const binDir = path.join(projRoot, 'node_modules', '.bin')

// chmod all entries in node_modules/.bin
try {
  if (fs.existsSync(binDir)) {
    const files = fs.readdirSync(binDir)
    files.forEach(f => {
      const p = path.join(binDir, f)
      safeChmod(p)
    })
    console.log('chmod applied to node_modules/.bin/*')
  } else {
    console.log('no node_modules/.bin directory found')
  }
} catch (e) {
  console.warn('error while chmod .bin:', e.message)
}

// also try idempotent chmod for common package bins
const commonBins = [
  path.join(projRoot, 'node_modules', 'typescript', 'bin', 'tsc'),
  path.join(projRoot, 'node_modules', 'vite', 'bin', 'vite.js'),
  path.join(projRoot, 'node_modules', '.bin', 'vite') // Added Vite binary
]
commonBins.forEach(p => safeChmod(p))

console.log('fix-tsc-perm finished')
