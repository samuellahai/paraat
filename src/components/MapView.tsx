import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Product } from '../types'
import { Link } from 'react-router-dom'

// Fix default marker icons for Vite/webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const brandIcon = L.divIcon({
  html: `<div style="
    width:32px;height:32px;background:#E05C00;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
})

const userIcon = L.divIcon({
  html: `<div style="
    width:16px;height:16px;background:#3b82f6;border-radius:50%;
    border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

interface RecenterProps {
  center: [number, number]
}

function Recenter({ center }: RecenterProps) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

interface MapViewProps {
  products: Product[]
  userLocation: [number, number] | null
  selectedId?: string
  onSelectProduct?: (id: string) => void
  onStoreClick?: (storeId: string) => void
}

export default function MapView({ products, userLocation, selectedId: _selectedId, onSelectProduct, onStoreClick }: MapViewProps) {
  const defaultCenter: [number, number] = userLocation ?? [52.536, 13.415]

  // Group products by store
  const storeMap = new Map<string, { lat: number; lng: number; products: Product[] }>()
  for (const p of products) {
    const key = p.store.id
    if (!storeMap.has(key)) {
      storeMap.set(key, { lat: p.store.lat, lng: p.store.lng, products: [] })
    }
    storeMap.get(key)!.products.push(p)
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      className="w-full h-full rounded-xl"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <>
          <Recenter center={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <span className="text-sm font-medium">Dein Standort</span>
            </Popup>
          </Marker>
        </>
      )}
      {Array.from(storeMap.entries()).map(([storeId, data]) => (
        <Marker
          key={storeId}
          position={[data.lat, data.lng]}
          icon={brandIcon}
          eventHandlers={{
            click: () => {
              if (onSelectProduct && data.products[0]) {
                onSelectProduct(data.products[0].id)
              }
            },
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-semibold text-gray-900 text-sm mb-1">{data.products[0]?.store.name}</p>
              <p className="text-xs text-gray-500 mb-2">{data.products[0]?.store.address}</p>
              {data.products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-0.5">
                  <span className="text-xs text-gray-700 truncate max-w-[110px]">{p.name}</span>
                  <span
                    className={`text-xs font-medium ml-2 ${
                      p.available && p.stock > 0 ? 'text-green-600' : 'text-red-400'
                    }`}
                  >
                    {p.available && p.stock > 0 ? `${p.stock}×` : 'n.v.'}
                  </span>
                </div>
              ))}
              {data.products.length > 3 && (
                <p className="text-xs text-gray-400 mt-1">+{data.products.length - 3} weitere</p>
              )}
              {onStoreClick ? (
                <button
                  onClick={() => onStoreClick(storeId)}
                  className="mt-2 block w-full text-center text-xs font-semibold py-1 rounded-lg"
                  style={{ background: '#E05C00', color: 'white' }}
                >
                  Alle Produkte →
                </button>
              ) : (
                <Link
                  to={`/store/${storeId}`}
                  className="mt-2 block text-center text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Zum Händler →
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
