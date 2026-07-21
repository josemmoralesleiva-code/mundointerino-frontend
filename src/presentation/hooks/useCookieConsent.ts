import { useCallback, useEffect, useState } from 'react'
import {
  storage,
  isConsentValid,
  CONSENT_VERSION,
  type CookieConsent,
} from '../../infrastructure/storage/localStorage'

export type ConsentStatus = 'accepted' | 'rejected' | null

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(() =>
    storage.getCookieConsent(),
  )
  const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(false)

  useEffect(() => {
    const current = storage.getCookieConsent()
    setConsent(current)
    setShouldShowBanner(!isConsentValid(current))
  }, [])

  const accept = useCallback(() => {
    const next: CookieConsent = {
      status: 'accepted',
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    storage.setCookieConsent(next)
    setConsent(next)
    setShouldShowBanner(false)
  }, [])

  const reject = useCallback(() => {
    const next: CookieConsent = {
      status: 'rejected',
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    storage.setCookieConsent(next)
    setConsent(next)
    setShouldShowBanner(false)
  }, [])

  const revoke = useCallback(() => {
    storage.clearCookieConsent()
    setConsent(null)
    setShouldShowBanner(true)
  }, [])

  return {
    consent,
    status: consent?.status ?? null,
    shouldShowBanner,
    accept,
    reject,
    revoke,
  }
}