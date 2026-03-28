import React from 'react'
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container" style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial' }}>
      <Head>
        <title>hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Header title="hello" />
        </div>

        <section style={{ marginTop: '1.5rem', maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>hello</h1>
          <p style={{ color: '#555', lineHeight: '1.75' }}>
            Welcome to the starter page. This page introduces the application and lets you move on to the survey.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
