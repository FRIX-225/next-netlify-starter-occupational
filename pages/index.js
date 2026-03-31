import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
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
              This is a professional, secure survey interface for Comenius University research participants. Please click below to start and complete each question honestly.
            </p>
          </section>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Link href="/survey" className="primary-cta">
              Start survey
            </Link>
          </div>

          <section className="body-text" style={{ marginTop: '1.6rem', background: 'var(--color-background)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--color-border)' }}>
            <p>
              Participation is anonymous and voluntary. Data is handled in compliance with GDPR standards. By continuing, you consent to use your aggregated feedback for occupational research and quality improvements.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
