import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

function createPNG(size, primaryColor = [79, 70, 229, 255]) {
  // Width, Height
  const width = size
  const height = size

  // RGBA buffer (each row starts with filter byte 0)
  const rowSize = 1 + width * 4
  const rawData = Buffer.alloc(rowSize * height)

  const radius = Math.round(size * 0.22)
  const center = size / 2

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize
    rawData[rowOffset] = 0 // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4

      // Rounded rectangle mask (squircle)
      let inShape = false
      const dx = Math.abs(x - center)
      const dy = Math.abs(y - center)
      const maxDist = center - radius

      if (dx <= center && dy <= maxDist) inShape = true
      else if (dx <= maxDist && dy <= center) inShape = true
      else {
        const cornerDx = dx - maxDist
        const cornerDy = dy - maxDist
        if (cornerDx * cornerDx + cornerDy * cornerDy <= radius * radius) {
          inShape = true
        }
      }

      if (inShape) {
        // Document icon graphic simulation
        const docLeft = Math.round(size * 0.25)
        const docRight = Math.round(size * 0.75)
        const docTop = Math.round(size * 0.2)
        const docBottom = Math.round(size * 0.8)

        const inDoc = x >= docLeft && x <= docRight && y >= docTop && y <= docBottom

        if (inDoc) {
          // Document white sheet
          rawData[pxOffset] = 255     // R
          rawData[pxOffset + 1] = 255 // G
          rawData[pxOffset + 2] = 255 // B
          rawData[pxOffset + 3] = 255 // A
        } else {
          // Brand background (#4F46E5)
          rawData[pxOffset] = primaryColor[0]
          rawData[pxOffset + 1] = primaryColor[1]
          rawData[pxOffset + 2] = primaryColor[2]
          rawData[pxOffset + 3] = primaryColor[3]
        }
      } else {
        // Transparent
        rawData[pxOffset] = 0
        rawData[pxOffset + 1] = 0
        rawData[pxOffset + 2] = 0
        rawData[pxOffset + 3] = 0
      }
    }
  }

  // Deflate compressed IDAT data
  const compressed = zlib.deflateSync(rawData)

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function makeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type, 'ascii')
    const toCrc = Buffer.concat([typeBuf, data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(calculateCrc(toCrc), 0)
    return Buffer.concat([len, typeBuf, data, crc])
  }

  // IHDR Chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type (RGBA)
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr)
  const idatChunk = makeChunk('IDAT', compressed)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

// Standard CRC32 table
const crcTable = []
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1)
    else c = c >>> 1
  }
  crcTable[n] = c >>> 0
}

function calculateCrc(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

const outDir = path.resolve('public')
fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPNG(192))
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPNG(512))
console.log('✅ Generated public/icon-192.png and public/icon-512.png')
