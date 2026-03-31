import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const formRef = useRef(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingResponses, setPendingResponses] = useState(null)

  function collectResponses() {
    const fd = new FormData(formRef.current)
    const responses = {}

    QUESTIONS.forEach((q) => {
      // radio inputs: single value (keep as array for compatibility)
      const val = fd.get(`q${q.id}`)
      responses[`q${q.id}`] = val ? [String(val)] : []
    })

    return responses
  }

  function handleContinue() {
    if (!formRef.current || isSubmitting) return
    setPendingResponses(collectResponses())
    setShowConfirmation(true)
    setMessage('Once submitted, they cannot be changed.')
  }

  function handleCancel() {
    setShowConfirmation(false)
    setPendingResponses(null)
    setMessage('')
  }

  async function handleSave(responses) {
    setMessage('Submitting your responses…')
    setIsSubmitting(true)

    try {
      const resp = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      })

      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Server rejected submission')
      }

      setMessage('your responses have been submitted. Thank you.')
      return true
    } catch (e) {
      console.error('submit failed', e)
      setMessage('Failed to save responses.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirm() {
    if (!pendingResponses || isSubmitting) return
    const success = await handleSave(pendingResponses)
    if (success) {
      router.push('/thanks')
    }
  }

  return (
    <div className="container survey-root">

      <main className="survey-main">

        <section className="survey-card">
          <div className="survey-header">
            <h1 className="survey-title">Occupational Survey</h1>
            <p className="survey-subtitle">A quick survey about your work experience. Select one option per question.</p>
          </div>

          <form ref={formRef} aria-label="Twenty question survey" className="survey-form">
            {QUESTIONS.map((q) => (
              <fieldset key={q.id} className="survey-question">
                <legend className="question-legend">Question {q.id}</legend>
                <p className="question-text">{q.text}</p>

                <div role="radiogroup" aria-label={`Question ${q.id} choices`} className="options">
                  {(q.choices || DEFAULT_CHOICES).map((labelText, idx) => {
                    const val = idx + 1
                    const id = `q${q.id}-opt${val}`
                    return (
                      <label key={val} className="option" htmlFor={id}>
                        <input type="radio" id={id} name={`q${q.id}`} value={String(val)} />
                        <span className="option-label">{labelText}</span>
                        <span className="option-circle" aria-hidden="true" />
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <div className="actions">
              {showConfirmation ? (
                <>
                  <p className="confirmation">Are you sure these are your answers?</p>
                  <button type="button" onClick={handleConfirm} className="submitButton" disabled={isSubmitting}>
                    Yes
                  </button>
                  <button type="button" onClick={handleCancel} className="submitButton secondary" disabled={isSubmitting}>
                    No
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleContinue} className="submitButton" disabled={isSubmitting}>
                  Continue
                </button>
              )}
              {message && <p className="message">{message}</p>}
            </div>
          </form>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .survey-root {
          padding: 2.5rem 1rem 4rem;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #f8fafc;
        }

        .survey-main {
          width: min(980px, 100%);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .survey-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 32px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
        }

        .survey-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .survey-title {
          margin: 0;
          font-size: clamp(1.8rem, 2.4vw, 2.4rem);
          letter-spacing: -0.03em;
        }

        .survey-subtitle {
          margin: 0;
          color: #475569;
          line-height: 1.7;
          max-width: 44rem;
        }

        .survey-form {
          display: grid;
          gap: 1rem;
        }

        .survey-question {
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 1.25rem 1.25rem 1rem;
          background: #f8fafc;
        }

        .question-legend {
          margin: 0 0 0.75rem 0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #64748b;
          font-weight: 700;
        }

        .question-text {
          margin: 0 0 1rem;
          color: #111827;
          line-height: 1.6;
          font-size: 1rem;
        }

        .options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 0.75rem;
          width: 100%;
        }

        .option {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0;
          border-radius: 16px;
          cursor: pointer;
          user-select: none;
          color: #0f172a;
          text-align: center;
          justify-content: center;
        }

        .option:hover .option-circle {
          border-color: #94a3b8;
        }

        .option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .option-circle {
          position: relative;
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 50%;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          transition: border-color 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }

        .option-circle::after {
          content: '';
          position: absolute;
          inset: 50%;
          width: 0.4rem;
          height: 0.4rem;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          background: #2563eb;
          transition: transform 0.2s ease;
        }

        .option-label {
          font-size: 0.95rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .option input:checked + .option-label {
          color: #0f172a;
        }

        .option input:checked + .option-label + .option-circle {
          border-color: #2563eb;
          transform: scale(1.05);
        }

        .option input:checked + .option-label + .option-circle::after {
          transform: translate(-50%, -50%) scale(1);
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
        }

        .submitButton {
          border: none;
          border-radius: 999px;
          background: #0f172a;
          color: #ffffff;
          padding: 0.95rem 1.4rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .submitButton:hover {
          transform: translateY(-1px);
          background: #111827;
        }

        .submitButton.secondary {
          background: #e2e8f0;
          color: #0f172a;
        }

        .submitButton.secondary:hover {
          background: #cbd5e1;
        }

        .confirmation {
          margin: 0;
          color: #0f172a;
          font-weight: 700;
        }

        .message {
          margin: 0;
          color: #166534;
          font-size: 0.95rem;
        }

        @media (max-width: 680px) {
          .survey-card {
            padding: 1.5rem;
          }

          .options {
            gap: 0.5rem;
          }

          .option {
            min-width: 3rem;
            padding: 0.7rem 0.9rem;
            font-size: 0.9rem;
          }

          .survey-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  )
}
