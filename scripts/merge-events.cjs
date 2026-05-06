const fs = require('fs')
const path = require('path')

function mergeEvents(root = process.cwd()) {
  const sourceDir = path.join(root, 'data')
  const outputDir = path.join(root, 'dist', 'data')
  const outputFile = path.join(outputDir, 'events.json')

  const sourceFiles = fs
    .readdirSync(sourceDir)
    .filter((file) => file.endsWith('.json') && file !== 'events.json')
    .sort()

  const events = sourceFiles.flatMap((file) => {
    const filePath = path.join(sourceDir, file)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return Array.isArray(content) ? content : [content]
  })

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputFile, `${JSON.stringify(events, null, 2)}\n`)

  console.log(`Merged ${events.length} events from ${sourceFiles.length} files into dist/data/events.json`)
}

if (require.main === module) {
  mergeEvents()
}

module.exports = { mergeEvents }
