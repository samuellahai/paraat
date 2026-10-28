import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Ticket, MapPin, Clock, ChevronRight } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useSavedReservations } from '../hooks/useSavedReservations'
import { products } from '../data/mockData'

type Tab = 'favoriten' | 'reservierungen'

export default function Meins() {
  const [tab, setTab] = useState<Tab>('favoriten')
  const { ids } = useFavorites()
  const { reservations } = useSavedReservations()

  const favProducts = products.filter((p) => ids.includes(p.id))

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Meins</h1>
        {/* Tabs */}
        <div className="flex gap-0">
          <button
            onClick={() => setTab('favoriten')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'favoriten'
                ? 'border-[#E05C00] text-[#E05C00]'
                : 'border-transparent text-gray-400'
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
              tab === 'reservierungen'
                ? 'border-[#E05C00] text-[#E05C00]'
                : 'border-transparent text-gray-400'
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
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05C00] border border-[#E05C00] rounded-xl px-4 py-2"
              >
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favProducts.map((product) => (
                <Link
                  key={product.id}
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
                    <h3 className="font-semibold text-gray-900 text-sm mt-1 leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{product.store.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {(product.onSale && product.salePrice != null ? product.salePrice : product.price)
                        .toFixed(2).replace('.', ',')} €
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === 'reservierungen' && (
          reservations.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-semibold text-gray-500 mb-1">Keine Reservierungen</p>
              <p className="text-sm text-gray-400 mb-4">Reservierte Produkte erscheinen hier.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05C00] border border-[#E05C00] rounded-xl px-4 py-2"
              >
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((r) => {
                const expires = new Date(r.expiresAt)
                const isExpired = expires < new Date()
                const expiresStr = expires.toLocaleString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                return (
                  <div
                    key={r.code}
                    className={`bg-white rounded-2xl border shadow-sm p-4 ${
                      isExpired ? 'border-gray-100 opacity-60' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{r.productName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.storeName}</p>
                      </div>
                      {isExpired ? (
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-400 rounded-full px-2 py-0.5 flex-shrink-0">
                          Abgelaufen
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-green-50 text-green-700 rounded-full px-2 py-0.5 flex-shrink-0">
                          Aktiv
                        </span>
                      )}
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
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
