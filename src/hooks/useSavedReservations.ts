import { useLocalStorage } from './useLocalStorage'

export interface SavedReservation {
  code: string
  productId: string
  productName: string
  storeName: string
  storeAddress: string
  customerName: string
  reservedAt: string
  expiresAt: string
}

export function useSavedReservations() {
  const [reservations, setReservations] = useLocalStorage<SavedReservation[]>('paraat_reservations', [])

  const add = (r: SavedReservation) =>
    setReservations((prev) => [r, ...prev.filter((x) => x.code !== r.code)])

  return { reservations, add }
}
