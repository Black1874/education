const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'src')
const publicImagesDir = path.join(root, 'public', 'images')
const outputFile = path.join(root, 'image-assets.json')

const realObjectCategories = new Set(['animals', 'fruits', 'vegetables', 'vehicles'])
const cartoonCategories = new Set(['colors', 'letters', 'numbers', 'shapes', 'icons'])

const filenameNames = {
  animals: {
    ant: ['蚂蚁', 'ant'], bear: ['熊', 'bear'], bee: ['蜜蜂', 'bee'], butterfly: ['蝴蝶', 'butterfly'], cat: ['猫', 'cat'], chicken: ['小鸡', 'chicken'], cow: ['奶牛', 'cow'], crab: ['螃蟹', 'crab'], deer: ['鹿', 'deer'], dog: ['狗', 'dog'], dolphin: ['海豚', 'dolphin'], dragonfly: ['蜻蜓', 'dragonfly'], duck: ['鸭子', 'duck'], eagle: ['老鹰', 'eagle'], elephant: ['大象', 'elephant'], fox: ['狐狸', 'fox'], giraffe: ['长颈鹿', 'giraffe'], goldfish: ['金鱼', 'goldfish'], goose: ['鹅', 'goose'], hamster: ['仓鼠', 'hamster'], hippo: ['河马', 'hippopotamus'], horse: ['马', 'horse'], jellyfish: ['水母', 'jellyfish'], kangaroo: ['袋鼠', 'kangaroo'], ladybug: ['瓢虫', 'ladybug'], lion: ['狮子', 'lion'], monkey: ['猴子', 'monkey'], octopus: ['章鱼', 'octopus'], ostrich: ['鸵鸟', 'ostrich'], owl: ['猫头鹰', 'owl'], panda: ['熊猫', 'panda'], parrot: ['鹦鹉', 'parrot'], peacock: ['孔雀', 'peacock'], penguin: ['企鹅', 'penguin'], pig: ['猪', 'pig'], pigeon: ['鸽子', 'pigeon'], rabbit: ['兔子', 'rabbit'], rhino: ['犀牛', 'rhinoceros'], shark: ['鲨鱼', 'shark'], sheep: ['羊', 'sheep'], snail: ['蜗牛', 'snail'], sparrow: ['麻雀', 'sparrow'], squirrel: ['松鼠', 'squirrel'], starfish: ['海星', 'starfish'], swan: ['天鹅', 'swan'], tiger: ['老虎', 'tiger'], turtle: ['乌龟', 'turtle'], whale: ['鲸鱼', 'whale'], wolf: ['狼', 'wolf'], zebra: ['斑马', 'zebra']
  },
  icons: {
    animal: ['动物', 'animal category'],
    fruit: ['水果', 'fruit category']
  }
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    return fullPath
  })
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function getConfigMetadata() {
  const metadata = new Map()
  const files = walkFiles(srcDir).filter((file) => /\.(ts|vue)$/.test(file))
  const itemRegex = /\{[^\n]*?name:\s*'([^']+)'[^\n]*?imageUrl:\s*'([^']+)'[^\n]*?\}/g
  const nameEnRegex = /nameEn:\s*'([^']+)'/

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    for (const match of content.matchAll(itemRegex)) {
      const itemLiteral = match[0]
      const nameZh = match[1]
      const imageUrl = match[2]
      const nameEn = itemLiteral.match(nameEnRegex)?.[1]
      metadata.set(imageUrl, {
        nameZh,
        nameEn,
        sourceFile: toPosix(path.relative(root, file)),
      })
    }
  }

  return metadata
}

function getStyle(category) {
  if (realObjectCategories.has(category)) return 'realistic'
  if (cartoonCategories.has(category)) return 'cartoon'
  return 'cartoon'
}

function getNames(category, slug, imageUrl, metadata) {
  const meta = metadata.get(imageUrl)
  if (meta) {
    return {
      nameZh: meta.nameZh,
      nameEn: meta.nameEn || slug.replaceAll('-', ' '),
      sourceFile: meta.sourceFile,
    }
  }

  const names = filenameNames[category]?.[slug]
  return {
    nameZh: names?.[0] || slug,
    nameEn: names?.[1] || slug.replaceAll('-', ' '),
    sourceFile: null,
  }
}

