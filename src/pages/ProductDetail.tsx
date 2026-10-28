import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Phone, Tag, Info, ChevronRight } from 'lucide-react'
import type { StockLevel } from '../types'

const STOCK_DOT: Record<StockLevel, string> = {
  high: 'bg-green-500',
  low:  'bg-yellow-400',
  none: 'bg-red-400',
}
const STOCK_LABEL: Record<StockLevel, string> = {
  high: 'Verfügbar',
  low:  'Wenige da',
  none: 'Nicht vorrätig',
}
const STOCK_TEXT: Record<StockLevel, string> = {
  high: 'text-green-700',
  low:  'text-yellow-700',
  none: 'text-red-600',
}
import { products, getDistance, formatDistance, formatStockAge } from '../data/mockData'

const USER_LAT = 52.3759
const USER_LNG = 9.7320

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === productId)

  if (!product) {
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

  const inStock = product.available && product.stock > 0
  const fee = product.price > 10 ? Math.round(product.price * 0.1 * 100) / 100 : 0
  const distance = getDistance(USER_LAT, USER_LNG, product.store.lat, product.store.lng)

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {/* Hero image with back button */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        {!inStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Vergriffen
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Product info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mb-2">
            {product.category}
          </span>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <span className="text-2xl font-extrabold text-gray-900 whitespace-nowrap">
              {product.price.toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>

          {/* Availability */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STOCK_DOT[product.stockLevel]}`} />
              <span className={`text-sm font-semibold ${STOCK_TEXT[product.stockLevel]}`}>
                {STOCK_LABEL[product.stockLevel]}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              Stand: {formatStockAge(product.stockUpdatedAt)}
            </span>
          </div>
        </div>

        {/* Store info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Händler</h2>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/store/${product.store.id}`}
                  className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-0.5"
                >
                  {product.store.name}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {product.store.address}, {product.store.city}
                </p>
                <p className="text-xs text-brand-600 mt-0.5 font-medium">
                  {formatDistance(distance)} entfernt
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{product.store.openingHours}</span>
            </div>
            {product.store.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href={`tel:${product.store.phone}`} className="text-sm text-brand-600 hover:underline">
                  {product.store.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Fee notice */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 flex gap-3">
          <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-brand-700">
            {fee > 0
              ? `Reservierungsgebühr: ${fee.toFixed(2).replace('.', ',')} € (10% des Produktpreises). Wird beim Kauf vollständig angerechnet.`
              : 'Ab 10 € Produktpreis wird eine Reservierungsgebühr von 10% erhoben. Dieses Produkt ist kostenlos reservierbar.'}
          </p>
        </div>

        {/* CTA */}
        {inStock ? (
          <Link
            to={`/reserve/${product.id}`}
            className="flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-2xl text-sm shadow-lg transition-colors"
            style={{ background: '#E05C00' }}
          >
            <Tag className="w-4 h-4" />
            {fee > 0
              ? `Reservieren für ${fee.toFixed(2).replace('.', ',')} €`
              : 'Kostenlos reservieren'}
          </Link>
        ) : (
          <button
            disabled
            className="w-full py-4 rounded-2xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Nicht verfügbar
          </button>
        )}
      </div>
    </div>
  )
}
