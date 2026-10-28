import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Crosshair, X } from 'lucide-react'
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

const CATEGORIES = ['Alle', '🚲 Fahrrad', '🏋️ Sport', '🏠 Haushalt', '🥦 Lebensmittel']

const SHEET_H = 490
const PEEK_VIS = 65
const MID_VIS = 275
const SNAP_PEEK = SHEET_H - PEEK_VIS  // 425
const SNAP_MID  = SHEET_H - MID_VIS   // 215
const SNAP_FULL = 0

const DEFAULT_LOC: [number, number] = [52.3759, 9.7320]

const CATEGORY_EMOJI: Record<string, string> = {
  Lebensmittel: '🥦',
  Elektronik: '💻',
  Mode: '👕',
  Backwaren: '🍞',
  Sport: '🏋️',
}

export default function Home() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [filterOpen, setFilterOpen] = useState(false)
  const [pendingCategory, setPendingCategory] = useState('Alle')
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_LOC)
  const [locating, setLocating] = useState(false)

  // Bottom sheet state
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
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setLocating(false)
      },
      () => {
        setLocating(false)
      },
      { timeout: 6000, enableHighAccuracy: true }
    )
  }, [])

  // Try geolocation on mount (silent)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => { /* keep default */ },
        { timeout: 5000 }
      )
    }
  }, [])

  const visibleHeight = SHEET_H - ty
  const isExpanded = visibleHeight >= MID_VIS - 30

  const availableProducts = products.filter((p) => p.available && p.stock > 0)

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-200">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapView products={products} userLocation={userLocation} />
      </div>

      {/* Top overlay gradient */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-3 pt-3 pb-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
      >
        {/* App name row */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xl font-black tracking-wide"
            style={{ color: '#E05C00', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
          >
            Paraat
          </span>
          {/* Locate me */}
          <button
            onClick={handleLocate}
            disabled={locating}
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-white/90"
            aria-label="Standort ermitteln"
          >
            <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin text-brand-500' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Search bar + Filter button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12" height="12" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="#aaa" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              readOnly
              placeholder="Was suchst du?"
              className="w-full rounded-xl py-2 pl-8 pr-3 text-sm text-gray-500 bg-white shadow-md outline-none cursor-pointer"
              onClick={() => navigate('/results')}
            />
          </div>
          <button
            onClick={() => { setPendingCategory(activeCategory); setFilterOpen(true) }}
            className="flex items-center gap-1.5 px-3 rounded-xl shadow-md text-white text-xs font-bold flex-shrink-0"
            style={{ background: activeCategory !== 'Alle' ? '#E05C00' : '#333' }}
            aria-label="Filter"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M7 12h10M11 18h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Filter{activeCategory !== 'Alle' ? ' ●' : ''}
          </button>
        </div>
      </div>

      {/* Filter modal */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-50 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          {/* Sheet */}
          <div
            className="absolute left-0 right-0 bottom-[54px] z-50 bg-white rounded-t-2xl shadow-2xl"
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
          >
            {/* Handle + header */}
            <div className="px-4 pt-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Filter</h2>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="px-4 py-5 space-y-5">
              {/* Category */}
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
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply button */}
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
        {/* Drag zone */}
        <div
          className="flex-shrink-0 px-3.5 pt-2 pb-2.5 select-none"
          style={{ cursor: 'grab', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => snapTo(ty)}
        >
          <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-2.5" />
          <div className="text-base font-bold text-gray-900">In der Nähe</div>
          <div className="flex justify-between mt-0.5" style={{ minHeight: 18 }}>
            <span className="text-xs text-gray-500">
              {isExpanded ? `${availableProducts.length} Produkte verfügbar` : ''}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: isExpanded ? '#E05C00' : 'transparent' }}
            >
              Entfernung ↕
            </span>
          </div>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-2">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-b-0"
            >
              {/* Tapping the main area → product detail */}
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
              >
                <div className="w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0 text-xl">
                  {CATEGORY_EMOJI[product.category] ?? '🏪'}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/store/${product.store.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-bold text-gray-900 truncate hover:text-brand-600 transition-colors block"
                  >
                    {product.store.name}
                  </Link>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">
                    {formatDistance(
                      getDistance(userLocation[0], userLocation[1], product.store.lat, product.store.lng)
                    )}{' '}
                    · {product.name}
                  </div>
                </div>
              </button>
              {/* Price + badge + reserve */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {product.onSale && product.salePrice != null ? (
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold" style={{ color: '#E05C00' }}>
                      {product.salePrice.toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      {product.price.toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-gray-900">
                    {product.price.toFixed(2).replace('.', ',')} €
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${STOCK_DOT[product.stockLevel]}`} />
                  <span className={`text-[10px] font-semibold ${STOCK_TEXT[product.stockLevel]}`}>
                    {STOCK_LABEL[product.stockLevel]}
                  </span>
                </div>
                <span className="text-[9px] text-gray-400">{formatStockAge(product.stockUpdatedAt)}</span>
                {product.stockLevel !== 'none' && (
                  <button
                    onClick={() => navigate(`/reserve/${product.id}`)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: '#E05C00' }}
                  >
                    Reservieren
                  </button>
                )}
              </div>
            </div>
          ))}
          {availableProducts.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">Keine Produkte verfügbar</p>
          )}
          <div className="text-center text-xs text-gray-300 py-2">— Ende der Ergebnisse —</div>
        </div>
      </div>
    </div>
  )
}
