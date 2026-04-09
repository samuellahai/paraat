import { useParams, useLocation, Link } from 'react-router-dom'
import { CheckCircle, MapPin, Navigation, Clock, Tag, Phone, Share2, Home } from 'lucide-react'
import { products } from '../data/mockData'

interface LocationState {
  customerName?: string
  customerEmail?: string
}

export default function Confirmation() {
  const { productId } = useParams<{ productId: string }>()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}
  const product = products.find((p) => p.id === productId)

  const reservationCode = `TRF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const expiresStr = expiresAt.toLocaleString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-14">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-semibold text-gray-700 mb-2">Reservierung nicht gefunden</p>
          <Link to="/" className="text-brand-600 hover:underline text-sm">Zur Startseite</Link>
        </div>
      </div>
    )
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${product.store.address}, ${product.store.city}`
  )}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Treffer Reservierung',
        text: `Ich habe ${product.name} bei ${product.store.name} reserviert! Code: ${reservationCode}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reservierung bestätigt!</h1>
          <p className="text-sm text-gray-500">
            {state.customerName ? `Hey ${state.customerName.split(' ')[0]}, deine` : 'Deine'} Reservierung ist aktiv.
            {state.customerEmail && (
              <> Eine Bestätigung wurde an <strong>{state.customerEmail}</strong> gesendet.</>
            )}
          </p>
        </div>

        {/* Reservation card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {/* Code strip */}
          <div className="bg-gradient-to-r from-brand-500 to-orange-500 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Reservierungscode</p>
              <p className="text-white font-mono text-2xl font-bold tracking-widest mt-0.5">{reservationCode}</p>
            </div>
            <Tag className="w-8 h-8 text-white/50" />
          </div>

          {/* Product info */}
          <div className="p-5">
            <div className="flex gap-3 mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-gray-100 pt-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{product.store.name}</p>
                  <p className="text-xs text-gray-500">{product.store.address}, {product.store.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <p className="text-sm text-gray-700">{product.store.openingHours}</p>
              </div>
              {product.store.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <a href={`tel:${product.store.phone}`} className="text-sm text-brand-600 hover:underline">
                    {product.store.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Produktpreis</span>
              <span className="text-gray-700">{product.price.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Reservierungsgebühr (bereits bezahlt)</span>
              <span className="text-green-600">−2,00 €</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
              <span>Restbetrag vor Ort</span>
              <span className="text-gray-900">{Math.max(0, product.price - 2).toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
        </div>

        {/* Expiry notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 mb-6">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Reservierung gültig bis <strong>{expiresStr} Uhr</strong>. Bitte zeige den Code im Laden vor.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors shadow-lg shadow-brand-200"
          >
            <Navigation className="w-4 h-4" />
            Route in Google Maps öffnen
          </a>

          {navigator.share && (
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
