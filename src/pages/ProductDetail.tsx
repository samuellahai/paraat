import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Phone, Heart, Tag } from 'lucide-react'
import type { StockLevel } from '../types'
import { products, getDistance, formatDistance, formatStockAge, getProductVariants } from '../data/mockData'
import { useFavorites } from '../hooks/useFavorites'

const STOCK_DOT: Record<StockLevel, string> = {
  high: 'bg-green-500', low: 'bg-yellow-400', none: 'bg-red-400',
}
const STOCK_LABEL: Record<StockLevel, string> = {
  high: 'Verfügbar', low: 'Wenige da', none: 'Nicht vorrätig',
}
const STOCK_TEXT: Record<StockLevel, string> = {
  high: 'text-green-700', low: 'text-yellow-700', none: 'text-red-600',
}

const USER_LAT = 52.3759
const USER_LNG = 9.7320

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  // Find primary product and all variants (same product, different stores)
  const primaryProduct = products.find((p) => p.id === productId)
  const { isFav, toggle } = useFavorites()
  const fav = primaryProduct ? isFav(primaryProduct.catalogId) : false

  if (!primaryProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-4">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-semibold text-gray-700 mb-2">Produkt nicht gefunden</p>
          <Link to="/" className="text-brand-600 hover:underline text-sm">Zur Startseite</Link>
        </div>
      </div>
    )
  }

  const variants = getProductVariants(primaryProduct.catalogId)
  const sortedVariants = [...variants].sort((a, b) => {
    // available first, then by distance
    if (a.available !== b.available) return a.available ? -1 : 1
    const dA = getDistance(USER_LAT, USER_LNG, a.store.lat, a.store.lng)
    const dB = getDistance(USER_LAT, USER_LNG, b.store.lat, b.store.lng)
    return dA - dB
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {/* Hero image */}
      <div className="relative">
        <img src={primaryProduct.imageUrl} alt={primaryProduct.name} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => toggle(primaryProduct.catalogId)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Product info — no price here (varies by store) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mb-2">
            {primaryProduct.category}
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{primaryProduct.name}</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{primaryProduct.description}</p>
          {primaryProduct.barcode && (
            <p className="text-xs text-gray-300 mt-2 font-mono">EAN {primaryProduct.barcode}</p>
          )}
        </div>

        {/* Store list — one row per variant */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              {variants.length === 1 ? 'Händler' : `${variants.length} Händler in der Nähe`}
            </h2>
          </div>

          {sortedVariants.map((v, i) => {
            const dist = getDistance(USER_LAT, USER_LNG, v.store.lat, v.store.lng)
            const displayPrice = v.onSale && v.salePrice != null ? v.salePrice : v.price
            const inStock = v.available && v.stock > 0

            return (
              <div
                key={v.id}
                className={`px-5 py-4 ${i < sortedVariants.length - 1 ? 'border-b border-gray-100' : ''} ${
                  !inStock ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/store/${v.store.id}`}
                      className="text-sm font-bold text-brand-600 hover:underline"
                    >
                      {v.store.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{v.store.address} · {formatDistance(dist)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{v.store.openingHours}</span>
                    </div>
                    {v.store.phone && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <a href={`tel:${v.store.phone}`} className="text-xs text-brand-600 hover:underline">{v.store.phone}</a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      {v.onSale && v.salePrice != null ? (
                        <>
                          <span className="text-lg font-extrabold" style={{ color: '#E05C00' }}>
                            {displayPrice.toFixed(2).replace('.', ',')} €
                          </span>
                          <div className="text-xs text-gray-400 line-through">
                            {v.price.toFixed(2).replace('.', ',')} €
                          </div>
                        </>
                      ) : (
                        <span className="text-lg font-extrabold text-gray-900">
                          {displayPrice.toFixed(2).replace('.', ',')} €
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STOCK_DOT[v.stockLevel]}`} />
                      <span className={`text-xs font-semibold ${STOCK_TEXT[v.stockLevel]}`}>
                        {STOCK_LABEL[v.stockLevel]}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">{formatStockAge(v.stockUpdatedAt)}</span>

                    {inStock ? (
                      <button
                        onClick={() => navigate(`/reserve/${v.id}/${v.store.id}`)}
                        className="flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2 rounded-xl shadow"
                        style={{ background: '#E05C00' }}
                      >
                        <Tag className="w-3 h-3" />
                        Reservieren
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Nicht verfügbar</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info box */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 text-xs text-brand-700">
          Reservierung ist 72 Stunden gültig. Bezahlung direkt im Laden beim Abholen.
        </div>
      </div>
    </div>
  )
}
