import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'responses.json')

function unauthorized(res) {
  res.status(401).json({ error: 'Unauthorized' })
}

export default async function handler(req, res) {
  const token = process.env.ADMIN_TOKEN || ''
  const auth = req.headers.authorization || ''
  if (!token) {
    return res.status(500).json({ error: 'Server admin token not configured (ADMIN_TOKEN)' })
  }
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== token) {
    return unauthorized(res)
  }

  if (req.method === 'GET') {
    try {
      const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
      const arr = raw ? JSON.parse(raw) : []
      return res.status(200).json({ entries: arr })
    } catch (e) {
      return res.status(200).json({ entries: [] })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await fs.promises.writeFile(DATA_FILE, '[]', 'utf8')
      return res.status(200).json({ ok: true })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to clear entries' })
    }
  }

  res.setHeader('Allow', 'GET, DELETE')
  return res.status(405).end()
}
