import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Crosshair, ChevronDown, Zap } from 'lucide-react'
import MapView from '../components/MapView'
import { products } from '../data/mockData'

const CATEGORIES = ['Alle', 'Lebensmittel', 'Elektronik', 'Mode', 'Backwaren', 'Sport']

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locating, setLocating] = useState(false)
  const [mapHeight, setMapHeight] = useState(360)

  const handleLocate = useCallback(() => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setLocating(false)
      },
      () => {
        // Fallback to Berlin center
        setUserLocation([52.536, 13.415])
        setLocating(false)
      },
      { timeout: 6000 }
    )
  }, [])

  useEffect(() => {
    // Set Berlin as default
    setUserLocation([52.536, 13.415])
  }, [])

  // Responsive map height
  useEffect(() => {
    const update = () => setMapHeight(window.innerHeight < 700 ? 280 : 360)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category !== 'Alle') params.set('category', category)
    navigate(`/results?${params.toString()}`)
  }

  const availableCount = products.filter((p) => p.available && p.stock > 0).length

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-700 pt-20 pb-6 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Zap className="w-3 h-3" />
            {availableCount} Produkte verfügbar in Berlin
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
            Finde lokale Produkte.<br />
            <span className="text-orange-200">Sofort reservieren.</span>
          </h1>
          <p className="text-orange-100 text-sm mb-6">
            Entdecke verfügbare Produkte in Läden um dich herum und reserviere sie für nur 2 €.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Produkt suchen..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-gray-50 focus:bg-white border border-transparent focus:border-brand-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl bg-gray-50 border border-transparent focus:border-brand-300 focus:outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Suchen
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="relative px-4 -mt-4 max-w-5xl mx-auto w-full">
        <div
          className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          style={{ height: mapHeight }}
        >
          <MapView products={products} userLocation={userLocation} />
        </div>

        {/* Locate button */}
        <button
          onClick={handleLocate}
          disabled={locating}
          className="absolute bottom-4 right-8 flex items-center gap-1.5 bg-white shadow-lg border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin text-brand-500' : ''}`} />
          {locating ? 'Suche...' : 'Standort'}
        </button>
      </div>

      {/* Quick links */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-6 mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Kategorien
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.slice(1).map((cat) => {
            const count = products.filter((p) => p.category === cat && p.available && p.stock > 0).length
            const emoji: Record<string, string> = {
              Lebensmittel: '🥦',
              Elektronik: '💻',
              Mode: '👕',
              Backwaren: '🍞',
              Sport: '🏃',
            }
            return (
              <button
                key={cat}
                onClick={() => navigate(`/results?category=${cat}`)}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <span className="text-2xl block mb-1">{emoji[cat]}</span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 block">{cat}</span>
                <span className="text-xs text-gray-400">{count} verfügbar</span>
              </button>
            )
          })}
        </div>

        {/* Nearby stores */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-3">
          <MapPin className="inline w-3.5 h-3.5 mr-1" />
          Läden in der Nähe
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[...new Map(products.map((p) => [p.store.id, p.store])).values()].map((store) => {
            const storeProducts = products.filter((p) => p.store.id === store.id && p.available && p.stock > 0)
            return (
              <button
                key={store.id}
                onClick={() => navigate(`/results?storeId=${store.id}`)}
                className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl px-4 py-3 text-left shadow-sm hover:shadow-md hover:border-brand-200 transition-all min-w-[160px]"
              >
                <p className="text-sm font-semibold text-gray-800 truncate">{store.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{store.address}</p>
                <p className="text-xs text-brand-600 font-medium mt-1">{storeProducts.length} Produkte</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
