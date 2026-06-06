import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RECORDS_OUTPUT = join(__dirname, '../src/data/items.json')
const STATIC_OUTPUT = join(__dirname, '../src/data/static.json')
const STATIC_DIR = join(__dirname, '../public/static')
const ITEMS_DIR = join(__dirname, '../public/items')
const SITE_BASE = process.env.SITE_BASE?.trim() || '/legends/'

function loadEnvFile() {
  const envPath = join(__dirname, '../.env')
  if (!existsSync(envPath)) return

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile()

const itemsCsvUrl =
  process.env.GOOGLE_SHEET_ITEMS_CSV_URL?.trim() ||
  process.env.GOOGLE_SHEET_CSV_URL?.trim()
const staticCsvUrl = process.env.GOOGLE_SHEET_STATIC_CSV_URL?.trim()
const sheetId = process.env.GOOGLE_SHEET_ID?.trim()
const itemsGid = process.env.GOOGLE_SHEET_ITEMS_GID?.trim() || process.env.GOOGLE_SHEET_GID?.trim() || '0'
const staticGid = process.env.GOOGLE_SHEET_STATIC_GID?.trim()
const itemsRange = process.env.GOOGLE_SHEET_ITEMS_RANGE?.trim() || 'items'
const staticRange = process.env.GOOGLE_SHEET_STATIC_RANGE?.trim() || 'static'
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()

function parseCsvRows(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || (char === '\r' && next === '\n')) {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      if (char === '\r') i += 1
    } else if (char !== '\r') {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function rowsToRecords(rows) {
  if (!rows?.length) return []

  const [headers, ...dataRows] = rows
  return dataRows
    .filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])),
    )
}

function rowsToKeyValue(rows) {
  if (!rows?.length) return {}

  let start = 0
  const first = rows[0].map((cell) => String(cell ?? '').trim().toLowerCase())
  if (first[0] === 'key') start = 1

  const entries = {}
  for (const row of rows.slice(start)) {
    const key = String(row[0] ?? '').trim()
    const value = String(row[1] ?? '').trim()
    if (key) entries[key] = value
  }

  return entries
}

async function fetchCsvText(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV (${response.status}): ${url}`)
  }
  return response.text()
}

async function fetchPublicCsv(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  return fetchCsvText(url)
}

async function fetchSheetValues(range) {
  const { google } = await import('googleapis')
  const credentials = JSON.parse(serviceAccountJson)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  })
  return response.data.values ?? []
}

function isUrl(value) {
  return /^https?:\/\//i.test(value)
}

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; LegendsCatalog/1.0)',
  Accept: 'image/*,*/*',
}

function resolveAssetUrl(value) {
  const fileMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (fileMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`
  }

  const openMatch = value.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`
  }

  return value.trim()
}

function isImageBuffer(buffer) {
  if (buffer.length < 4) return false
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true
  if (buffer.length >= 12 && buffer.toString('ascii', 8, 12) === 'WEBP') return true
  return false
}

function extensionFromBuffer(buffer, contentType, url) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'png'
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'gif'
  if (buffer.length >= 12 && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  return extensionFromResponse(contentType, url)
}

function extensionFromResponse(contentType, url) {
  if (contentType?.includes('png')) return 'png'
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return 'jpg'
  if (contentType?.includes('webp')) return 'webp'
  if (contentType?.includes('svg')) return 'svg'
  if (contentType?.includes('gif')) return 'gif'

  const pathMatch = new URL(url).pathname.match(/\.([a-zA-Z0-9]+)$/)
  return pathMatch?.[1]?.toLowerCase() || 'jpg'
}

async function resolveImageUrl(url) {
  let resolved = resolveAssetUrl(url)

  if (/i\.imgur\.com/i.test(resolved)) {
    return resolved.split('?')[0]
  }

  const albumMatch = resolved.match(/imgur\.com\/a\/([a-zA-Z0-9]+)/i)
  if (albumMatch) {
    const response = await fetch(resolved, {
      headers: { 'User-Agent': FETCH_HEADERS['User-Agent'] },
    })
    if (response.ok) {
      const html = await response.text()
      const ogMatch =
        html.match(/property="og:image"\s+content="([^"]+)"/i) ||
        html.match(/content="(https:\/\/i\.imgur\.com\/[^"?]+)/i)
      if (ogMatch) {
        return ogMatch[1].split('?')[0]
      }
    }
    console.warn(`Could not resolve Imgur album: ${url}`)
    return resolved
  }

  const singleMatch = resolved.match(/imgur\.com\/([a-zA-Z0-9]+)\/?(?:\?.*)?$/i)
  if (singleMatch && !resolved.includes('/a/')) {
    return `https://i.imgur.com/${singleMatch[1]}.jpg`
  }

  return resolved.split('?')[0]
}

