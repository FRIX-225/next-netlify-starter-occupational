import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const SURVEY_COMPLETED_KEY = 'surveyCompleted'

const QUESTIONS = [
  { id: 16, text: 'What is the name of your organization?', type: 'text' },
  { id: 17, text: 'What setting do you work in?', type: 'select', options: ['Office', 'Remote', 'Hybrid', 'Healthcare', 'Education', 'Retail', 'Hospitality', 'Industrial', 'Construction', 'Laboratory', 'Creative studio', 'Outdoor', 'Freelance', 'Other (please specify)'] },
]

export default function Additional() {
  const router = useRouter()
  const formRef = useRef(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOthersInput, setShowOthersInput] = useState(false)
  const [previousResponses, setPreviousResponses] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prev = localStorage.getItem('surveyResponses')
    if (!prev) {
      router.replace('/survey')
      return
    }
    setPreviousResponses(JSON.parse(prev))
    if (window.localStorage.getItem(SURVEY_COMPLETED_KEY) === 'true') {
      router.replace('/thanks')
    }
  }, [router])

  function collectResponses() {
    if (!formRef.current) return {}
    const fd = new FormData(formRef.current)
    const responses = {}

    QUESTIONS.forEach((q) => {
      if (q.type === 'text') {
        const val = fd.get(`q${q.id}`)
        responses[`q${q.id}`] = val ? [String(val)] : []
      } else if (q.type === 'select') {
        const val = fd.get(`q${q.id}`)
        if (val === 'Others') {
          const othersVal = fd.get('q2-others')
          responses[`q${q.id}`] = othersVal ? [String(othersVal)] : ['Others']
        } else {
          responses[`q${q.id}`] = val ? [String(val)] : []
        }
      }
    })

    return responses
  }

  async function handleSave() {
    const newResponses = collectResponses()
    const allResponses = { ...previousResponses, ...newResponses }
    setMessage('Submitting your responses…')
    setIsSubmitting(true)

    try {
      const resp = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: allResponses }),
      })

      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Server rejected submission')
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SURVEY_COMPLETED_KEY, 'true')
        localStorage.removeItem('surveyResponses')
      }

      setMessage('Your responses have been submitted. Thank you.')
      router.replace('/thanks')
    } catch (e) {
      console.error('submit failed', e)
      setMessage('Failed to save responses.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSubmitClick() {
    setShowConfirmation(true)
  }

  function handleConfirmSubmit() {
    setShowConfirmation(false)
    handleSave()
  }

  function handleCancelSubmit() {
    setShowConfirmation(false)
  }

  return (
    <div className="container survey-root">
      <Header title="Comenius University" subtitle="Additional survey" />

      <main className="survey-main">
        <section className="survey-card">
          <div className="survey-header">
            <h1 className="survey-title">Additional Questions</h1>
            <p className="survey-subtitle">Please provide additional information.</p>
          </div>

          <form ref={formRef} aria-label="Additional questions" className="survey-form">
            {QUESTIONS.map((q) => (
              <fieldset key={q.id} className="survey-question">
                <legend className="question-legend">Question {q.id}</legend>
                <p className="question-text">{q.text}</p>

                {q.type === 'text' ? (
                  <input type="text" name={`q${q.id}`} placeholder="Your answer" className="text-input" />
                ) : q.type === 'select' ? (
                  <>
                    <select name={`q${q.id}`} onChange={(e) => setShowOthersInput(e.target.value === 'Others')} className="select-input">
                      {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {showOthersInput && <input type="text" name="q2-others" placeholder="Please specify" className="text-input" />}
                  </>
                ) : null}
              </fieldset>
            ))}

            <div className="actions">
              <button type="button" onClick={() => router.push('/survey')} className="submitButton secondary" disabled={isSubmitting}>
                Go Back
              </button>
              <button type="button" onClick={handleSubmitClick} className="submitButton" disabled={isSubmitting}>
                Submit
              </button>
              {message && <p className="message">{message}</p>}
            </div>
          </form>
        </section>
      </main>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h2 className="confirmation-title">Confirm Submission</h2>
            <p className="confirmation-message">
              Are you sure you want to submit your responses? Once submitted, no further changes can be made to your answers.
            </p>
            <div className="confirmation-actions">
              <button type="button" onClick={handleConfirmSubmit} className="confirmation-btn confirmation-btn-yes" disabled={isSubmitting}>
                Yes, Submit
              </button>
              <button type="button" onClick={handleCancelSubmit} className="confirmation-btn confirmation-btn-no" disabled={isSubmitting}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .survey-root {
          padding: 2.5rem 1rem 4rem;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
          background: var(--color-background);
        }

        .survey-main {
          width: min(980px, 100%);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .survey-card {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
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
          color: var(--color-muted-text);
          line-height: 1.7;
          max-width: 55rem;
        }

        .survey-form {
          display: grid;
          gap: 1rem;
        }

        .survey-question {
          border: 1px solid var(--color-border);
          border-radius: 24px;
          padding: 1.25rem 1.25rem 1rem;
          background: var(--color-question-bg);
        }

        .question-legend {
          margin: 0 0 0.75rem 0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-muted-text);
          font-weight: 700;
        }

        .question-text {
          margin: 0 0 1rem;
          color: var(--color-text);
          line-height: 1.6;
          font-size: 1rem;
        }

        .text-input, .select-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 1rem;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
          justify-content: flex-start;
        }

        .submitButton {
          border: none;
          border-radius: 999px;
          background: var(--color-button-bg);
          color: var(--color-button-text);
          padding: 0.95rem 1.4rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .submitButton:hover {
          transform: translateY(-1px);
          background: var(--color-accent);
        }

        .submitButton.secondary {
          background: var(--color-background);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .submitButton.secondary:hover:not(:disabled) {
          background: var(--color-accent);
          border-color: var(--color-accent);
        }

        .confirmation {
          margin: 0;
          color: var(--color-text);
          font-weight: 700;
        }

        .message {
          margin: 0;
          color: var(--color-success);
          font-size: 0.95rem;
        }

        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .confirmation-modal {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
        }

        .confirmation-title {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
        }

        .confirmation-message {
          margin: 0 0 1.5rem 0;
          color: var(--color-text);
          line-height: 1.6;
          font-size: 1rem;
        }

        .confirmation-actions {
          display: flex;
          gap: 0.75rem;
          flex-direction: column;
        }

        .confirmation-btn {
          border: none;
          border-radius: 999px;
          padding: 0.95rem 1.4rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .confirmation-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .confirmation-btn-yes {
          background: var(--color-button-bg);
          color: var(--color-button-text);
        }

        .confirmation-btn-yes:hover:not(:disabled) {
          transform: translateY(-1px);
          background: var(--color-accent);
        }

        .confirmation-btn-no {
          background: var(--color-button-secondary-bg);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .confirmation-btn-no:hover:not(:disabled) {
          transform: translateY(-1px);
          background: var(--color-background);
        }

        @media (max-width: 680px) {
          .survey-card {
            padding: 1.5rem;
          }

          .options {
            gap: 0.5rem;
          }

          .option {
            padding: 0.35rem 0;
          }

          .survey-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  )
}