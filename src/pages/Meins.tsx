import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Ticket, MapPin, Clock, ChevronRight, X } from 'lucide-react'
import QRCode from 'qrcode'
import { useFavorites } from '../hooks/useFavorites'
import { useSavedReservations, type SavedReservation } from '../hooks/useSavedReservations'
import { products, getMinPrice } from '../data/mockData'

type Tab = 'favoriten' | 'reservierungen'

// Unique catalog products from favorites (deduplicated by catalogId)
function useFavoriteProducts(ids: string[]) {
  const seen = new Set<string>()
  return products.filter((p) => {
    if (!ids.includes(p.catalogId)) return false
    if (seen.has(p.catalogId)) return false
    seen.add(p.catalogId)
    return true
  })
}

function ReservationModal({ res, onClose }: { res: SavedReservation; onClose: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(res.code, {
      width: 220, margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [res.code])

  const expires = new Date(res.expiresAt)
  const isExpired = expires < new Date()
  const expiresStr = expires.toLocaleString('de-DE', {
    weekday: 'long', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Handle + close */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2" />
          <div />
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-4 pb-8">
          {/* Store header */}
          <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#E05C00' }}>
            <div className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium">{res.storeName}</p>
                <p className="text-white font-semibold text-sm">{res.productName}</p>
              </div>
              {isExpired && (
                <span className="text-[10px] font-bold bg-white/20 text-white rounded-full px-2 py-0.5">
                  Abgelaufen
                </span>
              )}
            </div>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center py-4">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR-Code" className={`w-48 h-48 rounded-xl ${isExpired ? 'opacity-30 grayscale' : ''}`} />
            ) : (
              <div className="w-48 h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <p className="font-mono font-bold text-xl tracking-widest text-gray-800 mt-4">{res.code}</p>
            <p className="text-xs text-gray-400 mt-1">Code für den Händler-Scan</p>
          </div>

          {/* Expiry */}
          <div className={`rounded-xl px-4 py-2.5 flex items-center gap-2 mb-4 ${
            isExpired ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'
          }`}>
            <Clock className={`w-4 h-4 flex-shrink-0 ${isExpired ? 'text-red-400' : 'text-amber-500'}`} />
            <p className={`text-xs ${isExpired ? 'text-red-600' : 'text-amber-700'}`}>
              {isExpired ? 'Abgelaufen' : 'Gültig'} bis <strong>{expiresStr} Uhr</strong>
            </p>
          </div>

          {/* Store details */}
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{res.storeName}</p>
                <p className="text-xs text-gray-500">{res.storeAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-gray-700">Zu zahlen vor Ort</p>
              <p className="text-xs text-gray-400">Bezahlung direkt im Laden</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Meins() {
  const [tab, setTab] = useState<Tab>('favoriten')
  const [activeReservation, setActiveReservation] = useState<SavedReservation | null>(null)
  const { ids } = useFavorites()
  const { reservations } = useSavedReservations()

  const favProducts = useFavoriteProducts(ids)

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {activeReservation && (
        <ReservationModal res={activeReservation} onClose={() => setActiveReservation(null)} />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Meins</h1>
        <div className="flex gap-0">
          <button
            onClick={() => setTab('favoriten')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'favoriten' ? 'border-[#E05C00] text-[#E05C00]' : 'border-transparent text-gray-400'
            }`}
          >
            <Heart className="w-4 h-4" />
            Gespeichert
            {ids.length > 0 && (
              <span className="ml-1 text-[10px] font-bold bg-[#E05C00] text-white rounded-full px-1.5 py-0.5 leading-none">
                {ids.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('reservierungen')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'reservierungen' ? 'border-[#E05C00] text-[#E05C00]' : 'border-transparent text-gray-400'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Reservierungen
            {reservations.length > 0 && (
              <span className="ml-1 text-[10px] font-bold bg-[#E05C00] text-white rounded-full px-1.5 py-0.5 leading-none">
                {reservations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {tab === 'favoriten' && (
          favProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-semibold text-gray-500 mb-1">Noch keine Favoriten</p>
              <p className="text-sm text-gray-400 mb-4">Tippe auf das Herz-Symbol bei einem Produkt.</p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05C00] border border-[#E05C00] rounded-xl px-4 py-2">
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favProducts.map((product) => {
                const minPrice = getMinPrice(product.catalogId)
                const storeCount = products.filter((p) => p.catalogId === product.catalogId && p.available && p.stock > 0).length
                return (
                  <Link
                    key={product.catalogId}
                    to={`/product/${product.id}`}
                    className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E05C00] bg-orange-50 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 leading-tight line-clamp-1">{product.name}</h3>
                      {storeCount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 inline mr-0.5" />
                          {storeCount} {storeCount === 1 ? 'Händler' : 'Händler'} verfügbar
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <div className="text-right">
                        {minPrice !== null ? (
                          <>
                            <p className="text-[10px] text-gray-400">ab</p>
                            <p className="text-sm font-bold text-gray-900">{minPrice.toFixed(2).replace('.', ',')} €</p>
                          </>
                        ) : (
                          <p className="text-xs text-gray-400">n.v.</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        )}

        {tab === 'reservierungen' && (
          reservations.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-semibold text-gray-500 mb-1">Keine Reservierungen</p>
              <p className="text-sm text-gray-400 mb-4">Reservierte Produkte erscheinen hier.</p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05C00] border border-[#E05C00] rounded-xl px-4 py-2">
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((r) => {
                const expires = new Date(r.expiresAt)
                const isExpired = expires < new Date()
                const expiresStr = expires.toLocaleString('de-DE', {
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                })
                return (
                  <button
                    key={r.code}
                    onClick={() => setActiveReservation(r)}
                    className={`w-full text-left bg-white rounded-2xl border shadow-sm p-4 transition-shadow hover:shadow-md ${
                      isExpired ? 'border-gray-100 opacity-60' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{r.productName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.storeName}</p>
                      </div>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 ${
                        isExpired ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-700'
                      }`}>
                        {isExpired ? 'Abgelaufen' : 'Aktiv'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-mono font-bold text-gray-700 tracking-wider">{r.code}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        bis {expiresStr} Uhr
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {r.storeAddress}
                    </div>
                    {!isExpired && (
                      <p className="text-[10px] text-[#E05C00] font-semibold mt-2">Tippen für QR-Code →</p>
                    )}
                  </button>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
