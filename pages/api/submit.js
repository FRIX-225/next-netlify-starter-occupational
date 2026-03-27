import fs from 'fs'
import path from 'path'

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
