import Image from 'next/image'

export default function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <div className="brand">
        <Image src="/comenius-logo.png" width={64} height={64} alt="Comenius University logo" />
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{'Occupational Survey'}</p> : null}
        </div>
      </div>
    </header>
  )
}
