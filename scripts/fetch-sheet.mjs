import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../src/data/records.json')

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

const csvUrl = process.env.GOOGLE_SHEET_CSV_URL?.trim()
const sheetId = process.env.GOOGLE_SHEET_ID?.trim()
const gid = process.env.GOOGLE_SHEET_GID?.trim() || '0'
const range = process.env.GOOGLE_SHEET_RANGE?.trim() || 'Sheet1'
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()

function rowsToRecords(rows) {
  if (!rows?.length) return []

  const [headers, ...dataRows] = rows
  return dataRows
    .filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])),
    )
}

function parseCsv(text) {
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

  return rowsToRecords(rows)
}

async function fetchPublishedCsv() {
  const response = await fetch(csvUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch published CSV (${response.status})`)
  }

  return parseCsv(await response.text())
}

async function fetchPublicCsv() {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch public sheet (${response.status})`)
  }

  return parseCsv(await response.text())
}

async function fetchWithServiceAccount() {
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

  return rowsToRecords(response.data.values ?? [])
}

async function fetchRecords() {
  if (!csvUrl && !sheetId) {
    console.log('GOOGLE_SHEET_CSV_URL or GOOGLE_SHEET_ID not set — skipping sheet fetch.')
    return null
  }

  if (serviceAccountJson) {
    if (!sheetId) {
      throw new Error('GOOGLE_SHEET_ID is required when using a service account.')
    }
    console.log('Fetching sheet with service account...')
    return fetchWithServiceAccount()
  }

  if (csvUrl) {
    console.log('Fetching published CSV URL...')
    return fetchPublishedCsv()
  }

  console.log('Fetching public sheet as CSV...')
  return fetchPublicCsv()
}

const records = await fetchRecords()

if (records) {
  writeFileSync(OUTPUT, `${JSON.stringify(records, null, 2)}\n`)
  console.log(`Wrote ${records.length} records to src/data/records.json`)
}
