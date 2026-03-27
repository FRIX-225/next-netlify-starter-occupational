import React, { useRef, useState } from 'react'
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const DEFAULT_CHOICES = ['1', '2', '3', '4', '5']

const QUESTIONS = [
  { id: 1, text: 'Placeholder question 1', choices: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'] },
  { id: 2, text: 'Placeholder question 2', choices: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 3, text: 'Placeholder question 3' },
  { id: 4, text: 'Placeholder question 4' },
  { id: 5, text: 'Placeholder question 5' },
  { id: 6, text: 'Placeholder question 6' },
  { id: 7, text: 'Placeholder question 7' },
  { id: 8, text: 'Placeholder question 8' },
  { id: 9, text: 'Placeholder question 9', choices: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'] },
  { id: 10, text: 'Placeholder question 10' },
  { id: 11, text: 'Placeholder question 11' },
  { id: 12, text: 'Placeholder question 12' },
  { id: 13, text: 'Placeholder question 13' },
  { id: 14, text: 'Placeholder question 14' },
  { id: 15, text: 'Placeholder question 15', choices: ['Very unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very likely'] },
  { id: 16, text: 'Placeholder question 16' },
  { id: 17, text: 'Placeholder question 17' },
  { id: 18, text: 'Placeholder question 18' },
  { id: 19, text: 'Placeholder question 19' },
  { id: 20, text: 'Placeholder question 20' },
]

export default function Home() {
  const formRef = useRef(null)
  const [message, setMessage] = useState('')

  async function handleSave() {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    const responses = {}

    QUESTIONS.forEach((q) => {
      // radio inputs: single value (keep as array for compatibility)
      const val = fd.get(`q${q.id}`)
      responses[`q${q.id}`] = val ? [String(val)] : []
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

              <div role="radiogroup" aria-label={`Question ${q.id} choices`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {(q.choices || DEFAULT_CHOICES).map((labelText, idx) => {
                  const val = idx + 1
                  const id = `q${q.id}-opt${val}`
                  return (
                    <label key={val} htmlFor={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', minWidth: '2.5rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{labelText}</span>
                      <input type="radio" id={id} name={`q${q.id}`} value={String(val)} />
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
