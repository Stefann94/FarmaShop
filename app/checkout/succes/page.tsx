import React from 'react'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export const metadata = {
  title: 'Comandă finalizată | FarmaShop',
}

export default function CheckoutSuccessPage() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="80" width="80" xmlns="http://www.w3.org/2000/svg" style={{ color: '#2e8b57', marginBottom: '20px' }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 style={titleStyle}>Comanda a fost înregistrată!</h1>
        <p style={descStyle}>
          Îți mulțumim pentru cumpărături. Un email de confirmare a fost trimis către adresa ta de email.
        </p>
        <Link href="/account/comenzi" style={btnStyle}>
          Vezi comenzile tale
        </Link>
        <Link href="/" style={linkStyle}>
          Întoarce-te la magazin
        </Link>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  padding: '20px',
  backgroundColor: '#fafafa',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '50px 30px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  color: '#1a2b22',
  marginBottom: '15px',
  fontWeight: 700,
}

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '1.1rem',
  lineHeight: '1.5',
  marginBottom: '30px',
}

const btnStyle: React.CSSProperties = {
  backgroundColor: '#2e8b57',
  color: 'white',
  padding: '14px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1.05rem',
  marginBottom: '15px',
  width: '100%',
  transition: 'background-color 0.2s',
}

const linkStyle: React.CSSProperties = {
  color: '#2e8b57',
  textDecoration: 'none',
  fontWeight: 600,
}
