import React, { useRef, useState } from 'react'
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  text: `Placeholder text for question ${i + 1}`,
}))

export default function Home() {
  const formRef = useRef(null)
  const [message, setMessage] = useState('')

  async function handleSave() {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    const responses = {}

    QUESTIONS.forEach((q) => {
      const values = fd.getAll(`q${q.id}[]`).map(String)
      responses[`q${q.id}`] = values
    })

    try {
      const resp = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })
      if (!resp.ok) throw new Error('Server rejected submission')
      setMessage('Responses saved, thank you.')
    } catch (e) {
      // fallback to localStorage
      const key = 'survey_responses'
      const existingRaw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
      let existing = []
      try {
        existing = existingRaw ? JSON.parse(existingRaw) : []
      } catch (err) {
        existing = []
      }
      existing.push({ timestamp: new Date().toISOString(), responses })
      localStorage.setItem(key, JSON.stringify(existing))
      setMessage('Failed to save to server — responses saved locally instead.')
    }
  }

  return (
    <div className="container" style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial' }}>
      <Head>
        <title>Survey - Next.js Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Survey" />

        <h1 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Survey Title</h1>
        <p style={{ color: '#555' }}>Please answer the following questions using the 1-5 scale.</p>

        <form ref={formRef} aria-label="Twenty question survey" style={{ marginTop: '1rem' }}>
          {QUESTIONS.map((q) => (
            <fieldset key={q.id} style={{ border: 'none', padding: 0, margin: '1rem 0' }}>
              <legend style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Question {q.id}</legend>
              <p style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{q.text}</p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((val) => {
                  const id = `q${q.id}-opt${val}`
                  return (
                    <label key={val} htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                      <input type="checkbox" id={id} name={`q${q.id}[]`} value={String(val)} />
                      <span style={{ fontSize: '0.9rem' }}>{val}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <div style={{ marginTop: '2rem' }}>
            <button type="button" onClick={handleSave} style={{ padding: '0.6rem 1rem', fontSize: '1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Continue
            </button>
          </div>

          {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
        </form>
      </main>

      <Footer />
    </div>
  )
}
