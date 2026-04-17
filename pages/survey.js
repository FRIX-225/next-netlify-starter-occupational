import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const SURVEY_COMPLETED_KEY = 'surveyCompleted'

const DEFAULT_CHOICES = ['Never', 'Rarely', 'Sometimes', 'Frequently', 'Very Frequently']

const QUESTIONS = [
  { id: 1, text: 'intentionally arriving late for work?' },
  { id: 2, text: 'calling in sick when not really ill?' },
  { id: 3, text: 'taking undeserved breaks to avoid work?' },
  { id: 4, text: 'making unauthorized use of organizational property?' },
  { id: 5, text: 'leaving work early without permission?' },
  { id: 6, text: 'lying about the number of hours worked?' },
  { id: 7, text: 'working on a personal matter on the job instead of working for the employer?' },
  { id: 8, text: 'purposely ignoring the supervisor\'s instructions?' },
  { id: 9, text: 'intentionally slowing down the pace of work?' },
  { id: 10, text: 'using an ethnic, racial, or religious slur against a co-worker?' },
  { id: 11, text: 'swearing at a co-worker?' },
  { id: 12, text: 'refusing to talk to a co-worker?' },
  { id: 13, text: 'gossiping about the supervisor?' },
  { id: 14, text: 'making an obscene comment or gesture at a co-worker?' },
  { id: 15, text: 'teasing a co-worker in front of other employees?' },
]

export default function Home() {
  const router = useRouter()
  const formRef = useRef(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(SURVEY_COMPLETED_KEY) === 'true') {
      router.replace('/thanks')
    }
  }, [router])

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
    const responses = collectResponses()
    localStorage.setItem('surveyResponses', JSON.stringify(responses))
    router.push('/demographics')
  }

  return (
    <div className="container survey-root">
      <Header title="Comenius University" subtitle="Occupational survey" />

      <main className="survey-main">
        <section className="survey-card">
          <div className="survey-header">
            <h1 className="survey-title">Occupational Survey</h1>
            <p className="survey-subtitle">Please answer the following questions based on how many times you have observed these events at your workplace.</p>
          </div>

          <form ref={formRef} aria-label="Twenty question survey" className="survey-form">
            {QUESTIONS.map((q) => (
              <fieldset key={q.id} className="survey-question">
                <legend className="question-legend">How often have you witnessed…</legend>
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
              <button type="button" onClick={handleContinue} className="submitButton" disabled={isSubmitting}>
                Continue
              </button>
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

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          width: 100%;
        }

        .option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.2rem 0.1rem;
          border-radius: 16px;
          cursor: pointer;
          user-select: none;
          color: var(--color-text);
          text-align: center;
          justify-content: center;
          flex: 1 1 auto;
          min-width: 50px;
        }

        .option:hover .option-circle {
          border-color: var(--color-muted-text);
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
          border: 1.5px solid var(--color-input-border);
          background: var(--color-input-bg);
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
          background: var(--color-accent);
          transition: transform 0.2s ease;
        }

        .option-label {
          font-size: clamp(0.7rem, 1.8vw, 0.95rem);
          font-weight: 600;
          transition: color 0.2s ease;
          width: 100%;
          line-height: 1.3;
        }

        .option input:checked + .option-label {
          color: var(--color-text);
        }

        .option input:checked + .option-label + .option-circle {
          border-color: var(--color-accent);
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
          background: var(--color-button-secondary-bg);
          color: var(--color-text);
        }

        .submitButton.secondary:hover {
          background: var(--color-accent);
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
