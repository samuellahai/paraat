import { Link } from 'react-router-dom'
import { MapPin, Clock, Tag, ChevronRight, Heart } from 'lucide-react'
import type { Product, StockLevel } from '../types'
import { formatDistance, formatStockAge } from '../data/mockData'
import { useFavorites } from '../hooks/useFavorites'

const STOCK_BADGE: Record<StockLevel, { dot: string; label: string; text: string }> = {
  high: { dot: 'bg-green-500',  label: 'Verfügbar', text: 'text-green-700' },
  low:  { dot: 'bg-yellow-400', label: 'Wenige',    text: 'text-yellow-700' },
  none: { dot: 'bg-red-400',    label: 'Nicht da',  text: 'text-red-600' },
}

interface ProductCardProps {
  product: Product
  distance?: number
  highlight?: boolean
}

export default function ProductCard({ product, distance, highlight }: ProductCardProps) {
  const inStock = product.available && product.stock > 0
  const { isFav, toggle } = useFavorites()
  const fav = isFav(product.id)

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        highlight
          ? 'border-brand-400 shadow-lg shadow-brand-100 ring-2 ring-brand-200'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Clickable area → product detail */}
        <Link to={`/product/${product.id}`} className="relative flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-20 h-20 rounded-xl object-cover bg-gray-100"
            loading="lazy"
          />
            {!inStock && (
            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Vergriffen</span>
            </div>
          )}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id) }}
            className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
          >
            <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
          </button>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}`} className="block">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mb-1">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight flex items-center gap-1">
                  {product.name}
                  <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                </h3>
              </div>
              <div className="flex flex-col items-end">
                {product.onSale && product.salePrice != null ? (
                  <>
                    <span className="text-lg font-bold whitespace-nowrap" style={{ color: '#E05C00' }}>
                      {product.salePrice.toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-xs text-gray-400 line-through whitespace-nowrap">
                      {product.price.toFixed(2).replace('.', ',')} €
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                    {product.price.toFixed(2).replace('.', ',')} €
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <Link
                to={`/store/${product.store.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-brand-600 hover:underline font-medium"
              >
                <MapPin className="w-3 h-3" />
                {product.store.name}
              </Link>
              {distance !== undefined && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {formatDistance(distance)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {product.store.openingHours}
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STOCK_BADGE[product.stockLevel].dot}`} />
                <span className={`text-xs font-semibold ${STOCK_BADGE[product.stockLevel].text}`}>
                  {STOCK_BADGE[product.stockLevel].label}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 pl-3.5">
                Stand: {formatStockAge(product.stockUpdatedAt)}
              </span>
            </div>

            {inStock ? (
              <Link
                to={`/reserve/${product.id}`}
                className="flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Tag className="w-3 h-3" />
                Reservieren
              </Link>
            ) : (
              <button
                disabled
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                Nicht verfügbar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