async function downloadImage(url) {
  const resolvedUrl = await resolveImageUrl(url)
  const response = await fetch(resolvedUrl, { headers: FETCH_HEADERS })

  if (!response.ok) {
    console.warn(`Failed to download image (${response.status}): ${url}`)
    return { remoteUrl: resolvedUrl }
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (!isImageBuffer(buffer)) {
    console.warn(`URL did not return image data: ${url} -> ${resolvedUrl}`)
    return { remoteUrl: resolvedUrl }
  }

  return {
    extension: extensionFromBuffer(buffer, response.headers.get('content-type'), resolvedUrl),
    buffer,
    remoteUrl: resolvedUrl,
  }
}

async function downloadStaticAssets(staticData) {
  if (existsSync(STATIC_DIR)) {
    rmSync(STATIC_DIR, { recursive: true, force: true })
  }
  mkdirSync(STATIC_DIR, { recursive: true })

  const output = {}

  for (const [key, value] of Object.entries(staticData)) {
    if (!isUrl(value)) {
      output[key] = value
      continue
    }

    const resolvedUrl = await resolveImageUrl(value)
    const response = await fetch(resolvedUrl, { headers: FETCH_HEADERS })

    if (!response.ok) {
      console.warn(`Failed to download "${key}" from ${value}`)
      output[key] = resolvedUrl
      continue
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    if (!isImageBuffer(buffer)) {
      console.warn(`Static asset "${key}" is not a valid image, using remote URL`)
      output[key] = resolvedUrl
      continue
    }

    const extension = extensionFromBuffer(buffer, response.headers.get('content-type'), resolvedUrl)
    const filename = `${key}.${extension}`
    writeFileSync(join(STATIC_DIR, filename), buffer)
    output[key] = `${SITE_BASE}static/${filename}`
    console.log(`Downloaded ${key} -> public/static/${filename}`)
  }

  return output
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getField(record, ...names) {
  const entries = Object.entries(record)
  for (const name of names) {
    const match = entries.find(([key]) => key.toLowerCase() === name.toLowerCase())
    if (match) return String(match[1] ?? '').trim()
  }
  return ''
}

function parseBoolean(value) {
  const normalized = value.trim().toLowerCase()
  return ['1', 'true', 'yes', 'y'].includes(normalized)
}

function parseImageList(value) {
  if (!value) return []
  return value
    .split(/[,|]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

async function normalizeItems(records) {
  if (existsSync(ITEMS_DIR)) {
    rmSync(ITEMS_DIR, { recursive: true, force: true })
  }
  mkdirSync(ITEMS_DIR, { recursive: true })

  const usedIds = new Set()
  const normalized = []

  for (const record of records) {
    const name = getField(record, 'name', 'Name')
    if (!name) continue

    let id = getField(record, 'id', 'Id', 'slug', 'Slug') || slugify(name)
    if (!id) id = `item-${normalized.length + 1}`

    let uniqueId = id
    let suffix = 2
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${suffix}`
      suffix += 1
    }
    usedIds.add(uniqueId)

    const hero = parseBoolean(getField(record, 'hero', 'Hero', 'featured', 'Featured'))
    const auction = hero || parseBoolean(getField(record, 'auction', 'Auction'))
    const rawPrice = getField(record, 'price', 'Price')
    const price = hero || auction || !rawPrice ? null : rawPrice
    const imageUrls = parseImageList(getField(record, 'images', 'Images', 'image', 'Image'))
    const localImages = []

    for (let index = 0; index < imageUrls.length; index += 1) {
      const url = imageUrls[index]
      if (!isUrl(url)) continue

      const downloaded = await downloadImage(url)
      if (downloaded.buffer && downloaded.extension) {
        const itemDir = join(ITEMS_DIR, uniqueId)
        mkdirSync(itemDir, { recursive: true })
        const filename = `${index}.${downloaded.extension}`
        writeFileSync(join(itemDir, filename), downloaded.buffer)
        localImages.push(`${SITE_BASE}items/${uniqueId}/${filename}`)
        continue
      }

      if (downloaded.remoteUrl) {
        localImages.push(downloaded.remoteUrl)
      }
    }

    normalized.push({
      id: uniqueId,
      name,
      price,
      category: getField(record, 'category', 'Category') || 'Ангилагдаагүй',
      description: getField(record, 'description', 'Description'),
      images: localImages,
      hero,
      auction,
    })
  }

  return normalized
}

async function fetchItems() {
  if (serviceAccountJson) {
    if (!sheetId) throw new Error('GOOGLE_SHEET_ID is required when using a service account.')
    console.log(`Fetching items from "${itemsRange}"...`)
    return rowsToRecords(await fetchSheetValues(itemsRange))
  }

  if (itemsCsvUrl) {
    console.log('Fetching items CSV...')
    return rowsToRecords(parseCsvRows(await fetchCsvText(itemsCsvUrl)))
  }

  if (sheetId) {
    console.log('Fetching items via export API...')
    return rowsToRecords(parseCsvRows(await fetchPublicCsv(itemsGid)))
  }

  return null
}

async function fetchStatic() {
  if (serviceAccountJson) {
    if (!sheetId) throw new Error('GOOGLE_SHEET_ID is required when using a service account.')
    console.log(`Fetching static assets from "${staticRange}"...`)
    return rowsToKeyValue(await fetchSheetValues(staticRange))
  }

  if (staticCsvUrl) {
    console.log('Fetching static CSV...')
    return rowsToKeyValue(parseCsvRows(await fetchCsvText(staticCsvUrl)))
  }

  if (sheetId && staticGid) {
    console.log('Fetching static via export API...')
    return rowsToKeyValue(parseCsvRows(await fetchPublicCsv(staticGid)))
  }

  return null
}

if (!itemsCsvUrl && !staticCsvUrl && !sheetId) {
  console.log('No Google Sheet env vars set — skipping sheet fetch.')
  process.exit(0)
}

const [items, staticData] = await Promise.all([fetchItems(), fetchStatic()])

if (items) {
  const normalizedItems = await normalizeItems(items)
  writeFileSync(RECORDS_OUTPUT, `${JSON.stringify(normalizedItems, null, 2)}\n`)
  console.log(`Wrote ${normalizedItems.length} items to src/data/items.json`)
}

if (staticData) {
  const assets = await downloadStaticAssets(staticData)
  writeFileSync(STATIC_OUTPUT, `${JSON.stringify(assets, null, 2)}\n`)
  console.log(`Wrote ${Object.keys(assets).length} static values to src/data/static.json`)
}
