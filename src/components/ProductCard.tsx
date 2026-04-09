import { Link } from 'react-router-dom'
import { MapPin, Clock, Tag, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { formatDistance } from '../data/mockData'

interface ProductCardProps {
  product: Product
  distance?: number
  highlight?: boolean
}

export default function ProductCard({ product, distance, highlight }: ProductCardProps) {
  const inStock = product.available && product.stock > 0

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        highlight
          ? 'border-brand-400 shadow-lg shadow-brand-100 ring-2 ring-brand-200'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative flex-shrink-0">
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
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mb-1">
                {product.category}
              </span>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
            </div>
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              {product.price.toFixed(2).replace('.', ',')} €
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <ShoppingBag className="w-3 h-3" />
              {product.store.name}
            </span>
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

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  inStock ? 'bg-green-500' : 'bg-red-400'
                }`}
              />
              <span className={`text-xs font-medium ${inStock ? 'text-green-700' : 'text-red-500'}`}>
                {inStock ? `${product.stock} verfügbar` : 'Nicht verfügbar'}
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
