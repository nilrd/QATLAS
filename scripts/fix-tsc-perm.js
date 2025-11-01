const fs = require('fs')
const path = require('path')

function safeChmod(p) {
  try {
    if (fs.existsSync(p)) {
      fs.chmodSync(p, 0o755)
      console.log(`chmod +x ${p}`)
    } else {
      console.log(`not found: ${p}`)
    }
  } catch (e) {
    console.warn(`chmod failed for ${p}:`, e.message)
  }
}

function safeSymlink(src, dest) {
  try {
    if (!fs.existsSync(dest)) {
      fs.symlinkSync(src, dest)
      console.log(`symlink ${dest} -> ${src}`)
    } else {
      console.log(`symlink already exists: ${dest}`)
    }
  } catch (e) {
    console.warn(`symlink failed ${dest}:`, e.message)
  }
}

const projRoot = process.cwd()
const tscBin = path.join(projRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const tscBinLink = path.join(projRoot, 'node_modules', '.bin', 'tsc')

safeChmod(tscBin)
safeChmod(tscBinLink)

// try to symlink if .bin missing
if (fs.existsSync(tscBin) && !fs.existsSync(tscBinLink)) {
  safeSymlink(tscBin, tscBinLink)
}

console.log('fix-tsc-perm finished')
