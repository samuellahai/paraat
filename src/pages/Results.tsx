import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPin, List, Map as MapIcon, ArrowLeft, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import MapView from '../components/MapView'
import { products, getDistance } from '../data/mockData'

const USER_LAT = 52.3759
const USER_LNG = 9.7320

type SortKey = 'distance' | 'price_asc' | 'price_desc' | 'availability'

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'map'>('list')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [sortBy, setSortBy] = useState<SortKey>('distance')
  const [showFilters, setShowFilters] = useState(false)
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const categoryParam = searchParams.get('category')
  const storeIdParam = searchParams.get('storeId')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = products

    if (storeIdParam) {
      list = list.filter((p) => p.store.id === storeIdParam)
    }
    if (categoryParam) {
      list = list.filter((p) => p.category === categoryParam)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.store.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    if (onlyAvailable) {
      list = list.filter((p) => p.available && p.stock > 0)
    }

    const withDist = list.map((p) => ({
      ...p,
      distance: getDistance(USER_LAT, USER_LNG, p.store.lat, p.store.lng),
    }))

    switch (sortBy) {
      case 'distance':
        return withDist.sort((a, b) => a.distance - b.distance)
      case 'price_asc':
        return withDist.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return withDist.sort((a, b) => b.price - a.price)
      case 'availability':
        return withDist.sort((a, b) => b.stock - a.stock)
    }
  }, [query, categoryParam, storeIdParam, sortBy, onlyAvailable])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    const next = new URLSearchParams(searchParams)
    if (val) next.set('q', val)
    else next.delete('q')
    setSearchParams(next)
  }

  const clearFilters = () => {
    setQuery('')
    setSearchParams(new URLSearchParams())
    setSortBy('distance')
    setOnlyAvailable(true)
  }

  const activeFilterCount =
    (query ? 1 : 0) + (categoryParam ? 1 : 0) + (storeIdParam ? 1 : 0) + (!onlyAvailable ? 1 : 0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Produkt suchen..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-brand-300 focus:outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2 rounded-xl transition-colors ${
              showFilters ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-brand-500 text-white' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-2 ${view === 'map' ? 'bg-brand-500 text-white' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="max-w-5xl mx-auto mt-2 pb-2 flex flex-wrap gap-2 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-brand-300"
            >
              <option value="distance">Nächste zuerst</option>
              <option value="price_asc">Preis aufsteigend</option>
              <option value="price_desc">Preis absteigend</option>
              <option value="availability">Höchster Bestand</option>
            </select>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-3.5 h-3.5 accent-brand-500"
              />
              <span className="text-xs text-gray-600">Nur verfügbare</span>
            </label>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`pt-${showFilters ? '32' : '24'} px-4 pb-10 max-w-5xl mx-auto w-full`}
        style={{ paddingTop: showFilters ? '6rem' : '4rem', paddingBottom: '70px' }}
      >
        {/* Context header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            {storeIdParam && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-medium">
                  {products.find((p) => p.store.id === storeIdParam)?.store.name}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
              {query && ` für „${query}"`}
              {categoryParam && ` in ${categoryParam}`}
            </p>
          </div>
          {storeIdParam && (
            <Link
              to="/results"
              className="text-xs text-brand-600 hover:underline"
            >
              Alle Läden
            </Link>
          )}
        </div>

        {view === 'list' ? (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-700 mb-1">Keine Produkte gefunden</p>
                <p className="text-sm text-gray-400">Versuche andere Suchbegriffe oder Filter</p>
                <button onClick={clearFilters} className="mt-4 text-sm text-brand-600 hover:underline">
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  distance={p.distance}
                  highlight={selectedId === p.id}
                />
              ))
            )}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
            <MapView
              products={filtered}
              userLocation={[USER_LAT, USER_LNG]}
              selectedId={selectedId}
              onSelectProduct={setSelectedId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
