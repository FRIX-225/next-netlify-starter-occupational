import Link from 'next/link'

export default function ThanksPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1>Thank you!</h1>
      <p style={{ maxWidth: '38rem', margin: '1rem 0' }}>
        Your survey responses have been received. We appreciate your time and feedback.
      </p>
      <Link href="/" style={{
        marginTop: '1.5rem',
        padding: '0.75rem 1.25rem',
        background: '#242633',
        color: '#fff',
        borderRadius: '999px',
        textDecoration: 'none',
      }}>
        Return to home
      </Link>
    </main>
  )
}