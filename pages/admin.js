import React, { useState } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [token, setToken] = useState('')
  const [entries, setEntries] = useState(null)
  const [error, setError] = useState('')

  async function fetchEntries() {
    setError('')
    try {
      const resp = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (resp.status === 500) {
        const body = await resp.json()
        setError(body.error || 'Server misconfigured')
        return
      }
      if (resp.status === 401) {
        setError('Unauthorized (invalid token)')
        return
      }
      const body = await resp.json()
      setEntries(body.entries || [])
    } catch (e) {
      setError('Failed to fetch entries')
    }
  }

  async function clearAll() {
    if (!confirm('Clear all saved responses on the server? This cannot be undone.')) return
    try {
      const resp = await fetch('/api/admin', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!resp.ok) throw new Error('Failed')
      setEntries([])
    } catch (e) {
      setError('Failed to clear entries')
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survey-responses-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial' }}>
      <Head>
        <title>Admin - Survey Responses</title>
      </Head>

      <h1>Admin: Survey responses (server-side)</h1>

      <div style={{ marginTop: '1rem' }}>
        <p>Enter server admin token (set ADMIN_TOKEN in your environment).</p>
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <button onClick={fetchEntries} style={{ marginLeft: '0.5rem', padding: '0.5rem 0.75rem' }}>Load</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {entries && (
        <section style={{ marginTop: '1rem' }}>
          <p>Number of submissions: {entries.length}</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={downloadJSON} style={{ padding: '0.5rem 0.75rem' }}>Download JSON</button>
            <button onClick={clearAll} style={{ padding: '0.5rem 0.75rem' }}>Clear stored responses</button>
          </div>

          <pre style={{ marginTop: '1rem', background: '#f1f5f9', padding: '1rem', borderRadius: '6px', overflow: 'auto' }}>
            {JSON.stringify(entries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  )
}
