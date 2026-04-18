import { google } from 'googleapis';

function getRowValues(body) {
  const responses = body.responses || body || {}
  const row = []

  for (let i = 1; i <= 20; i += 1) {
    const value = responses[`q${i}`]
    if (Array.isArray(value)) {
      row.push(String(value[0] ?? ''))
    } else if (value == null) {
      row.push('')
    } else {
      row.push(String(value))
    }
  }

  row.push(new Date().toISOString())
  return [row]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      return res.status(500).json({ error: 'Server configuration error: missing credentials' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const values = getRowValues(data)

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}