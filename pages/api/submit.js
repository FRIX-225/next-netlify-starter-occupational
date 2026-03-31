import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'responses.json')

async function ensureDataFile() {
  await fs.promises.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.promises.access(DATA_FILE)
  } catch (e) {
    await fs.promises.writeFile(DATA_FILE, '[]', 'utf8')
  }
}

async function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Sheets env vars not configured (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID)')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient })
}

function buildSheetRow(payload, req) {
  const timestamp = new Date().toISOString()
  const responses = payload.responses || {}
  const row = [timestamp]

  for (let i = 1; i <= 20; i += 1) {
    const values = responses[`q${i}`]
    if (Array.isArray(values)) {
      row.push(String(values[0] ?? ''))
    } else if (values == null) {
      row.push('')
    } else {
      row.push(String(values))
    }
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
  const userAgent = req.headers['user-agent'] || ''
  row.push(ip, userAgent)

  return row
}

async function appendToGoogleSheets(row) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A1:Z1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body
  if (!payload || typeof payload !== 'object' || !payload.responses) {
    return res.status(400).json({ error: 'Invalid payload; expected { responses: {...} }' })
  }

  await ensureDataFile()

  try {
    await appendToGoogleSheets(buildSheetRow(payload, req))

    const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
    const arr = raw ? JSON.parse(raw) : []
    const entry = {
      timestamp: new Date().toISOString(),
      responses: payload.responses,
      meta: {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      },
    }
    arr.push(entry)
    // atomic write
    const tmp = DATA_FILE + '.tmp'
    await fs.promises.writeFile(tmp, JSON.stringify(arr, null, 2), 'utf8')
    await fs.promises.rename(tmp, DATA_FILE)

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Failed to write submission', e)
    return res.status(500).json({ error: 'Failed to save submission' })
  }
}
