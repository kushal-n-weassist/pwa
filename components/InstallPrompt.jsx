'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if the event was already stashed before this component mounted
    if (window.__installPromptEvent) {
      setDeferredPrompt(window.__installPromptEvent)
      setShow(true)
      return
    }

    // Listen for real beforeinstallprompt (first load)
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    // Also listen for the custom event from Provider
    const readyHandler = () => {
      if (window.__installPromptEvent) {
        setDeferredPrompt(window.__installPromptEvent)
        setShow(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('installpromptready', readyHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('installpromptready', readyHandler)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log('[InstallPrompt] outcome:', outcome)
    window.__installPromptEvent = null
    setDeferredPrompt(null)
    setShow(false)
  }

  const close = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up">
        {/* App icon + name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
            <img src="/icons/pwa-192x192.png" alt="Fusion" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Install Fusion</h2>
            <p className="text-sm text-gray-500">Add to your home screen</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Get the full app experience — faster load, offline access, and it works just like a native app on your device.
        </p>

        <div className="flex gap-3">
          <button
            onClick={close}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm active:bg-gray-50 transition-colors"
          >
            Not now
          </button>
          <button
            onClick={installApp}
            className="flex-1 py-3 rounded-xl bg-[#1DA1FA] text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            Install
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
    </div>
  )
}
