/**
 * Gamification yardımcıları
 * Tüm veriler localStorage'da saklanır.
 */

const LS_KEYS = {
  points: 'passengerPoints',
  passport: 'galaxyPassport',
  unlocked: 'specialStationsUnlocked'
}

// Güvenli parse
function safeParse(json, fallback) {
  try { return JSON.parse(json) } catch { return fallback }
}

/** Yolcu puanı ekler */
export function addPassengerPoint(amount = 1) {
  const current = Number(localStorage.getItem(LS_KEYS.points) || 0)
  const next = current + amount
  localStorage.setItem(LS_KEYS.points, String(next))
  return next
}

/** Puanı döndürür */
export function getPassengerPoints() {
  return Number(localStorage.getItem(LS_KEYS.points) || 0)
}

/** Galaksi pasaportuna istasyon damgası ekler (tekrarsız) */
export function addStationStamp(stationId) {
  if (!stationId) return getGalaxyPassport()
  const passport = safeParse(localStorage.getItem(LS_KEYS.passport), [])
  // Null check: passport null olabilir, bu durumda [] kullan
  const safePassport = passport || []
  if (!safePassport.includes(stationId)) {
    safePassport.push(stationId)
    localStorage.setItem(LS_KEYS.passport, JSON.stringify(safePassport))
  }
  return safePassport
}

/** Pasaport damgalarını döndürür */
export function getGalaxyPassport() {
  return safeParse(localStorage.getItem(LS_KEYS.passport), [])
}

/** Özel duraklar açıldı mı? (varsayılan eşik 100 puan) */
export function isSpecialStationUnlocked(threshold = 100) {
  return getPassengerPoints() >= threshold
}

/** Leaderboard (mock) - kendi puanını dahil eder */
export function getLeaderboard() {
  const me = getPassengerPoints()
  const mock = [
    { name: 'AstralDJ', points: 180 },
    { name: 'CosmoQueen', points: 150 },
    { name: 'NebulaNinja', points: 120 }
  ]
  const withMe = [{ name: 'Sen', points: me }, ...mock]
  return withMe.sort((a, b) => b.points - a.points)
}
