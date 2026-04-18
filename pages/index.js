import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@components/Header'
import Footer from '@components/Footer'

const SURVEY_COMPLETED_KEY = 'surveyCompleted'

export default function Home() {
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setHasCompleted(window.localStorage.getItem(SURVEY_COMPLETED_KEY) === 'true')
  }, [])
  return (
    <>
      <div className="container">
        <Header title="Comenius University" subtitle="Occupational research participant portal" />
        <Head>
          <title>Comenius University Survey</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="primary-card">
          <section className="body-text" style={{ textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 0.9rem', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
              Welcome to the Occupational Survey
            </h1>
            <p>
              We are psychology students at Comenius University Bratislava. We would like to invite you to take part in this short survey for a school project. This survey aims to gather information about deviant behavior in the workplace. The goal of this project is to research methods of support for organizations to create safer and more efficient working environments for all. <br />
              <br />This survey is based on a study conducted in 1999 and published in the Journal of Organizational Behavior. <br />
              <br />Please click below to start the survey
            </p>
          </section>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Link href={hasCompleted ? '/thanks' : '/survey'} className="primary-cta">
              Start survey
            </Link>
          </div>

          <section className="body-text" style={{ marginTop: '1.6rem', background: 'var(--color-background)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--color-border)', textAlign: 'center'}}>
            <p>
              Participation is anonymous and voluntary. Data is handled in compliance with GDPR standards. All data will be stored securely locally, and will only be used for education purposes.<br />
              <br />By continuing, you consent to the use of your responses for research in occupational psychology.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
