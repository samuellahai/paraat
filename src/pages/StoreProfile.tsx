import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import { stores, products, getDistance, formatDistance, formatStockAge } from '../data/mockData'
import type { StockLevel } from '../types'

const USER_LAT = 52.3759
const USER_LNG = 9.7320

const STOCK_DOT: Record<StockLevel, string> = {
  high: 'bg-green-500',
  low:  'bg-yellow-400',
  none: 'bg-red-400',
}
const STOCK_LABEL: Record<StockLevel, string> = {
  high: 'Verfügbar',
  low:  'Wenige',
  none: 'Nicht da',
}
const STOCK_TEXT: Record<StockLevel, string> = {
  high: 'text-green-700',
  low:  'text-yellow-700',
  none: 'text-red-600',
}

export default function StoreProfile() {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const store = stores.find((s) => s.id === storeId)
  const [photoIdx, setPhotoIdx] = useState(0)

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-semibold text-gray-700 mb-2">Laden nicht gefunden</p>
          <Link to="/" className="text-brand-600 hover:underline text-sm">Zur Startseite</Link>
        </div>
      </div>
    )
  }

  const storeProducts = products.filter((p) => p.store.id === storeId)
  const availableCount = storeProducts.filter((p) => p.stockLevel !== 'none').length
  const distance = getDistance(USER_LAT, USER_LNG, store.lat, store.lng)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${store.address}, ${store.city}`
  )}`

  const photos = store.photos ?? []

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">

      {/* Hero photo */}
      <div className="relative bg-gray-200" style={{ height: 220 }}>
        {photos.length > 0 ? (
          <img
            src={photos[photoIdx]}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏪</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Photo dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === photoIdx ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Store name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h1 className="text-white text-2xl font-extrabold leading-tight drop-shadow">
            {store.name}
          </h1>
          <p className="text-white/80 text-sm mt-0.5">
            {formatDistance(distance)} entfernt · {availableCount} von {storeProducts.length} Produkten verfügbar
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          {store.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{store.description}</p>
          )}

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-800">{store.address}, {store.city}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline flex items-center gap-0.5 mt-0.5"
                >
                  Route öffnen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{store.openingHours}</span>
            </div>
            {store.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href={`tel:${store.phone}`} className="text-sm text-brand-600 hover:underline">
                  {store.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Produkte ({storeProducts.length})
          </h2>

          {storeProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Keine Produkte eingetragen</p>
          ) : (
            <div className="space-y-2">
              {storeProducts.map((product) => {
                const displayPrice = product.onSale && product.salePrice != null
                  ? product.salePrice
                  : product.price
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STOCK_DOT[product.stockLevel]}`} />
                        <span className={`text-xs font-medium ${STOCK_TEXT[product.stockLevel]}`}>
                          {STOCK_LABEL[product.stockLevel]}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          · {formatStockAge(product.stockUpdatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">
                        {displayPrice.toFixed(2).replace('.', ',')} €
                      </span>
                      {product.onSale && product.salePrice != null && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {product.price.toFixed(2).replace('.', ',')} €
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Search this store CTA */}
        <Link
          to={`/results?storeId=${store.id}`}
          className="flex items-center justify-center gap-2 w-full text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg transition-colors"
          style={{ background: '#E05C00' }}
        >
          Alle Produkte durchsuchen
        </Link>
      </div>
    </div>
  )
}
