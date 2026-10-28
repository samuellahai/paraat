import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Crosshair, X, SlidersHorizontal } from 'lucide-react'
import MapView from '../components/MapView'
import { products, getDistance, formatDistance, formatStockAge } from '../data/mockData'
import type { StockLevel } from '../types'

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

const CATEGORIES = ['Alle', 'Fahrrad', 'Sport', 'Haushalt', 'Lebensmittel', 'Elektronik', 'Backwaren', 'Mode']
const CATEGORY_EMOJI: Record<string, string> = {
  Fahrrad: '🚲', Sport: '🏋️', Haushalt: '🏠', Lebensmittel: '🥦',
  Elektronik: '💻', Backwaren: '🍞', Mode: '👕',
}

const SHEET_H = 490
const PEEK_VIS = 65
const SNAP_PEEK = SHEET_H - PEEK_VIS  // 425
const SNAP_MID  = SHEET_H - 275       // 215
const SNAP_FULL = 0

const DEFAULT_LOC: [number, number] = [52.3759, 9.7320]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [storeFilter, setStoreFilter] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [pendingCategory, setPendingCategory] = useState('Alle')
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_LOC)
  const [locating, setLocating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Bottom sheet drag state
  const [ty, setTy] = useState(SNAP_PEEK)
  const [animating, setAnimating] = useState(false)
  const dragRef = useRef<{ startY: number; startTY: number } | null>(null)

  const clamp = (v: number) => Math.max(SNAP_FULL, Math.min(v, SNAP_PEEK))

  const snapTo = useCallback((cur: number) => {
    const snaps = [SNAP_PEEK, SNAP_MID, SNAP_FULL]
    const best = snaps.reduce((a, b) => (Math.abs(b - cur) < Math.abs(a - cur) ? b : a))
    setAnimating(true)
    setTy(best)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startY: e.clientY, startTY: ty }
    setAnimating(false)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return
    setTy(clamp(dragRef.current.startTY + (e.clientY - dragRef.current.startY)))
  }
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    snapTo(ty)
    dragRef.current = null
  }

  const handleLocate = useCallback(() => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setLocating(false) },
      () => setLocating(false),
      { timeout: 6000, enableHighAccuracy: true }
    )
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {},
        { timeout: 5000 }
      )
    }
  }, [])

  // When user focuses the search input, expand the sheet
  const handleSearchFocus = () => {
    setAnimating(true)
    setTy(SNAP_FULL)
  }

  // When a map pin is clicked, filter to that store and expand sheet
  const handleStoreClick = (storeId: string) => {
    setStoreFilter(storeId)
    setQuery('')
    setAnimating(true)
    setTy(SNAP_FULL)
  }

  const activeStoreName = storeFilter
    ? products.find((p) => p.store.id === storeFilter)?.store.name ?? null
    : null

  const hasActiveFilter = activeCategory !== 'Alle' || storeFilter !== null

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== 'Alle' && p.category !== activeCategory) return false
    if (storeFilter && p.store.id !== storeFilter) return false
    if (query) {
      const q = query.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.store.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const visibleHeight = SHEET_H - ty

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-200">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapView
          products={products}
          userLocation={userLocation}
          onStoreClick={handleStoreClick}
        />
      </div>

      {/* Top overlay: logo + locate only */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-4 pt-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
      >
        <div className="flex items-center justify-between pb-4">
          <span
            className="text-xl font-black tracking-wide"
            style={{ color: '#E05C00', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
          >
            Paraat
          </span>
          <button
            onClick={handleLocate}
            disabled={locating}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg bg-white/90"
            aria-label="Standort ermitteln"
          >
            <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin text-brand-500' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Filter modal */}
      {filterOpen && (
        <>
          <div className="absolute inset-0 z-50 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 right-0 bottom-[54px] z-50 bg-white rounded-t-2xl shadow-2xl" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="px-4 pt-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Filter</h2>
                <button onClick={() => setFilterOpen(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="px-4 py-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Kategorie</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPendingCategory(cat)}
                      className="rounded-full px-4 py-1.5 text-sm font-medium border transition-colors"
                      style={
                        pendingCategory === cat
                          ? { background: '#E05C00', color: 'white', borderColor: '#E05C00' }
                          : { background: 'white', color: '#333', borderColor: '#e5e7eb' }
                      }
                    >
                      {CATEGORY_EMOJI[cat] ? `${CATEGORY_EMOJI[cat]} ` : ''}{cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 pb-6">
              <button
                onClick={() => { setActiveCategory(pendingCategory); setFilterOpen(false) }}
                className="w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg"
                style={{ background: '#E05C00' }}
              >
                Anwenden
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom sheet */}
      <div
        className="absolute left-0 right-0 z-30 bg-white flex flex-col"
        style={{
          bottom: 54,
          height: SHEET_H,
          borderRadius: '18px 18px 0 0',
          boxShadow: '0 -3px 20px rgba(0,0,0,0.12)',
          transform: `translateY(${ty}px)`,
          transition: animating ? 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' : 'none',
          willChange: 'transform',
        }}
      >
        {/* Drag handle strip */}
        <div
          className="flex-shrink-0 pt-2.5 pb-1 select-none"
          style={{ cursor: 'grab', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => snapTo(ty)}
        >
          <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto" />
        </div>

        {/* Search row — always visible */}
        <div className="flex-shrink-0 px-3.5 pb-2 flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#aaa" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Was suchst du?"
              className="w-full rounded-xl py-2 pl-8 pr-3 text-sm text-gray-700 bg-gray-100 outline-none"
            />
            {query.length > 0 && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => { setPendingCategory(activeCategory); setFilterOpen(true) }}
            className="flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold flex-shrink-0"
            style={hasActiveFilter
              ? { background: '#E05C00', color: 'white' }
              : { background: '#f3f4f6', color: '#374151' }
            }
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        {/* Active filter chips */}
        {(activeStoreName || activeCategory !== 'Alle') && (
          <div className="flex-shrink-0 px-3.5 pb-2 flex gap-1.5 overflow-x-auto">
            {activeStoreName && (
              <button
                onClick={() => setStoreFilter(null)}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0"
                style={{ background: '#fff3ec', color: '#E05C00', border: '1px solid #fbd0b5' }}
              >
                {activeStoreName}
                <X className="w-3 h-3" />
              </button>
            )}
            {activeCategory !== 'Alle' && (
              <button
                onClick={() => setActiveCategory('Alle')}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0"
                style={{ background: '#fff3ec', color: '#E05C00', border: '1px solid #fbd0b5' }}
              >
                {CATEGORY_EMOJI[activeCategory] ?? ''} {activeCategory}
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Result count — only when expanded */}
        {visibleHeight >= 200 && (
          <div className="flex-shrink-0 px-3.5 pb-1 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Produkt' : 'Produkte'} gefunden
            </span>
          </div>
        )}

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-2">
          {filteredProducts.map((product) => {
            const inStock = product.available && product.stock > 0
            const dist = getDistance(userLocation[0], userLocation[1], product.store.lat, product.store.lng)
            const displayPrice = product.onSale && product.salePrice != null ? product.salePrice : product.price

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0"
              >
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0 text-xl">
                    {CATEGORY_EMOJI[product.category] ?? '🏪'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">{product.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Link
                        to={`/store/${product.store.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-brand-600 hover:underline font-medium truncate max-w-[120px]"
                      >
                        {product.store.name}
                      </Link>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDistance(dist)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{formatStockAge(product.stockUpdatedAt)}</span>
                  </div>
                </button>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {product.onSale && product.salePrice != null ? (
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: '#E05C00' }}>
                        {displayPrice.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {product.price.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      {displayPrice.toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${STOCK_DOT[product.stockLevel]}`} />
                    <span className={`text-[10px] font-semibold ${STOCK_TEXT[product.stockLevel]}`}>
                      {STOCK_LABEL[product.stockLevel]}
                    </span>
                  </div>
                  {inStock && (
                    <button
                      onClick={() => navigate(`/reserve/${product.id}`)}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ background: '#E05C00' }}
                    >
                      Reservieren
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-semibold text-gray-500 mb-1">Keine Produkte gefunden</p>
              <p className="text-xs text-gray-400">Versuche einen anderen Suchbegriff oder Filter.</p>
            </div>
          )}
          <div className="text-center text-xs text-gray-300 py-2">— Ende der Ergebnisse —</div>
        </div>
      </div>
    </div>
  )
}
