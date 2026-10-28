import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { CheckCircle, MapPin, Navigation, Clock, Phone, Share2, Home } from 'lucide-react'
import QRCode from 'qrcode'
import { products } from '../data/mockData'

interface LocationState {
  customerName?: string
  customerPhone?: string
}

function useQRCode(value: string) {
  const [dataUrl, setDataUrl] = useState<string>('')
  useEffect(() => {
    QRCode.toDataURL(value, {
      width: 220,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).then(setDataUrl)
  }, [value])
  return dataUrl
}

export default function Confirmation() {
  const { productId } = useParams<{ productId: string }>()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}
  const product = products.find((p) => p.id === productId)

  const codeRef = useRef(`PAR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
  const reservationCode = codeRef.current

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const expiresStr = expiresAt.toLocaleString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const qrDataUrl = useQRCode(reservationCode)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-semibold text-gray-700 mb-2">Reservierung nicht gefunden</p>
          <Link to="/" className="text-brand-600 hover:underline text-sm">Zur Startseite</Link>
        </div>
      </div>
    )
  }

  const displayPrice = product.onSale && product.salePrice != null
    ? product.salePrice
    : product.price

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${product.store.address}, ${product.store.city}`
  )}`

  const handleShare = async () => {
    if ('share' in navigator) {
      await navigator.share({
        title: 'Paraat Reservierung',
        text: `Reserviert: ${product.name} bei ${product.store.name}. Code: ${reservationCode}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Success header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reserviert!</h1>
          <p className="text-sm text-gray-500">
            {state.customerName ? `Hey ${state.customerName.split(' ')[0]}, ` : ''}
            zeig diesen QR-Code im Laden vor.
          </p>
        </div>

        {/* QR card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {/* Store header strip */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: '#E05C00' }}
          >
            <div>
              <p className="text-white/80 text-xs font-medium">{product.store.name}</p>
              <p className="text-white font-semibold text-sm">{product.name}</p>
            </div>
            <p className="text-white font-bold text-lg">
              {displayPrice.toFixed(2).replace('.', ',')} €
            </p>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center py-6 px-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR-Code"
                className="w-48 h-48 rounded-xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <p className="font-mono font-bold text-xl tracking-widest text-gray-800 mt-4">
              {reservationCode}
            </p>
            <p className="text-xs text-gray-400 mt-1">Code für den Händler-Scan</p>
          </div>

          {/* Expiry */}
          <div className="mx-4 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Gültig bis <strong>{expiresStr} Uhr</strong>
            </p>
          </div>

          {/* Store details */}
          <div className="px-5 pb-5 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{product.store.name}</p>
                <p className="text-xs text-gray-500">{product.store.address}, {product.store.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">{product.store.openingHours}</p>
            </div>
            {product.store.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href={`tel:${product.store.phone}`} className="text-xs text-brand-600 hover:underline">
                  {product.store.phone}
                </a>
              </div>
            )}
          </div>

          {/* Payment note */}
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-700">Zu zahlen vor Ort</span>
              <span className="text-gray-900">{displayPrice.toFixed(2).replace('.', ',')} €</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Bezahlung direkt im Laden</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors shadow-lg shadow-brand-200"
            style={{ background: '#E05C00' }}
          >
            <Navigation className="w-4 h-4" />
            Route zum Laden öffnen
          </a>

          {'share' in navigator && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-2xl text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Reservierung teilen
            </button>
          )}

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 font-medium py-3 rounded-2xl text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
