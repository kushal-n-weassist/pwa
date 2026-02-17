'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShow(false)
  }

  const close = () => setShow(false)




  const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
}

const modalStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '360px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
}

const actionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
}

const primaryBtn = {
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
}

const secondaryBtn = {
  backgroundColor: '#eee',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
}


  if (!show) return null


  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 8 }}>Install App</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          Get the full app experience on your device.
        </p>

        <div style={actionsStyle}>
          <button onClick={close} style={secondaryBtn}>
            Not now
          </button>
          <button onClick={installApp} style={primaryBtn}>
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
