const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const manifestPath = path.join(root, 'image-assets.json')
const srcDir = path.join(root, 'src')
const publicImagesDir = path.join(root, 'public', 'images')

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    return fullPath
  })
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true })
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name)
    const to = path.join(target, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

function getMissingTargets(assets) {
  return assets.filter((asset) => !fs.existsSync(path.join(root, asset.targetPath)))
}

function printMissingTargets(missing) {
  console.error('Missing generated WebP files. Generate these before replacement:')
  for (const asset of missing.slice(0, 50)) console.error(`- ${asset.targetPath}`)
  if (missing.length > 50) console.error(`...and ${missing.length - 50} more`)
}

function assertTargetsExist(assets) {
  const missing = getMissingTargets(assets)
  if (missing.length > 0) {
    printMissingTargets(missing)
    process.exit(1)
  }
}

function replaceSourceReferences(assets) {
  const files = walkFiles(srcDir).filter((file) => /\.(ts|vue|scss|css|html)$/.test(file))
  const replacements = new Map(assets.map((asset) => [asset.currentUrl, asset.targetUrl]))
  let changedFiles = 0

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8')
    const original = content
    for (const [from, to] of replacements) {
      content = content.split(from).join(to)
    }
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8')
      changedFiles += 1
    }
  }

  return changedFiles
}

function removeOldNonWebp(assets) {
  for (const asset of assets) {
    const oldPath = path.join(root, asset.currentPath)
    const newPath = path.join(root, asset.targetPath)
    if (oldPath !== newPath && fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
  }
}

function main() {
  const dryRun = process.argv.includes('--dry-run')
  const removeOld = process.argv.includes('--remove-old')

  if (!fs.existsSync(manifestPath)) {
    console.error('Missing image-assets.json. Run node scripts/build-image-assets.cjs first.')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const assets = manifest.assets

  if (dryRun) {
    const missing = getMissingTargets(assets)
    console.log(`Dry run complete. Manifest assets: ${assets.length}.`)
    console.log(`Generated WebP files present: ${assets.length - missing.length}.`)
    console.log(`Missing WebP files: ${missing.length}.`)
    if (missing.length > 0) printMissingTargets(missing)
    console.log('No files changed.')
    return
  }

  assertTargetsExist(assets)

  const backupDir = path.join(root, 'public', `images_svg_backup_${new Date().toISOString().replace(/[:.]/g, '-')}`)
  copyDir(publicImagesDir, backupDir)
  const changedFiles = replaceSourceReferences(assets)
  if (removeOld) removeOldNonWebp(assets)

  console.log(`Backup created: ${path.relative(root, backupDir)}`)
  console.log(`Updated source files: ${changedFiles}`)
  if (removeOld) console.log('Old non-WebP files removed according to manifest.')
  else console.log('Old files kept. Add --remove-old to delete old SVG/PNG/JPG files after backup.')
}

main()

