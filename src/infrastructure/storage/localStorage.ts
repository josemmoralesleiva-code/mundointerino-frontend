import type { AuthUser } from '../dto/auth.dto'

const KEYS = {
  usuario: 'usuario',
  cookieConsent: 'mi_cookie_consent',
} as const

export interface CookieConsent {
  status: 'accepted' | 'rejected'
  timestamp: string
  version: number
}

export const CONSENT_VERSION = 1
export const CONSENT_TTL_MS = 12 * 30 * 24 * 60 * 60 * 1000

export const storage = {
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(KEYS.usuario)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  updateUser(user: AuthUser): void {
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  clearUser(): void {
    localStorage.removeItem(KEYS.usuario)
  },

  getCookieConsent(): CookieConsent | null {
    const raw = localStorage.getItem(KEYS.cookieConsent)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as CookieConsent
      if (!parsed || typeof parsed.status !== 'string') return null
      return parsed
    } catch {
      return null
    }
  },

  setCookieConsent(consent: CookieConsent): void {
    localStorage.setItem(KEYS.cookieConsent, JSON.stringify(consent))
  },

  clearCookieConsent(): void {
    localStorage.removeItem(KEYS.cookieConsent)
  },
}

export function isConsentExpired(consent: CookieConsent | null): boolean {
  if (!consent?.timestamp) return true
  const ts = new Date(consent.timestamp).getTime()
  if (Number.isNaN(ts)) return true
  return Date.now() - ts > CONSENT_TTL_MS
}

export function isConsentValid(consent: CookieConsent | null): consent is CookieConsent {
  return !!consent && consent.version === CONSENT_VERSION && !isConsentExpired(consent)
}