function getPrompt(asset) {
  const subject = asset.nameEn
  const zh = asset.nameZh

  if (asset.category === 'colors') {
    return `A cute children's educational flashcard showing the color ${subject}, using a friendly ${subject.toLowerCase()} crayon, paint splash, and small toy blocks, rounded shapes, bright soft colors, clean light pastel background, simple and clear, preschool color learning style, no watermark, square composition.`
  }

  if (asset.category === 'letters') {
    return `A cute children's educational illustration of the uppercase letter ${subject.toUpperCase()} as a soft foam toy, rounded shape, bright friendly color, clean light pastel background, simple and clear, preschool alphabet learning style, show only the letter ${subject.toUpperCase()}, no watermark, square composition.`
  }

  if (asset.category === 'numbers') {
    return `A cute children's educational illustration of the number ${subject} as a soft foam toy, rounded shape, bright friendly color, clean light pastel background, simple and clear, preschool number learning style, show only the number ${subject}, no watermark, square composition.`
  }

  if (asset.category === 'shapes') {
    return `A cute children's educational illustration of a ${subject} shaped toy block, rounded edges, bright soft colors, clean light pastel background, simple and clear, preschool shape learning style, no text, no watermark, square composition.`
  }

  if (asset.category === 'icons') {
    return `A cute children's educational app category icon for ${subject}, rounded friendly illustration, bright soft colors, clean light pastel background, simple and clear, preschool style, no text, no watermark, square composition.`
  }

  return `A realistic but cute educational flashcard image of a single ${subject} (${zh}), centered, soft studio lighting, clean light pastel background, child-friendly, high detail, recognizable for preschool children, no text, no watermark, no extra objects, square composition.`
}

function buildManifest() {
  const metadata = getConfigMetadata()
  const imageFiles = walkFiles(publicImagesDir).filter((file) => /\.(svg|png|jpe?g|webp)$/i.test(file))

  const assets = imageFiles.map((file) => {
    const relativePublicPath = toPosix(path.relative(path.join(root, 'public'), file))
    const imageUrl = `/${relativePublicPath}`
    const category = relativePublicPath.split('/')[1]
    const extension = path.extname(file).slice(1).toLowerCase()
    const slug = path.basename(file, path.extname(file))
    const names = getNames(category, slug, imageUrl, metadata)
    const targetUrl = imageUrl.replace(/\.[^.]+$/, '.webp')
    const style = getStyle(category)

    const asset = {
      id: `${category}/${slug}`,
      category,
      slug,
      nameZh: names.nameZh,
      nameEn: names.nameEn,
      style,
      currentUrl: imageUrl,
      currentPath: `public/${relativePublicPath}`,
      targetUrl,
      targetPath: `public${targetUrl}`,
      outputFormat: 'webp',
      recommendedSize: '1024x1024',
      sourceFile: names.sourceFile,
      originalExtension: extension,
    }

    return { ...asset, prompt: getPrompt(asset) }
  }).sort((a, b) => a.id.localeCompare(b.id))

  const manifest = {
    version: 1,
    purpose: 'Replacement image generation manifest for preschool educational assets.',
    policy: {
      realObjectStyle: 'animals, fruits, vegetables, and vehicles use realistic but cute studio flashcard images.',
      abstractStyle: 'colors, shapes, letters, numbers, and icons use cute cartoon educational illustrations.',
      format: 'Generate WebP files and keep square composition.',
      safety: 'No scary, violent, dirty, branded, watermark, text clutter, or background distractions.',
    },
    counts: {
      total: assets.length,
      byCategory: assets.reduce((acc, asset) => {
        acc[asset.category] = (acc[asset.category] || 0) + 1
        return acc
      }, {}),
      byStyle: assets.reduce((acc, asset) => {
        acc[asset.style] = (acc[asset.style] || 0) + 1
        return acc
      }, {}),
    },
    assets,
  }

  fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(`Generated ${path.relative(process.cwd(), outputFile)} with ${assets.length} assets.`)
}

buildManifest()
