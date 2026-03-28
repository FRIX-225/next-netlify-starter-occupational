import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        background: '#f4f7fb',
      }}
    >
      <Head>
        <title>hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 22px 60px rgba(15, 23, 42, 0.12)',
          padding: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
        </div>

        <section style={{ display: 'grid', gap: '1.5rem', lineHeight: 1.75, alignItems: 'center', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 0.85rem' }}>Hello</h1>
            <p style={{ color: '#475569', maxWidth: '50rem', margin: 0 }}>
              This is the starter page. This page introduces the survey and lets you move on to the questions. if more text added test test test test test test tfhkdbfksdjfhskdfhadjklsfhsdklfhsdklafhdklfjghsdfkljghsdfklgjh sdfkljghsdfjkgh sdfjklgh sdfjkgh sdfjklgh
            </p>
          </div>
          <Link
            href="/survey"
            style={{
              width: 'fit-content',
              padding: '0.95rem 1.6rem',
              background: '#2563eb',
              color: '#fff',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: 600,
              justifySelf: 'center',
            }}
          >
            Start survey
          </Link>

          <div
            style={{
              display: 'grid',
              gap: '0.85rem',
              padding: '1.45rem',
              background: '#f8fafc',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ margin: 0, color: '#334155' }}>
              Placeholder text here (can be used for consent form or any other terms and conditions): Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
